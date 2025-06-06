import { ErrorCode, McpError } from "@modelcontextprotocol/sdk/types.js";

export interface FlowAndNetWorkOption {
  data: {
    nodes: Array<{ name: string }>;
    edges: Array<{ name: string; source: string; target: string }>;
  };
  theme: "default" | "academy";
  width: number;
  height: number;
}

export interface DataNode {
  name: string;
  children: Array<{ name: string }>;
}
export interface MindMapAndFishBoneOption {
  data: DataNode;
  theme: "default" | "academy";
  width: number;
  height: number;
}

export const validatedFlowNetWorkSchema = (data: FlowAndNetWorkOption) => {
  const nodeNames = new Set(data.data.nodes.map((node) => node.name));
  const errors: string[] = [];

  const uniqueNodeNames = new Set();
  for (const node of data.data.nodes) {
    if (uniqueNodeNames.has(node.name)) {
      errors.push(`Node name "${node.name}" is not unique.`);
    }
    uniqueNodeNames.add(node.name);
  }

  for (const edge of data.data.edges) {
    if (!nodeNames.has(edge.source)) {
      errors.push(`source "${edge.source}" does not exist in nodes.`);
    }
    if (!nodeNames.has(edge.target)) {
      errors.push(`target "${edge.target}" does not exist in nodes.`);
    }
  }

  const edgePairs = new Set();
  for (const edge of data.data.edges) {
    const pair = `${edge.source}-${edge.target}`;
    if (edgePairs.has(pair)) {
      errors.push(`Edge pair "${pair}" is not unique.`);
    }
    edgePairs.add(pair);
  }
  if (errors.length > 0) {
    throw new McpError(
      ErrorCode.InvalidParams,
      `Invalid parameters: ${errors.join("")}`,
    );
  }
  return !(errors.length > 0);
};

export const validatedMindMapFishBoneSchema = (
  data: MindMapAndFishBoneOption,
) => {
  const node = data.data;
  const names = new Set<string>();
  const errors: string[] = [];

  const checkUniqueness = (currentNode: DataNode) => {
    if (names.has(currentNode.name)) {
      errors.push(`Node name "${currentNode.name}" is not unique.`);
    }
    names.add(currentNode.name);
    if (currentNode.children) {
      for (let i = 0; i < currentNode.children.length; i++) {
        const child = currentNode.children[i];
        checkUniqueness(child as DataNode);
      }
    }
  };
  checkUniqueness(node);
  if (errors.length > 0) {
    throw new McpError(
      ErrorCode.InvalidParams,
      `Invalid parameters: ${errors.join("")}`,
    );
  }
  return !(errors.length > 0);
};
