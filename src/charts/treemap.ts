import { z } from "zod";
import { zodToJsonSchema } from "../utils";
import { HeightSchema, ThemeSchema, TitleSchema, WidthSchema } from "./base";

// Define recursive schema for hierarchical data
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
const TreeNodeSchema: z.ZodType<any> = z.lazy(() =>
  z.object({
    name: z.string(),
    value: z.number(),
    children: z.array(TreeNodeSchema).optional(),
  }),
);

// Treemap chart input schema
const schema = {
  data: z
    .array(TreeNodeSchema)
    .describe(
      "Data for treemap chart, such as, [{ name: 'Design', value: 70, children: [{ name: 'Tech', value: 20 }] }].",
    )
    .nonempty({ message: "Treemap chart data cannot be empty." }),
  theme: ThemeSchema,
  width: WidthSchema,
  height: HeightSchema,
  title: TitleSchema,
};

// Treemap chart tool descriptor
const tool = {
  name: "generate_treemap_chart",
  description:
    "Generate a treemap chart to display hierarchical data and can intuitively show comparisons between items at the same level, such as, show disk space usage with treemap.",
  inputSchema: zodToJsonSchema(schema),
};

export const treemap = {
  schema,
  tool,
};
