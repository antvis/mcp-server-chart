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

// Line chart data schema
const data = z.object({
  time: z.string(),
  value: z.number(),
  group: z.string().optional(),
});

// Line chart input schema
const schema = {
  data: z
    .array(data)
    .describe(
      "Data for line chart, it should be an array of objects, each object contains a `time` field and a `value` field, such as, [{ time: '2015', value: 23 }, { time: '2016', value: 32 }].",
    )
    .nonempty({ message: "Line chart data cannot be empty." }),
  style: z
    .object({
      texture: TextureSchema,
      backgroundColor: BackgroundColorSchema,
      palette: PaletteSchema,
      lineWidth: z
        .number()
        .optional()
        .describe("Line width for the lines of chart, such as 4."),
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
