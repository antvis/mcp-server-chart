import { z } from "zod";
import { zodToJsonSchema } from "../utils";
import {
  BackgroundColorSchema,
  HeightSchema,
  PaletteSchema,
  TextureSchema,
  ThemeSchema,
  TitleSchema,
  WidthSchema,
} from "./base";

// Radar chart data schema
const data = z.object({
  name: z.string(),
  value: z.number(),
  group: z.string().optional(),
});

// Radar chart input schema
const schema = {
  data: z
    .array(data)
    .describe(
      "Data for radar chart, it should be an array of objects, each object contains a `name` field and a `value` field, such as, [{ name: 'Design', value: 70 }], when the data is grouped by `group`, the `group` field is required, such as, [{ name: 'Design', value: 70, group: 'Huawei' }].",
    )
    .nonempty({ message: "Radar chart data cannot be empty." }),
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
};

// Radar chart tool descriptor
const tool = {
  name: "generate_radar_chart",
  description:
    "Generate a radar chart to display multidimensional data (four dimensions or more), such as, evaluate Huawei and Apple phones in terms of five dimensions: ease of use, functionality, camera, benchmark scores, and battery life.",
  inputSchema: zodToJsonSchema(schema),
};

export const radar = {
  schema,
  tool,
};
