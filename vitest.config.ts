import { coverageConfigDefaults, defineConfig } from "vitest/config";

const enableCoverage = process.argv.includes("--coverage");

export default defineConfig({
  resolve: {},
  test: {
    testTimeout: 20_000,
    hookTimeout: 20_000,
    include: ["__tests__/**/*.{test,spec}.?(c|m)[jt]s?(x)"],
    ...(enableCoverage
      ? {
          coverage: {
            exclude: ["**/build/**", ...coverageConfigDefaults.exclude],
          },
        }
      : {}),
  },
});
