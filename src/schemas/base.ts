import { z } from "zod";

// Define Zod schemas for base configuration
export const BaseConfigSchema = {
  width: z
    .number()
    .default(600)
    .describe("Set the width of chart, default is 600."),
  height: z
    .number()
    .default(400)
    .describe("Set the height of chart, default is 400."),
  title: z.string().optional().describe("Set the title of chart."),
  axisXTitle: z.string().optional().describe("Set the x-axis title of chart."),
  axisYTitle: z.string().optional().describe("Set the y-axis title of chart."),
};

export const NodeSchema = z.object({
  name: z.string(),
});

export const EdgeSchema = z.object({
  source: z.string(),
  target: z.string(),
  name: z.string(),
});
