import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import { BaseConfigSchema } from "../base";

// Line chart data schema
const LineChartDataSchema = z.object({
  time: z.string(),
  value: z.number(),
  group: z.string().optional(),
});

// Line chart input schema
export const LineChartInputSchema = z.object({
  data: z
    .array(LineChartDataSchema)
    .describe("Data for line chart, such as, [{ time: '2015', value: 23 }]."),
  stack: z
    .boolean()
    .optional()
    .describe(
      "Whether stacking is enabled. When enabled, line charts require a 'group' field in the data.",
    ),
  width: BaseConfigSchema.width.optional(),
  height: BaseConfigSchema.height.optional(),
  title: BaseConfigSchema.title,
  axisXTitle: BaseConfigSchema.axisXTitle,
  axisYTitle: BaseConfigSchema.axisYTitle,
});

// Line chart tool descriptor
export const LineChartTool = {
  name: "generate_line_chart",
  description:
    "Generate a line chart to show trends over time, such as, the ratio of Apple computer sales to Apple's profits changed from 2000 to 2016.",
  inputSchema: zodToJsonSchema(LineChartInputSchema),
};
