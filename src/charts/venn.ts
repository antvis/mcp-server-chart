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

const data = z.object({
  label: z
    .string()
    .optional()
    .describe("Label for the venn chart segment, such as 'A', 'B', or 'C'."),
  value: z
    .number()
    .describe("Value for the venn chart segment, such as 10, 20, or 30."),
  sets: z
    .array(z.string())
    .describe(
      "Array of set names that this segment belongs to, such as ['A', 'B'] for an intersection between sets A and B.",
    ),
});

const schema = {
  data: z
    .tuple([data], data)
    .check(z.minLength(1))
    .describe(
      "Data for venn chart, such as, [{ label: 'A', value: 10, sets: ['A'] }, { label: 'B', value: 20, sets: ['B'] }, { label: 'C', value: 30, sets: ['C'] }, { label: 'AB', value: 5, sets: ['A', 'B'] }].",
    ),
  style: z
    .object({
      backgroundColor: BackgroundColorSchema,
      palette: PaletteSchema,
      texture: TextureSchema,
    })
    .optional()
    .describe("Custom style configuration for the chart."),
  theme: ThemeSchema,
  width: WidthSchema,
  height: HeightSchema,
  title: TitleSchema,
};

const tool = {
  name: "generate_venn_chart",
  description:
    "Generate a Venn diagram to visualize the relationships between different sets, showing how they intersect and overlap, such as the commonalities and differences between various groups.",
  inputSchema: zodToJsonSchema(schema),
};

export const venn = {
  schema,
  tool,
};
