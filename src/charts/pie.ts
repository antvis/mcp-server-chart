import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import { BaseConfigSchema } from "./base";

// Pie chart data schema
const data = z.object({
  category: z.string(),
  value: z.number(),
});

// Pie chart input schema
const schema = z.object({
  data: z
    .array(data)
    .describe(
      "Data for pie chart, (such as, [{ category: '分类一', value: 27 }])",
    ),
  innerRadius: z
    .number()
    .default(0)
    .describe(
      "Set the pie chart as a donut chart. Set the value to 0.6 to enable it.",
    ),
  width: BaseConfigSchema.width.optional(),
  height: BaseConfigSchema.height.optional(),
  title: BaseConfigSchema.title,
});

// Pie chart tool descriptor
const tool = {
  name: "generate_pie_chart",
  description:
    "Generate a pie chart to show the proportion of parts, such as, market share and budget allocation.",
  inputSchema: zodToJsonSchema(schema),
};

export const pie = {
  schema,
  tool,
}; 