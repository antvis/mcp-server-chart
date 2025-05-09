import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import { BaseConfigSchema } from "./base";

// Define recursive schema for hierarchical data
const TreeNodeSchema: z.ZodType<any> = z.lazy(() =>
  z.object({
    name: z.string(),
    value: z.number(),
    children: z.array(TreeNodeSchema).optional(),
  }),
);

// Treemap chart input schema
export const TreemapChartInputSchema = z.object({
  data: z
    .array(TreeNodeSchema)
    .describe(
      "Data for treemap chart, such as, [{ name: 'Design', value: 70, children: [{ name: 'Tech', value: 20 }] }].",
    ),
  width: BaseConfigSchema.width.optional(),
  height: BaseConfigSchema.height.optional(),
  title: BaseConfigSchema.title,
});

// Treemap chart tool descriptor
export const TreemapChartTool = {
  name: "generate_treemap_chart",
  description:
    "Generate a treemap chart to display hierarchical data and can intuitively show comparisons between items at the same level, such as, show disk space usage with treemap.",
  inputSchema: zodToJsonSchema(TreemapChartInputSchema),
}; 