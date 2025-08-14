import { z } from "zod";

import { validatedNodeEdgeDataSchema } from "../utils/validator";
import {
  EdgeSchema,
  HeightSchema,
  NodeSchema,
  TextureSchema,
  ThemeSchema,
  WidthSchema,
} from "./base";

// Network graph input schema
const schema = z.object({
  data: z
    .object({
      nodes: z.tuple([NodeSchema], NodeSchema).check(z.minLength(1)),
      edges: z.array(EdgeSchema),
    })
    .refine(validatedNodeEdgeDataSchema, {
      path: ["data", "edges"],
      error: "Invalid parameters",
    })
    .describe(
      "Data for network graph chart, such as, { nodes: [{ name: 'node1' }, { name: 'node2' }], edges: [{ source: 'node1', target: 'node2', name: 'edge1' }] }",
    ),
  style: z
    .object({
      texture: TextureSchema,
    })
    .optional()
    .describe("Custom style configuration for the chart."),
  theme: ThemeSchema,
  width: WidthSchema,
  height: HeightSchema,
});

// Network graph tool descriptor
const tool = {
  name: "generate_network_graph",
  description:
    "Generate a network graph chart to show relationships (edges) between entities (nodes), such as, relationships between people in social networks.",
  inputSchema: schema,
};

export const networkGraph = {
  schema,
  tool,
};
