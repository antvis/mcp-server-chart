import { z } from "zod";
import { zodToJsonSchema } from "../utils";
import { type TreeDataType, validatedTreeDataSchema } from "../utils/validator";
import { HeightSchema, ThemeSchema, WidthSchema } from "./base";

// Mind map node schema
const MindMapNodeSchema: z.ZodType<TreeDataType> = z.lazy(() =>
  z.object({
    name: z.string(),
    children: z.array(MindMapNodeSchema).optional(),
  }),
);

// Mind map chart input schema
const schema = {
  data: MindMapNodeSchema.describe(
    "Data for mind map chart, such as, { name: 'main topic', children: [{ name: 'topic 1', children: [{ name:'subtopic 1-1' }] }.",
  ).refine(validatedTreeDataSchema, {
    message: "Invalid parameters: node name is not unique.",
    path: ["data"],
  }),
  theme: ThemeSchema,
  width: WidthSchema,
  height: HeightSchema,
};

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
