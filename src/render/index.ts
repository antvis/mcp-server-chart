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
 * Validate chart options before rendering
 */
function validateChartOptions(
  type: string,
  options: Record<string, unknown>,
): void {
  // Basic validation
  if (!type || typeof type !== "string") {
    throw new Error("Chart type must be a non-empty string");
  }

  if (!options || typeof options !== "object") {
    throw new Error("Chart options must be an object");
  }

  // Chart-specific validation
  const { data, width, height } = options;

  // Validate dimensions
  if (width !== undefined && (typeof width !== "number" || width <= 0)) {
    throw new Error("Width must be a positive number");
  }

  if (height !== undefined && (typeof height !== "number" || height <= 0)) {
    throw new Error("Height must be a positive number");
  }

  // Validate data presence for charts that require it
  const chartsRequiringData = [
    "area",
    "bar",
    "column",
    "line",
    "pie",
    "scatter",
    "radar",
    "histogram",
    "treemap",
    "word-cloud",
    "dual-axes",
    "network-graph",
    "flow-diagram",
    "mind-map",
    "fishbone-diagram",
  ];

  if (
    chartsRequiringData.includes(type) &&
    (!data || (Array.isArray(data) && data.length === 0))
  ) {
    throw new Error(`Chart type '${type}' requires non-empty data`);
  }
}

/**
 * Render a chart based on the provided options with enhanced error handling
 * @param options Chart options including type and configuration
 * @returns SSR result with chart buffer
 */
export async function render(options: Options): Promise<Chart | Graph> {
  const { type, ...rest } = options;
  const renderStartTime = Date.now();

  try {
    // Validate inputs
    validateChartOptions(type, rest);

    const renderVis = VIS[type];

    if (!renderVis) {
      const availableTypes = Object.keys(VIS).join(", ");
      throw new Error(
        `Unknown chart type: '${type}'. Available types: ${availableTypes}`,
      );
    }

    console.log(`[RENDER] Starting ${type} chart render...`);

    // Render the chart
    const chart = await renderVis(rest);
    const renderDuration = Date.now() - renderStartTime;

    console.log(
      `[RENDER] Successfully rendered ${type} chart in ${renderDuration}ms`,
    );

    return chart;
  } catch (error: unknown) {
    const renderDuration = Date.now() - renderStartTime;
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    console.error(
      `[RENDER] Failed to render ${type} chart after ${renderDuration}ms:`,
      {
        error: errorMessage,
        type,
        options: JSON.stringify(rest, null, 2),
      },
    );

    // Re-throw with more context
    throw new Error(`Chart render failed for type '${type}': ${errorMessage}`);
  }
}
