import { z } from "zod";
import { zodToJsonSchema } from "../utils";
import { nodeEdgeDataSchema } from "../utils/validator";
import { HeightSchema, ThemeSchema, WidthSchema } from "./base";

// Flow diagram input schema
const schema = {
  data: nodeEdgeDataSchema.describe(
    "Data for flow diagram chart, such as, { nodes: [{ name: 'node1' }, { name: 'node2' }], edges: [{ source: 'node1', target: 'node2', name: 'edge1' }] }.",
  ),
  theme: ThemeSchema,
  width: WidthSchema,
  height: HeightSchema,
};

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
