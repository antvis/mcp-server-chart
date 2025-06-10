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

// Line chart data schema
const data = z.object({
  time: z.string(),
  value: z.number(),
});

// Line chart input schema
const schema = {
  data: z
    .array(data)
    .describe("Data for line chart, such as, [{ time: '2015', value: 23 }].")
    .nonempty({ message: "Line chart data cannot be empty." }),
  stack: z
    .boolean()
    .optional()
    .default(false)
    .describe(
      "Whether stacking is enabled. When enabled, line charts require a 'group' field in the data.",
    ),
  theme: ThemeSchema,
  width: WidthSchema,
  height: HeightSchema,
  title: TitleSchema,
  axisXTitle: AxisXTitleSchema,
  axisYTitle: AxisYTitleSchema,
};

// Line chart tool descriptor
const tool = {
  name: "generate_line_chart",
  description:
    "Generate a line chart to show trends over time, such as, the ratio of Apple computer sales to Apple's profits changed from 2000 to 2016.",
  inputSchema: zodToJsonSchema(schema),
};

export const line = {
  schema,
  tool,
};
