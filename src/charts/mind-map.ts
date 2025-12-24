import { z } from "zod";
import { zodToJsonSchema } from "../utils";
import { validatedTreeDataSchema } from "../utils/validator";
import { HeightSchema, TextureSchema, ThemeSchema, WidthSchema } from "./base";
import { FishboneNodeSchema } from "./fishbone-diagram";

// Mind map node schema
// The recursive schema is not supported by gemini, and other clients, so we use a non-recursive schema which can represent a tree structure with a fixed depth.
// Ref: https://github.com/antvis/mcp-server-chart/issues/155
// Ref: https://github.com/antvis/mcp-server-chart/issues/132
const MindMapNodeSchema = FishboneNodeSchema;

// Mind map chart input schema
const schema = {
  data: MindMapNodeSchema.describe(
    "Data for mind map chart which is a hierarchical structure, such as, { name: 'main topic', children: [{ name: 'topic 1', children: [{ name:'subtopic 1-1' }] }, and the maximum depth is 3.",
  ).refine(validatedTreeDataSchema, {
    message: "Invalid parameters: node name is not unique.",
    path: ["data"],
  }),
  style: z
    .object({
      texture: TextureSchema,
    })
    .optional()
    .describe(
      "Style configuration for the chart with a JSON object, optional.",
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
  annotations: {
    title: "Generate Mind Map",
    destructiveHint: true,
  },
};

export const mindMap = {
  schema,
  tool,
};
