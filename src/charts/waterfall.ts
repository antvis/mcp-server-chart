import { z } from "zod";
import { zodToJsonSchema } from "../utils";
import {
  AxisXTitleSchema,
  AxisYTitleSchema,
  BackgroundColorSchema,
  HeightSchema,
  TextureSchema,
  ThemeSchema,
  TitleSchema,
  WidthSchema,
} from "./base";

const data = z.object({
  category: z.string(),
  value: z.number().optional(),
  isIntermediateTotal: z.boolean().optional(),
  isTotal: z.boolean().optional(),
});

const schema = {
  data: z
    .array(data)
    .describe(
      "Data for waterfall chart, it should be an array of objects, each object contains a `category` field and a `value` field. The `isIntermediateTotal` field marks intermediate subtotals, and the `isTotal` field marks the final total. For example, [{ category: 'Initial', value: 100 }, { category: 'Increase', value: 50 }, { category: 'Subtotal', isIntermediateTotal: true }, { category: 'Decrease', value: -30 }, { category: 'Total', isTotal: true }].",
    )
    .nonempty({ message: "Waterfall chart data cannot be empty." }),
  positiveColor: z
    .string()
    .optional()
    .describe(
      "Color for positive values (increases), such as '#FF4D4F'. Default is red.",
    ),
  negativeColor: z
    .string()
    .optional()
    .describe(
      "Color for negative values (decreases), such as '#2EBB59'. Default is green.",
    ),
  totalColor: z
    .string()
    .optional()
    .describe(
      "Color for total and intermediate total bars, such as '#1783FF'. Default is blue.",
    ),
  style: z
    .object({
      backgroundColor: BackgroundColorSchema,
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

// Waterfall chart tool descriptor
const tool = {
  name: "generate_waterfall_chart",
  description:
    "Generate a waterfall chart to visualize the cumulative effect of sequentially introduced positive or negative values, such as showing how an initial value is affected by a series of intermediate positive or negative values leading to a final result. Waterfall charts are ideal for financial analysis, budget tracking, profit and loss statements, and understanding the composition of changes over time or categories.",
  inputSchema: zodToJsonSchema(schema),
};

export const waterfall = {
  schema,
  tool,
};
