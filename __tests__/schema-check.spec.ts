import { describe, it, expect } from "vitest";
import * as Charts from "../src/charts";
import * as rightCharts from "./charts";

describe("charts schema check", () => {
  // Get the chart names from the rightCharts module
  const chartNames = Object.keys(rightCharts);

  // Create a separate test case for each chart
  chartNames.forEach((chartName) => {
    it(`should check schema for ${chartName} chart`, () => {
      const schema = Charts[chartName].tool.inputSchema;
      const rightChart = rightCharts[chartName];

      expect(schema).toEqual(rightChart.inputSchema);
    });
  });
});
