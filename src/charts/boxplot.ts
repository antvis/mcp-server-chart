import { z } from "zod";

import {
  AxisXTitleSchema,
  AxisYTitleSchema,
  BackgroundColorSchema,
  HeightSchema,
  PaletteSchema,
  TextureSchema,
  ThemeSchema,
  TitleSchema,
  WidthSchema,
} from "./base";

const data = z.object({
  category: z
    .string()
    .describe("Category of the data point, such as '分类一'."),
  value: z.number().describe("Value of the data point, such as 10."),
  group: z
    .string()
    .optional()
    .describe(
      "Optional group for the data point, used for grouping in the boxplot.",
    ),
});

const schema = z.object({
  data: z
    .tuple([data], data)
    .check(z.minLength(1))
    .describe(
      "Data for boxplot chart, such as, [{ category: '分类一', value: 10 }] or [{ category: '分类二', value: 20, group: '组别一' }].",
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
  axisXTitle: AxisXTitleSchema,
  axisYTitle: AxisYTitleSchema,
});

const tool = {
  name: "generate_boxplot_chart",
  description:
    "Generate a boxplot chart to show data for statistical summaries among different categories, such as, comparing the distribution of data points across categories.",
  inputSchema: schema,
};

export const boxplot = {
  schema,
  tool,
};
