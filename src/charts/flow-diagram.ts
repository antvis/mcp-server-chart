import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import { BaseConfigSchema, EdgeSchema, NodeSchema } from "./base";

// Flow diagram input schema
const schema = z.object({
  data: z
    .object({
      nodes: z.array(NodeSchema),
      edges: z.array(EdgeSchema),
    })
    .describe(
      "Data for flow diagram chart, such as, { nodes: [{ name: 'node1' }, { name: 'node2' }], edges: [{ source: 'node1', target: 'node2', name: 'edge1' }] }",
    ),
  width: BaseConfigSchema.width.optional(),
  height: BaseConfigSchema.height.optional(),
  title: BaseConfigSchema.title,
});

// Flow diagram tool descriptor
const tool = {
  name: "generate_flow_diagram",
  description:
    "Generate a flow diagram chart to show the steps and decision points of a process or system, such as, scenarios requiring linear process presentation.",
  inputSchema: zodToJsonSchema(schema),
};

export const flowDiagram = {
  schema,
  tool,
};
