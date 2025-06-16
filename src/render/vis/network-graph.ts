import { G6, createGraph } from "@antv/g6-ssr";
import { G6THEME_MAP } from "../constant";
import type { G6ChartOptions } from "./types";

export type NetworkGraphOptions = G6ChartOptions;

export async function NetworkGraph(options: NetworkGraphOptions) {
  const { data, width = 600, height = 400, theme = "default" } = options;

  if (!data || !data.nodes || !data.edges) {
    throw new Error("NetworkGraph requires data with nodes and edges");
  }

  const graphData = {
    nodes: data.nodes.map((node) => ({ ...node, id: String(node.name) })),
    edges: data.edges.map((edge) => ({
      ...edge,
      id: `${edge.source}-${edge.target}`,
    })),
  };

  return await createGraph({
    data: graphData,
    width: width,
    height: height,
    devicePixelRatio: 3,
    autoFit: "view",
    padding: 20,
    animation: false,
    node: {
      type: "circle",
      style: {
        size: 20,
        // @ts-ignore
        labelText: (d) => d.name,
        labelSize: 10,
        labelFontSize: 10,
        labelBackground: true,
      },
    },
    edge: {
      style: {
        // @ts-ignore
        labelText: (d) => d.name,
        labelFontSize: 10,
        labelBackground: true,
        endArrow: true,
      },
      animation: { enter: false },
    },
    layout: {
      type: "force-atlas2",
      preventOverlap: true,
      kr: 600,
    },
    transforms: ["process-parallel-edges", G6THEME_MAP[theme]],
  });
}
