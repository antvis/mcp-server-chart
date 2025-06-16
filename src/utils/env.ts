/**
 * Get the VIS_GENERATE_STRATEGY from environment variables.
 */
export function getVisGenerateStrategy() {
  return process.env.VIS_GENERATE_STRATEGY || "antvis";
}

/**
 * Get the VIS_REQUEST_SERVER from environment variables.
 */
export function getVisRequestServer() {
  return (
    process.env.VIS_REQUEST_SERVER ||
    "https://antv-studio.alipay.com/api/gpt-vis"
  );
}

/**
 * Get the MINIO_ENDPOINT from environment variables.
 */
export function getMinioEndpoint() {
  return process.env.MINIO_ENDPOINT || "127.0.0.1";
}

/**
 * Get the MINIO_PORT from environment variables.
 */
export function getMinioPort(): number {
  const envPort = process.env.MINIO_PORT;

  if (!envPort) {
    return 9000;
  }

  const port = Number.parseInt(envPort, 10);

  if (Number.isNaN(port)) {
    throw new Error(`Invalid MINIO_PORT: "${envPort}" must be a number`);
  }

  if (port < 1 || port > 65535) {
    throw new Error(`Invalid MINIO_PORT: ${port} must be between 1 and 65535`);
  }

  return port;
}

/**
 * Get the MINIO_USE_SSL from environment variables.
 */
export function getMinioUseSSL(): boolean {
  return getBooleanFromEnv("MINIO_USE_SSL");
}

/**
 * Get the MINIO_ACCESS_KEY from environment variables.
 */
export function getMinioAccessKey() {
  return process.env.MINIO_ACCESS_KEY || "minio";
}

/**
 * Get the MINIO_SECRET_KEY from environment variables.
 */
export function getMinioSecretsKey() {
  return process.env.MINIO_SECRET_KEY || "minioadmin";
}

/**
 * Get the MINIO_BUCKET_NAME from environment variables.
 */
export function getMinioBucketName() {
  return process.env.MINIO_BUCKET_NAME || "mcp-server-chart";
}

/**
 * Get the MINIO_USE_PUBLIC_BUCKET from environment variables.
 */
export function getMinioUsePublicBucket(): boolean {
  return getBooleanFromEnv("MINIO_USE_PUBLIC_BUCKET");
}

/**
 * Get the MINIO_OBJECT_EXPIRY_SECONDS from environment variables.
 */
export function getMinioObjectExpirySeconds(): number {
  const envPort = process.env.MINIO_OBJECT_EXPIRY_SECONDS;

  if (!envPort) {
    return 3600;
  }

  const port = Number.parseInt(envPort, 10);

  if (Number.isNaN(port)) {
    throw new Error(
      `Invalid MINIO_OBJECT_EXPIRY_SECONDS: "${envPort}" must be a number`,
    );
  }

  if (port < 0) {
    throw new Error(
      `Invalid MINIO_OBJECT_EXPIRY_SECONDS: ${port} must larger then 0`,
    );
  }

  return port;
}

function getBooleanFromEnv(envKey: string): boolean {
  const envValue = process.env[envKey];

  if (envValue === undefined || envValue === "") {
    return false;
  }

  const normalized = envValue.trim().toLowerCase();

  if (["true", "1", "yes", "y", "on"].includes(normalized)) {
    return true;
  }

  if (["false", "0", "no", "n", "off"].includes(normalized)) {
    return false;
  }

  throw new Error(`Invalid boolean value for ${envKey}: "${envValue}"`);
}
