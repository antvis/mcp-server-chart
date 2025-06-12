import { z } from "zod";
import { zodToJsonSchema } from "../utils";
import { HeightSchema, ThemeSchema, TitleSchema, WidthSchema } from "./base";

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
    .array(data)
    .describe(
      "Data for venn chart, such as, [{ label: 'A', value: 10, sets: ['A'] }, { label: 'B', value: 20, sets: ['B'] }, { label: 'C', value: 30, sets: ['C'] }, { label: 'AB', value: 5, sets: ['A', 'B'] }].",
    )
    .nonempty({ message: "Venn chart data cannot be empty." }),
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
