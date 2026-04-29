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

// Bar chart data schema
const data = z.object({
  category: z.string(),
  value: z.number(),
  group: z.string().optional(),
});

// Bar chart input schema
const schema = {
  data: z
    .array(data)
    .describe(
      "Data for bar chart, such as, [{ category: '分类一', value: 10 }, { category: '分类二', value: 20 }], when grouping or stacking is needed for bar, the data should contain a `group` field, such as, when [{ category: '北京', value: 825, group: '油车' }, { category: '北京', value: 1000, group: '电车' }].",
    )
    .nonempty({ message: "Bar chart data cannot be empty." }),
  group: z
    .boolean()
    .optional()
    .default(false)
    .describe(
      "Whether grouping is enabled. When enabled, bar charts require a 'group' field in the data. When `group` is true, `stack` should be false.",
    ),
  stack: z
    .boolean()
    .optional()
    .default(true)
    .describe(
      "Whether stacking is enabled. When enabled, bar charts require a 'group' field in the data. When `stack` is true, `group` should be false.",
    ),
  horizontal: z
    .boolean()
    .optional()
    .default(true)
    .describe(
      "Whether the bar chart is horizontal. When true (default), category is on Y-axis and value is on X-axis (standard bar chart orientation). When false, category is on X-axis and value is on Y-axis (column chart orientation, useful when user specifies 'Y-axis as Category').",
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

// Bar chart tool descriptor
const tool = {
  name: "generate_bar_chart",
  description:
    "Generate a bar chart to show data for numerical comparisons among different categories. Use the 'horizontal' parameter to control orientation: horizontal (default, category on Y-axis) for traditional bar charts, or horizontal=false (category on X-axis) when user specifies 'Y-axis as Category'.",
  inputSchema: zodToJsonSchema(schema),
  annotations: {
    title: "Generate Bar Chart",
    readOnlyHint: true,
  },
};

export const bar = {
  schema,
  tool,
};
