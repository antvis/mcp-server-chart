import { describe, expect, it } from "vitest";
import * as actualCharts from "../src/charts";
import * as expectedCharts from "./charts";

describe("charts schema check", () => {
  // Get the chart names from the rightCharts module
  const chartNames = Object.keys(expectedCharts);

  // Create a separate test case for each chart
  for (const chartName of chartNames) {
    it(`should check schema for ${chartName} chart`, () => {
      const schema = actualCharts[chartName].tool.inputSchema;
      const rightChart = expectedCharts[chartName];

      expect(schema).toEqual(rightChart.inputSchema);
    });
  }
});
