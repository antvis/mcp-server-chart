import { z } from "zod";

import {
  AxisXTitleSchema,
  BackgroundColorSchema,
  HeightSchema,
  PaletteSchema,
  TextureSchema,
  ThemeSchema,
  TitleSchema,
  WidthSchema,
} from "./base";

// Dual axes series schema
const DualAxesSeriesSchema = z.object({
  type: z
    .enum(["column", "line"])
    .describe("The optional value can be 'column' or 'line'."),
  data: z
    .array(z.number())
    .describe(
      "When type is column, the data represents quantities, such as [91.9, 99.1, 101.6, 114.4, 121]. When type is line, the data represents ratios and its values are recommended to be less than 1, such as [0.055, 0.06, 0.062, 0.07, 0.075].",
    ),
  axisYTitle: z
    .string()
    .prefault("")
    .describe(
      "Set the y-axis title of the chart series, such as, axisYTitle: '销售额'.",
    )
    .optional(),
});

// Dual axes chart input schema
const schema = z.object({
  categories: z
    .tuple([z.string()], z.string())
    .check(z.minLength(1))
    .describe(
      "Categories for dual axes chart, such as, ['2015', '2016', '2017'].",
    ),
  series: z
    .tuple([DualAxesSeriesSchema], DualAxesSeriesSchema)
    .check(z.minLength(1))
    .describe(
      "Series for dual axes chart, such as, [{ type: 'column', data: [91.9, 99.1, 101.6, 114.4, 121], axisYTitle: '销售额' }, { type: 'line', data: [0.055, 0.06, 0.062, 0.07, 0.075], 'axisYTitle': '利润率' }].",
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
});

// Dual axes chart tool descriptor
const tool = {
  name: "generate_dual_axes_chart",
  description:
    "Generate a dual axes chart which is a combination chart that integrates two different chart types, typically combining a bar chart with a line chart to display both the trend and comparison of data, such as, the trend of sales and profit over time.",
  inputSchema: schema,
};

export const dualAxes = {
  schema,
  tool,
};
