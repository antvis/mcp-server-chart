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
      "Data for violin chart, such as, [{ category: '分类一', value: 10 }] or [{ category: '分类二', value: 20, group: '组别一' }].",
    )
    .nonempty({ message: "Violin chart data cannot be empty." }),
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
};

export const violin = {
  schema,
  tool,
};
