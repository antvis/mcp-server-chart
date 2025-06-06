import { z } from "zod";
import { zodToJsonSchema } from "../utils";
import { validatedFlowNetWorkSchema } from "../utils/valid";
import {
  EdgeSchema,
  HeightSchema,
  NodeSchema,
  ThemeSchema,
  WidthSchema,
} from "./base";

// Flow diagram input schema
const schema = z
  .object({
    data: z
      .object({
        nodes: z
          .array(NodeSchema)
          .nonempty({ message: "At least one node is required." }),
        edges: z.array(EdgeSchema),
      })
      .describe(
        "Data for flow diagram chart, such as, { nodes: [{ name: 'node1' }, { name: 'node2' }], edges: [{ source: 'node1', target: 'node2', name: 'edge1' }] }.",
      ),
    theme: ThemeSchema,
    width: WidthSchema,
    height: HeightSchema,
  })
  .refine((data) => validatedFlowNetWorkSchema(data), {
    message: "Invalid parameters",
    path: ["data", "edges"],
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
