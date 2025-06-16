import { generateChartUrl as antvisGenerate } from "./generate";
import { MinioGenerator } from "./generateMinio";

enum GenerateStrategyType {
  Antvis = "ANTVIS",
  Minio = "MINIO",
}

interface GenerateStrategy {
  generate(type: string, options: Record<string, any>): Promise<string>;
}

class AntvisGenerateStrategy implements GenerateStrategy {
  async generate(
    type: string,
    options: Record<string, any>,
  ): Promise<string> {
    return await antvisGenerate(type, options);
  }
}

class MinioGenerateStrategy implements GenerateStrategy {
  async generate(
    type: string,
    options: Record<string, any>,
  ): Promise<string> {
    const minioGenerator = MinioGenerator.getInstance();
    return await minioGenerator.generate(type, options);
  }
}

const strategies: Record<GenerateStrategyType, GenerateStrategy> = {
  [GenerateStrategyType.Antvis]: new AntvisGenerateStrategy(),
  [GenerateStrategyType.Minio]: new MinioGenerateStrategy(),
};

export function getStrategy(type: string): GenerateStrategy {
  const matchedStrategyType = Object.keys(GenerateStrategyType).find(
    (key) => key.toLowerCase() === type.toLowerCase(),
  );

  if (matchedStrategyType) {
    const enumValue =
      GenerateStrategyType[
        matchedStrategyType as keyof typeof GenerateStrategyType
      ];
    return strategies[enumValue];
  }

  throw new Error(
    `Strategy "${type}" not found. Available strategies: ${Object.values(
      GenerateStrategyType,
    ).join(", ")}`,
  );
}
