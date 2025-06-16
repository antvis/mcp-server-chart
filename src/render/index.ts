import type { Chart } from "@antv/g2-ssr";
import type { Graph } from "@antv/g6-ssr";
import { type Options, SSRResult } from "./types";
import { Area } from "./vis/area";
import { Bar } from "./vis/bar";
import { Column } from "./vis/column";
import { DualAxes } from "./vis/dual-axes";
import { FishboneDiagram } from "./vis/fishbone-diagram";
import { FlowDiagram } from "./vis/flow-diagram";
import { Histogram } from "./vis/histogram";
import { Line } from "./vis/line";
import { MindMap } from "./vis/mind-map";
import { NetworkGraph } from "./vis/network-graph";
import { Pie } from "./vis/pie";
import { Radar } from "./vis/radar";
import { Scatter } from "./vis/scatter";
import { Treemap } from "./vis/treemap";
import { WordCloud } from "./vis/word-cloud";

// Chart type definitions
export type ChartType = keyof typeof VIS;
// biome-ignore lint/suspicious/noExplicitAny: Chart options vary significantly between G2 and G6 charts
export type ChartRenderer = (options: any) => Promise<Chart | Graph>;

/**
 * All visualization types with proper typing
 */
const VIS: Record<string, ChartRenderer> = {
  area: Area,
  bar: Bar,
  column: Column,
  "dual-axes": DualAxes,
  "fishbone-diagram": FishboneDiagram,
  "flow-diagram": FlowDiagram,
  histogram: Histogram,
  line: Line,
  "mind-map": MindMap,
  "network-graph": NetworkGraph,
  pie: Pie,
  radar: Radar,
  scatter: Scatter,
  treemap: Treemap,
  "word-cloud": WordCloud,
};

/**
 * Render a chart based on the provided options
 * @param options Chart options including type and configuration
 * @returns SSR result with chart buffer
 */
export async function render(options: Options): Promise<Chart | Graph> {
  const { type, ...rest } = options;

  const renderVis = VIS[type];

  if (!renderVis) {
    throw new Error(`Unknown chart type: ${type}`);
  }

  return await renderVis(rest);
}
