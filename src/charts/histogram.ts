import { z } from "zod";
import { zodToJsonSchema } from "../utils";
import {
  AxisXTitleSchema,
  AxisYTitleSchema,
  HeightSchema,
  TitleSchema,
  WidthSchema,
} from "./base";

// Histogram chart input schema
const schema = z.object({
  data: z
    .array(z.number())
    .describe("Data for histogram chart, such as, [78, 88, 60, 100, 95]."),
  binNumber: z
    .union([z.number(), z.undefined(), z.null()])
    .optional()
    .default(null)
    .describe(
      "Number of intervals to define the number of intervals in a histogram.",
    ),
  width: WidthSchema,
  height: HeightSchema,
  title: TitleSchema,
  axisXTitle: AxisXTitleSchema,
  axisYTitle: AxisYTitleSchema,
});

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
