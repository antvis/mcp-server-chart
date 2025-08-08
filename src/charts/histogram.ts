import { z } from "zod";
import { zodToJsonSchema } from "../utils";
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

// Histogram chart input schema
const schema = {
  data: z
    .tuple([z.number()], z.number())
    .check(z.minLength(1))
    .describe(
      "Data for histogram chart, it should be an array of numbers, such as, [78, 88, 60, 100, 95].",
    ),
  binNumber: z
    .number()
    .nullable()
    .optional()
    .prefault(null)
    .describe(
      "Number of intervals to define the number of intervals in a histogram, when not specified, a default value will be used.",
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
};

// Histogram chart tool descriptor
const tool = {
  name: "generate_histogram_chart",
  description:
    "Generate a histogram chart to show the frequency of data points within a certain range. It can observe data distribution, such as, normal and skewed distributions, and identify data concentration areas and extreme points.",
  inputSchema: zodToJsonSchema(schema),
};

export const histogram = {
  schema,
  tool,
};
