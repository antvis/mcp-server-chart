import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import { BaseConfigSchema, EdgeSchema, NodeSchema } from "./base";

// Network graph input schema
export const NetworkGraphInputSchema = z.object({
  data: z
    .object({
      nodes: z.array(NodeSchema),
      edges: z.array(EdgeSchema),
    })
    .describe(
      "Data for network graph chart, such as, { nodes: [{ name: 'node1' }, { name: 'node2' }], edges: [{ source: 'node1', target: 'node2', name: 'edge1' }] }",
    ),
  width: BaseConfigSchema.width.optional(),
  height: BaseConfigSchema.height.optional(),
  title: BaseConfigSchema.title,
});

// Network graph tool descriptor
export const NetworkGraphChartTool = {
  name: "generate_network_graph",
  description:
    "Generate a network graph chart to show relationships (edges) between entities (nodes), such as, relationships between people in social networks.",
  inputSchema: zodToJsonSchema(NetworkGraphInputSchema),
};
