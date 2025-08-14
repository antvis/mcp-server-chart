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

// Flow diagram input schema
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
      "Data for flow diagram chart, such as, { nodes: [{ name: 'node1' }, { name: 'node2' }], edges: [{ source: 'node1', target: 'node2', name: 'edge1' }] }.",
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

// Flow diagram tool descriptor
const tool = {
  name: "generate_flow_diagram",
  description:
    "Generate a flow diagram chart to show the steps and decision points of a process or system, such as, scenarios requiring linear process presentation.",
  inputSchema: schema,
};

export const flowDiagram = {
  schema,
  tool,
};
