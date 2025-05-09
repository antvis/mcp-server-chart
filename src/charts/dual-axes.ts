import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import { BaseConfigSchema } from "./base";

// Dual axes series schema
const DualAxesSeriesSchema = z.object({
  type: z
    .enum(["column", "line"])
    .describe("The optional value can be 'column' or 'line'."),
  data: z
    .array(z.number())
    .describe(
      "When type is column, the data represents quantities. When type is line, the data represents ratios.",
    ),
  axisYTitle: z.string().describe("Set the y-axis title of the chart series."),
});

// Dual axes chart input schema
export const DualAxesChartInputSchema = z.object({
  categories: z
    .array(z.string())
    .describe(
      "Categories for dual axes chart, such as, ['2015', '2016', '2017'].",
    ),
  series: z.array(DualAxesSeriesSchema),
  width: BaseConfigSchema.width.optional(),
  height: BaseConfigSchema.height.optional(),
  title: BaseConfigSchema.title,
  axisXTitle: BaseConfigSchema.axisXTitle,
});

// Dual axes chart tool descriptor
export const DualAxesChartTool = {
  name: "generate_dual_axes_chart",
  description:
    "Generate a dual axes chart which is a combination chart that integrates two different chart types, typically combining a bar chart with a line chart to display both the trend and comparison of data, such as, the trend of sales and profit over time.",
  inputSchema: zodToJsonSchema(DualAxesChartInputSchema),
};
