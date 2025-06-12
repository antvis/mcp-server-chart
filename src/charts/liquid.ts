import { z } from "zod";
import { zodToJsonSchema } from "../utils";
import { HeightSchema, ThemeSchema, TitleSchema, WidthSchema } from "./base";

const schema = {
  percent: z
    .number()
    .describe(
      "The percentage value to display in the liquid chart, should be a number between 0 and 1, where 1 represents 100%. For example, 0.75 represents 75%.",
    )
    .min(0, { message: "Value must be at least 0." })
    .max(1, { message: "Value must be at most 1." }),
  shape: z
    .enum(["circle", "rect", "pin", "triangle"])
    .optional()
    .default("circle")
    .describe(
      "The shape of the liquid chart, can be 'circle', 'rect', 'pin', or 'triangle'. Default is 'circle'.",
    ),
  theme: ThemeSchema,
  width: WidthSchema,
  height: HeightSchema,
  title: TitleSchema,
};

const tool = {
  name: "generate_liquid_chart",
  description:
    "Generate a liquid chart to visualize a single value as a percentage, such as, the current occupancy rate of a reservoir or the completion percentage of a project.",
  inputSchema: zodToJsonSchema(schema),
};

export const liquid = {
  schema,
  tool,
};
