import { z } from "zod";

// Node and Edge Graph Data Types, recursively defined for validation.
export type NodeEdgeDataType = {
  nodes: Array<{ name: string }>;
  edges: Array<{ name?: string; source: string; target: string }>;
};

// Treemap Graph Data Type, recursively defined for validation.
export type TreeDataType = {
  name: string;
  children?: TreeDataType[];
};

/**
 * Zod schema for validating node-edge graph data
 * - Node names must be unique
 * - Edge sources and targets must exist in nodes
 * - Edge pairs must be unique
 * - Nodes array must have at least 1 item
 * - Edge names are optional with empty string default
 */
export const nodeEdgeDataSchema = z
  .object({
    nodes: z.array(z.object({ name: z.string() })).min(1),
    edges: z.array(
      z.object({
        name: z.string().default(""),
        source: z.string(),
        target: z.string(),
      }),
    ),
  })
  .refine(
    (data) => {
      const nodeNames = new Set(data.nodes.map((node) => node.name));
      const uniqueNodeNames = new Set<string>();

      // 1. Validate node names are unique
      for (const node of data.nodes) {
        if (uniqueNodeNames.has(node.name)) {
          return false;
        }
        uniqueNodeNames.add(node.name);
      }

      // 2. Validate edge sources and targets exist in nodes
      for (const edge of data.edges) {
        if (!nodeNames.has(edge.source) || !nodeNames.has(edge.target)) {
          return false;
        }
      }

      // 3. Validate edge pairs are unique
      const edgePairs = new Set<string>();
      for (const edge of data.edges) {
        const pair = `${edge.source}-${edge.target}`;
        if (edgePairs.has(pair)) {
          return false;
        }
        edgePairs.add(pair);
      }

      return true;
    },
    {
      message:
        "Invalid graph data: node names must be unique, edges must reference existing nodes, and edge pairs must be unique",
    },
  );

/**
 * Zod schema for validating tree data
 * - Node names must be unique across the entire tree
 */
export const treeDataSchema: z.ZodType<TreeDataType> = z.lazy(() =>
  z
    .object({
      name: z.string(),
      children: z.array(treeDataSchema).optional(),
    })
    .refine(
      (data) => {
        const names = new Set<string>();

        const checkUniqueness = (node: TreeDataType): boolean => {
          if (names.has(node.name)) {
            return false;
          }
          names.add(node.name);

          if (node.children) {
            for (const child of node.children) {
              if (!checkUniqueness(child)) {
                return false;
              }
            }
          }
          return true;
        };

        return checkUniqueness(data);
      },
      {
        message: "Tree node names must be unique across the entire tree",
      },
    ),
);

// Legacy validation functions for backward compatibility
export const validatedNodeEdgeDataSchema = (
  data: NodeEdgeDataType,
): boolean => {
  const result = nodeEdgeDataSchema.safeParse(data);
  if (!result.success) {
    throw new Error(result.error.message);
  }
  return true;
};

export const validatedTreeDataSchema = (data: TreeDataType): boolean => {
  const result = treeDataSchema.safeParse(data);
  if (!result.success) {
    throw new Error(result.error.message);
  }
  return true;
};
