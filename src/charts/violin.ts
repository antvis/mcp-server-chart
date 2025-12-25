import { z } from "zod";
import { zodToJsonSchema } from "../utils";
import {
  AxisXTitleSchema,
  AxisYTitleSchema,
  BackgroundColorSchema,
  HeightSchema,
  PaletteSchema,
  StartAtZeroSchema,
  TextureSchema,
  ThemeSchema,
  TitleSchema,
  WidthSchema,
} from "./base";

const data = z.object({
  category: z
    .string()
    .describe("Category of the data point, such as '分类一'."),
  value: z.number().describe("Value of the data point, such as 10."),
  group: z
    .string()
    .optional()
    .describe(
      "Optional group for the data point, used for grouping in the violin chart.",
    ),
});

const schema = {
  data: z
    .array(data)
    .describe(
      "Data for violin chart, such as, [{ category: 'Category A', value: 10 }], when the data is grouped, the 'group' field is required, such as, [{ category: 'Category B', value: 20, group: 'Group A' }].",
    )
    .nonempty({ message: "Violin chart data cannot be empty." }),
  style: z
    .object({
      backgroundColor: BackgroundColorSchema,
      palette: PaletteSchema,
      startAtZero: StartAtZeroSchema,
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

const tool = {
  name: "generate_violin_chart",
  description:
    "Generate a violin chart to show data for statistical summaries among different categories, such as, comparing the distribution of data points across categories.",
  inputSchema: zodToJsonSchema(schema),
  annotations: {
    title: "Generate Violin Chart",
    readOnlyHint: true,
  },
};

export const violin = {
  schema,
  tool,
};
