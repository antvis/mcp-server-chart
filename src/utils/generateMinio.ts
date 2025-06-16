import fs from "node:fs";
import path from "node:path";
import { render } from "@antv/gpt-vis-ssr";
import type { Options } from "@antv/gpt-vis-ssr/dist/esm/types";
import { Client } from "minio";
import { v4 as uuidv4 } from "uuid";
import {
  getMinioAccessKey,
  getMinioBucketName,
  getMinioEndpoint,
  getMinioObjectExpirySeconds,
  getMinioPort,
  getMinioSecretsKey,
  getMinioUsePublicBucket,
  getMinioUseSSL,
} from "./env";

class MinioGenerator {
  private static instance: MinioGenerator;
  private endpoint: string;
  private port: number;
  private useSSL: boolean;
  private accessKey: string;
  private secretsKey: string;
  private usePublicBucket: boolean;
  private objectExpirySeconds: number;
  private bucketName: string;
  private minioClient?: Client;

  private constructor() {
    this.endpoint = getMinioEndpoint();
    this.port = getMinioPort();
    this.useSSL = getMinioUseSSL();
    this.accessKey = getMinioAccessKey();
    this.secretsKey = getMinioSecretsKey();
    this.usePublicBucket = getMinioUsePublicBucket();
    this.objectExpirySeconds = getMinioObjectExpirySeconds();
    this.bucketName = getMinioBucketName();
  }

  static getInstance(): MinioGenerator {
    if (!MinioGenerator.instance) {
      MinioGenerator.instance = new MinioGenerator();
    }
    return MinioGenerator.instance;
  }

  async generate(
    type: string,
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    options: Record<string, any>,
  ): Promise<string> {
    await this.initBucket();
    const filePath = await this.generateChartFile(type, options);
    return await this.uploadToMinio(filePath);
  }

  private async initClient() {
    if (!this.minioClient) {
      this.minioClient = new Client({
        endPoint: this.endpoint,
        port: this.port,
        useSSL: this.useSSL,
        accessKey: this.accessKey,
        secretKey: this.secretsKey,
      });
    }
  }

  private async initBucket() {
    try {
      await this.initClient();
      const bucketExists = await this.minioClient?.bucketExists(
        this.bucketName,
      );
      if (!bucketExists) {
        await this.minioClient?.makeBucket(this.bucketName);
        console.log(`Bucket "${this.bucketName}" created.`);
      }
      if (this.usePublicBucket) {
        await this.minioClient?.setBucketPolicy(
          this.bucketName,
          JSON.stringify({
            Version: "2012-10-17",
            Statement: [
              {
                Effect: "Allow",
                Principal: "*",
                Action: ["s3:GetObject"],
                Resource: [`arn:aws:s3:::${this.bucketName}/*`],
              },
            ],
          }),
        );
      }
    } catch (err) {
      console.error("Error:", err);
    }
  }

  private async generateChartFile(
    type: string,
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    options: Record<string, any>,
  ): Promise<string> {
    const reqOptions = {
      type,
      ...options,
      source: "mcp-server-chart",
    } as unknown as Options;
    const vis = await render(reqOptions);
    const buffer = await vis.toBuffer();
    const filename = `${uuidv4()}.png`;

    const imageDir = path.join(__dirname, "images");
    if (!fs.existsSync(imageDir)) {
      fs.mkdirSync(imageDir);
    }

    const filePath = path.join(imageDir, filename);
    fs.writeFileSync(filePath, buffer);

    return filePath;
  }

  private async uploadToMinio(filePath: string): Promise<string> {
    const objectName = path.basename(filePath);

    try {
      await this.minioClient?.fPutObject(
        this.bucketName,
        objectName,
        filePath,
        {
          "Content-Type": "image/jpeg",
        },
      );

      console.log(
        `File uploaded successfully to ${this.bucketName}/${objectName}`,
      );

      let url: string | undefined;
      if (this.usePublicBucket) {
        url = `${this.useSSL ? "https" : "http"}://${this.endpoint}:${
          this.port
        }/${this.bucketName}/${objectName}`;
      } else {
        url = await this.minioClient?.presignedGetObject(
          this.bucketName,
          objectName,
          this.objectExpirySeconds,
        );
        url = this.useSSL
          ? url?.replace("http://", "https://")
          : url?.replace("https://", "http://");
      }

      if (!url) {
        throw Error(
          `Get url form minio failed: bucketName: ${this.bucketName}, objectName: ${objectName}`,
        );
      }

      console.log("Presigned URL:", url);

      try {
        fs.unlinkSync(filePath);
      } catch (err) {
        console.error("delete file failed:", err);
      }
      return url;
    } catch (err) {
      console.error("Error:", err);
      throw err;
    }
  }
}

export { MinioGenerator };
