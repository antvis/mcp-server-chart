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
import { line } from "./line";

// Area chart data schema
const data = z.object({
  time: z.string(),
  value: z.number(),
  group: z.string().optional(),
});

// Area chart input schema
const schema = {
  data: z
    .array(data)
    .describe(
      "Data for area chart, it should be an array of objects, each object contains a `time` field and a `value` field, such as, [{ time: '2015', value: 23 }, { time: '2016', value: 32 }], when stacking is needed for area, the data should contain a `group` field, such as, [{ time: '2015', value: 23, group: 'A' }, { time: '2015', value: 32, group: 'B' }].",
    )
    .nonempty({ message: "Area chart data cannot be empty." }),
  stack: z
    .boolean()
    .optional()
    .default(false)
    .describe(
      "Whether stacking is enabled. When enabled, area charts require a 'group' field in the data.",
    ),
  style: z
    .object({
      backgroundColor: BackgroundColorSchema,
      palette: PaletteSchema,
      texture: TextureSchema,
      lineWidth: z
        .number()
        .optional()
        .describe("Line width for the lines of chart, such as 4."),
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

// Area chart tool descriptor
const tool = {
  name: "generate_area_chart",
  description:
    "Generate a area chart to show data trends under continuous independent variables and observe the overall data trend, such as, displacement = velocity (average or instantaneous) × time: s = v × t. If the x-axis is time (t) and the y-axis is velocity (v) at each moment, an area chart allows you to observe the trend of velocity over time and infer the distance traveled by the area's size.",
  inputSchema: zodToJsonSchema(schema),
};

export const area = {
  schema,
  tool,
};
