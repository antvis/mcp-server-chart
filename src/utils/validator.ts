/**
 * The Error class for validation errors in zod.
 */
export class ValidateError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidateError";
  }
}

// Node and Edge Graph Data Types, recursively defined for validation.
export type NodeEdgeDataType = {
  nodes: Array<{ name: string }>;
  edges: Array<{ name: string; source: string; target: string }>;
};

// Treemap Graph Data Type, recursively defined for validation.
export type TreeDataType = {
  name: string;
  children?: TreeDataType[];
};

/**
 * Valid node name is unique.
 * Valid edge source and target are existing in nodes.
 * Valid edge source edge target pair are unique.
 * @param data
 * @returns boolean
 */
export const validatedNodeEdgeDataSchema = (data: NodeEdgeDataType) => {
  const nodeNames = new Set(data.nodes.map((node) => node.name));
  const uniqueNodeNames = new Set();

  // 1. valid node name is unique
  for (const node of data.nodes) {
    if (uniqueNodeNames.has(node.name)) {
      throw new ValidateError(
        `Invalid parameters: node's name '${node.name}' should be unique.`,
      );
    }
    uniqueNodeNames.add(node.name);
  }

  // 2. valid edge source and target are existing in nodes
  for (const edge of data.edges) {
    if (!nodeNames.has(edge.source)) {
      throw new ValidateError(
        `Invalid parameters: edge's source '${edge.source}' should exist in nodes.`,
      );
    }
    if (!nodeNames.has(edge.target)) {
      throw new ValidateError(
        `Invalid parameters: edge's target '${edge.target}' should exist in nodes.`,
      );
    }
  }

  // 3. valid edge source edge target pair are unique
  const edgePairs = new Set();
  for (const edge of data.edges) {
    const pair = `${edge.source}-${edge.target}`;
    if (edgePairs.has(pair)) {
      throw new ValidateError(
        `Invalid parameters: edge pair '${pair}' should be unique.`,
      );
    }
    edgePairs.add(pair);
  }

  return true;
};

/**
 * Valid TreeData name is unique.
 * @param data
 * @returns boolean
 */
export const validatedTreeDataSchema = (data: TreeDataType) => {
  const node = data;
  const names = new Set<string>();

  // valid node name is unique
  const checkUniqueness = (currentNode: TreeDataType) => {
    if (names.has(currentNode.name)) {
      throw new ValidateError(
        `Invalid parameters: node's name '${currentNode.name}' should be unique.`,
      );
    }
    names.add(currentNode.name);
    if (currentNode.children) {
      for (let i = 0; i < currentNode.children.length; i++) {
        const child = currentNode.children[i];
        checkUniqueness(child as TreeDataType);
      }
    }
  };

  checkUniqueness(node);
  return true;
};
