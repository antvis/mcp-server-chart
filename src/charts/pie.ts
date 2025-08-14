import { z } from "zod";

import {
  BackgroundColorSchema,
  HeightSchema,
  PaletteSchema,
  TextureSchema,
  ThemeSchema,
  TitleSchema,
  WidthSchema,
} from "./base";

// Pie chart data schema
const data = z.object({
  category: z.string(),
  value: z.number(),
});

// Pie chart input schema
const schema = z.object({
  data: z
    .tuple([data], data)
    .check(z.minLength(1))
    .describe(
      "Data for pie chart, it should be an array of objects, each object contains a `category` field and a `value` field, such as, [{ category: '分类一', value: 27 }].",
    ),
  innerRadius: z
    .number()
    .prefault(0)
    .describe(
      "Set the innerRadius of pie chart, the value between 0 and 1. Set the pie chart as a donut chart. Set the value to 0.6 or number in [0 ,1] to enable it.",
    ),
  style: z
    .object({
      backgroundColor: BackgroundColorSchema,
      palette: PaletteSchema,
      texture: TextureSchema,
    })
    .optional()
    .describe("Custom style configuration for the chart."),
  theme: ThemeSchema,
  width: WidthSchema,
  height: HeightSchema,
  title: TitleSchema,
});

// Pie chart tool descriptor
const tool = {
  name: "generate_pie_chart",
  description:
    "Generate a pie chart to show the proportion of parts, such as, market share and budget allocation.",
  inputSchema: schema,
};

export const pie = {
  schema,
  tool,
};
