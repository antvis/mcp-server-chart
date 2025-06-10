import { z } from "zod";
import { zodToJsonSchema } from "../utils";
import {
  AxisXTitleSchema,
  AxisYTitleSchema,
  HeightSchema,
  ThemeSchema,
  TitleSchema,
  WidthSchema,
} from "./base";

// Column chart data schema
const data = z.object({
  category: z.string(),
  value: z.number(),
  group: z.string().optional(),
});

// Column chart input schema
const schema = {
  data: z
    .array(data)
    .describe(
      "Data for column chart, such as, [{ category: '北京', value: 825, group: '油车' }].",
    )
    .nonempty({ message: "Column chart data cannot be empty." }),
  group: z
    .boolean()
    .optional()
    .default(true)
    .describe(
      "Whether grouping is enabled. When enabled, column charts require a 'group' field in the data. When `group` is true, `stack` should be false.",
    ),
  stack: z
    .boolean()
    .optional()
    .default(false)
    .describe(
      "Whether stacking is enabled. When enabled, column charts require a 'group' field in the data. When `stack` is true, `group` should be false.",
    ),
  theme: ThemeSchema,
  width: WidthSchema,
  height: HeightSchema,
  title: TitleSchema,
  axisXTitle: AxisXTitleSchema,
  axisYTitle: AxisYTitleSchema,
};

// Column chart tool descriptor
const tool = {
  name: "generate_column_chart",
  description:
    "Generate a column chart, which are best for comparing categorical data, such as, when values are close, column charts are preferable because our eyes are better at judging height than other visual elements like area or angles.",
  inputSchema: zodToJsonSchema(schema),
};

export const column = {
  schema,
  tool,
};
