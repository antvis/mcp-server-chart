import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import { BaseConfigSchema } from "./base";

// Column chart data schema
const ColumnChartDataSchema = z.object({
  category: z.string(),
  value: z.number(),
  group: z.string().optional(),
});

// Column chart input schema
export const ColumnChartInputSchema = z.object({
  data: z
    .array(ColumnChartDataSchema)
    .describe(
      "Data for column chart, such as, [{ category: '北京' value: 825; group: '油车' }].",
    ),
  group: z
    .boolean()
    .optional()
    .describe(
      "Whether grouping is enabled. When enabled, column charts require a 'group' field in the data.",
    ),
  stack: z
    .boolean()
    .optional()
    .describe(
      "Whether stacking is enabled. When enabled, column charts require a 'group' field in the data.",
    ),
  width: BaseConfigSchema.width.optional(),
  height: BaseConfigSchema.height.optional(),
  title: BaseConfigSchema.title,
  axisXTitle: BaseConfigSchema.axisXTitle,
  axisYTitle: BaseConfigSchema.axisYTitle,
});

// Column chart tool descriptor
export const ColumnChartTool = {
  name: "generate_column_chart",
  description:
    "Generate a column chart, which are best for comparing categorical data, such as, when values are close, column charts are preferable because our eyes are better at judging height than other visual elements like area or angles.",
  inputSchema: zodToJsonSchema(ColumnChartInputSchema),
};
