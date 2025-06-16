import { G6, createGraph } from "@antv/g6-ssr";
import { G6THEME_MAP } from "../constant";
import type { G6ChartOptions } from "./types";

export type FlowDiagramOptions = G6ChartOptions;

export async function FlowDiagram(options: FlowDiagramOptions) {
  const { data, width = 600, height = 400, theme = "default" } = options;

  if (!data || !data.nodes || !data.edges) {
    throw new Error("FlowDiagram requires data with nodes and edges");
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
    width,
    height,
    devicePixelRatio: 3,
    autoFit: "view",
    padding: 20,
    animation: false,
    node: {
      type: "rect",
      style: {
        // biome-ignore lint/suspicious/noExplicitAny: Node data structure varies in G6
        size: (d: any) => [d.name.length * 15 + 30, 35],
        radius: 6,
        // @ts-ignore
        iconText: (d) => d.name,
        iconFontSize: 12,
        iconFontWeight: 800,
      },
    },
    edge: {
      type: "polyline",
      style: {
        lineWidth: 2,
        radius: 10,
        stroke: "#99ADD1",
        endArrow: true,
        // @ts-ignore
        labelText: (d) => d.name,
        labelFill: "#555555",
        labelFontWeight: 800,
        labelBackground: true,
        labelBackgroundFill: "rgba(255,255,255,0.6)",
        labelBackgroundOpacity: 1,
        labelBackgroundLineWidth: 2,
        labelPadding: [2, 5],
        labelBackgroundRadius: 2,
        router: {
          type: "orth",
        },
      },
    },
    layout: {
      type: "dagre",
      rankdir: "LR",
    },
    transforms: [G6THEME_MAP[theme]],
  });
}
