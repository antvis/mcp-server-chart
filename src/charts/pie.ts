import { z } from "zod";
import { zodToJsonSchema } from "../utils";
import { HeightSchema, ThemeSchema, TitleSchema, WidthSchema } from "./base";

// Pie chart data schema
const data = z.object({
  category: z.string(),
  value: z.number(),
});

// Pie chart input schema
const schema = {
  data: z
    .array(data)
    .describe(
      "Data for pie chart, such as, [{ category: '分类一', value: 27 }].",
    )
    .nonempty({ message: "Pie chart data cannot be empty." }),
  innerRadius: z
    .number()
    .default(0)
    .describe(
      "Set the innerRadius of pie chart, the value between 0 and 1. Set the pie chart as a donut chart. Set the value to 0.6 or number in [0 ,1] to enable it.",
    ),
  theme: ThemeSchema,
  width: WidthSchema,
  height: HeightSchema,
  title: TitleSchema,
};

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
