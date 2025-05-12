import { z } from "zod";
import { zodToJsonSchema } from "../utils";
import { nonEmptyObject } from "../utils";
import { EdgeSchema, HeightSchema, NodeSchema, WidthSchema } from "./base";

// Network graph input schema
const schema = z.object({
  data: nonEmptyObject(
    z
      .object({
        nodes: z.array(NodeSchema),
        edges: z.array(EdgeSchema),
      })
      .describe(
        "Data for network graph chart, such as, { nodes: [{ name: 'node1' }, { name: 'node2' }], edges: [{ source: 'node1', target: 'node2', name: 'edge1' }] }",
      ),
  ),
  width: WidthSchema,
  height: HeightSchema,
});

// Network graph tool descriptor
const tool = {
  name: "generate_network_graph",
  description:
    "Generate a network graph chart to show relationships (edges) between entities (nodes), such as, relationships between people in social networks.",
  inputSchema: zodToJsonSchema(schema),
};

export const networkGraph = {
  schema,
  tool,
};
