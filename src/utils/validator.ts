import { ErrorCode, McpError } from "@modelcontextprotocol/sdk/types.js";

export interface NodeEdgeData {
  nodes: Array<{ name: string }>;
  edges: Array<{ name: string; source: string; target: string }>;
}

export interface TreeData {
  name: string;
  value: number;
  children: Array<{ name: string }>;
}

/**
 * validatedNodeEdgeDataSchema
 * @param data
 * @returns boolean
 */
export const validatedNodeEdgeDataSchema = (data: NodeEdgeData) => {
  const nodeNames = new Set(data.nodes.map((node) => node.name));
  const uniqueNodeNames = new Set();

  // 1. valid node name is unique
  for (const node of data.nodes) {
    if (uniqueNodeNames.has(node.name)) {
      throw new McpError(
        ErrorCode.InvalidParams,
        `Invalid parameters: nodes name '${node.name}' is not unique.`,
      );
    }
    uniqueNodeNames.add(node.name);
  }

  // 2. valid edge source and target are existing in nodes
  for (const edge of data.edges) {
    if (!nodeNames.has(edge.source)) {
      throw new McpError(
        ErrorCode.InvalidParams,
        `Invalid parameters: source '${edge.source}' does not exist in nodes.`,
      );
    }
    if (!nodeNames.has(edge.target)) {
      throw new McpError(
        ErrorCode.InvalidParams,
        `Invalid parameters: target '${edge.target}' does not exist in nodes.`,
      );
    }
  }

  // 3. valid edge source edge target pair are unique
  const edgePairs = new Set();
  for (const edge of data.edges) {
    const pair = `${edge.source}-${edge.target}`;
    if (edgePairs.has(pair)) {
      throw new McpError(
        ErrorCode.InvalidParams,
        `Invalid parameters: edge pair '${pair}' is not unique.`,
      );
    }
    edgePairs.add(pair);
  }

  return true;
};

/**
 * validatedTreeDataSchema
 * @param data
 * @returns boolean
 */

export const validatedTreeDataSchema = (data: TreeData) => {
  const node = data;
  const names = new Set<string>();

  // valid node name is unique
  const checkUniqueness = (currentNode: TreeData) => {
    if (names.has(currentNode.name)) {
      throw new McpError(
        ErrorCode.InvalidParams,
        `Invalid parameters: node name '${currentNode.name}' is not unique.`,
      );
    }
    names.add(currentNode.name);
    if (currentNode.children) {
      for (let i = 0; i < currentNode.children.length; i++) {
        const child = currentNode.children[i];
        checkUniqueness(child as TreeData);
      }
    }
  };

  checkUniqueness(node);
  return true;
};
