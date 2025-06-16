import { z } from "zod";
import { zodToJsonSchema } from "../utils";
import { type TreeDataType, treeDataSchema } from "../utils/validator";
import { HeightSchema, ThemeSchema, WidthSchema } from "./base";

// Mind map chart input schema
const schema = {
  data: treeDataSchema.describe(
    "Data for mind map chart, such as, { name: 'main topic', children: [{ name: 'topic 1', children: [{ name:'subtopic 1-1' }] }.",
  ),
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
