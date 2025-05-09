import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import { BaseConfigSchema } from "./base";

// Scatter chart data schema
const ScatterChartDataSchema = z.object({
  x: z.number(),
  y: z.number(),
});

// Scatter chart input schema
export const ScatterChartInputSchema = z.object({
  data: z
    .array(ScatterChartDataSchema)
    .describe("Data for scatter chart, such as, [{ x: 10, y: 15 }]."),
  width: BaseConfigSchema.width.optional(),
  height: BaseConfigSchema.height.optional(),
  title: BaseConfigSchema.title,
  axisXTitle: BaseConfigSchema.axisXTitle,
  axisYTitle: BaseConfigSchema.axisYTitle,
});

// Scatter chart tool descriptor
export const ScatterChartTool = {
  name: "generate_scatter_chart",
  description:
    "Generate a scatter chart to show the relationship between two variables, helps discover their relationship or trends, such as, the strength of correlation, data distribution patterns.",
  inputSchema: zodToJsonSchema(ScatterChartInputSchema),
}; 