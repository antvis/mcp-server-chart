import { z } from "zod";
import { zodToJsonSchema } from "../utils";
import {
  WidthSchema,
  HeightSchema,
  AxisXTitleSchema,
  AxisYTitleSchema,
  TitleSchema,
} from "./base";

// Scatter chart data schema
const data = z.object({
  x: z.number(),
  y: z.number(),
});

// Scatter chart input schema
const schema = z.object({
  data: z
    .array(data)
    .describe("Data for scatter chart, such as, [{ x: 10, y: 15 }]."),
  width: WidthSchema,
  height: HeightSchema,
  title: TitleSchema,
  axisXTitle: AxisXTitleSchema,
  axisYTitle: AxisYTitleSchema,
});

// Scatter chart tool descriptor
const tool = {
  name: "generate_scatter_chart",
  description:
    "Generate a scatter chart to show the relationship between two variables, helps discover their relationship or trends, such as, the strength of correlation, data distribution patterns.",
  inputSchema: zodToJsonSchema(schema),
};

export const scatter = {
  schema,
  tool,
}; 