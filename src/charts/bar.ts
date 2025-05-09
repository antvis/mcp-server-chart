import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import { BaseConfigSchema } from "./base";

// Bar chart data schema
const data = z.object({
  category: z.string(),
  value: z.number(),
  group: z.string().optional(),
});

// Bar chart input schema
const schema = z.object({
  data: z
    .array(data)
    .describe(
      "Data for bar chart, such as, [{ category: '分类一', value: 10 }].",
    ),
  group: z
    .boolean()
    .optional()
    .describe(
      "Whether grouping is enabled. When enabled, bar charts require a 'group' field in the data.",
    ),
  stack: z
    .boolean()
    .optional()
    .describe(
      "Whether stacking is enabled. When enabled, bar charts require a 'group' field in the data.",
    ),
  width: BaseConfigSchema.width.optional(),
  height: BaseConfigSchema.height.optional(),
  title: BaseConfigSchema.title,
  axisXTitle: BaseConfigSchema.axisXTitle,
  axisYTitle: BaseConfigSchema.axisYTitle,
});

// Bar chart tool descriptor
const tool = {
  name: "generate_bar_chart",
  description:
    "Generate a bar chart to show data for numerical comparisons among different categories, such as, comparing categorical data and for horizontal comparisons.",
  inputSchema: zodToJsonSchema(schema),
};

export const bar = {
  schema,
  tool,
};
