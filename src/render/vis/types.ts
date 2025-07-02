import type { Options as G2Options } from "@antv/g2-ssr";
import type { Options as G6Options } from "@antv/g6-ssr";

// Base G2 chart options extending SSR types with convenience properties
export type G2ChartOptions = G2Options & {
  // Convenience properties that gpt-vis used to provide
  axisXTitle?: string;
  axisYTitle?: string;
  theme?: string;
  title?: string;
};

// Specific G2 chart option types for different chart categories
export type BasicG2ChartOptions = G2ChartOptions;

export type GroupableChartOptions = G2ChartOptions & {
  // For charts that support grouping/stacking like column, bar
  stack?: boolean;
  group?: boolean;
};

export type PieChartOptions = G2ChartOptions & {
  // For pie/donut charts
  innerRadius?: number;
};

export type HistogramChartOptions = G2ChartOptions & {
  // For histogram charts
  binNumber?: number;
};

export type DualAxesChartOptions = G2ChartOptions & {
  // For dual axes charts with series
  // biome-ignore lint/suspicious/noExplicitAny: Series data structure varies by chart type
  series?: Array<{
    type: "column" | "line";
    data: number[];
    axisYTitle?: string;
  }>;
  categories?: string[];
};

// Base G6 chart options extending SSR types with convenience properties
export type G6ChartOptions = G6Options & {
  // Convenience properties for graph charts
  theme?: string;
  title?: string;
};

export type TreeChartOptions = G6Options & {
  // Tree charts have hierarchical data structure
  theme?: string;
  title?: string;
};

// Legacy type for backward compatibility
export type CommonOptions = {
  width?: number;
  height?: number;
  theme?: string;
};
