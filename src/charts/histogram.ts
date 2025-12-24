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
    .array(z.number())
    .describe(
      "Data for histogram chart, it should be an array of numbers, such as, [78, 88, 60, 100, 95].",
    )
    .nonempty({ message: "Histogram chart data cannot be empty." }),
  binNumber: z
    .number()
    .optional()
    .describe(
      "Number of intervals to define the number of intervals in a histogram, when not specified, a built-in value will be used.",
    ),
  style: z
    .object({
      backgroundColor: BackgroundColorSchema,
      palette: PaletteSchema,
      texture: TextureSchema,
    })
    .optional()
    .describe(
      "Style configuration for the chart with a JSON object, optional.",
    ),
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
  annotations: {
    title: "Generate Histogram Chart",
    destructiveHint: true,
  },
};

export const histogram = {
  schema,
  tool,
};
