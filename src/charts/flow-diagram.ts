import { z } from "zod";
import { zodToJsonSchema } from "../utils";
import { nonEmptyObject } from "../utils";
import { EdgeSchema, HeightSchema, NodeSchema, WidthSchema } from "./base";

// Flow diagram input schema
const schema = z.object({
  data: nonEmptyObject(
    z
      .object({
        nodes: z.array(NodeSchema),
        edges: z.array(EdgeSchema),
      })
      .describe(
        "Data for flow diagram chart, such as, { nodes: [{ name: 'node1' }, { name: 'node2' }], edges: [{ source: 'node1', target: 'node2', name: 'edge1' }] }.",
      ),
  ),
  width: WidthSchema,
  height: HeightSchema,
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
