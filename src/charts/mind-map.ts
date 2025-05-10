import { z } from "zod";
import { zodToJsonSchema } from "../utils";
import { HeightSchema, WidthSchema } from "./base";

// Mind map node schema
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
const MindMapNodeSchema: z.ZodType<any> = z.lazy(() =>
  z.object({
    name: z.string(),
    children: z.array(MindMapNodeSchema).optional(),
  }),
);

// Mind map chart input schema
const schema = z.object({
  data: MindMapNodeSchema.describe(
    "Data for mind map chart, such as, { name: 'main topic', children: [{ name: 'topic 1', children: [{ name:'subtopic 1-1' }] }.",
  ),
  width: WidthSchema,
  height: HeightSchema,
});

// Mind map chart tool descriptor
const tool = {
  name: "generate_mind_map",
  description:
    "Generate a mind map chart to organizes and presents information in a hierarchical structure with branches radiating from a central topic, such as, a diagram showing the relationship between a main topic and its subtopics.",
  inputSchema: zodToJsonSchema(schema),
};

export const mindMap = {
  schema,
  tool,
};
