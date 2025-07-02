import type { Options as G2Options } from "@antv/g2-ssr";
import type { Options as G6Options } from "@antv/g6-ssr";

// Base chart options shared by all charts
export interface BaseChartOptions {
  width?: number;
  height?: number;
  theme?: string;
  title?: string;
  // biome-ignore lint/suspicious/noExplicitAny: Chart data structure varies significantly by chart type
  data?: any; // Chart data - structure varies by chart type
}

// G2 base options with common properties
export interface G2BaseOptions extends BaseChartOptions {
  axisXTitle?: string;
  axisYTitle?: string;
}

// Specific G2 chart option types
export interface BasicG2ChartOptions extends G2BaseOptions {
  // For simple charts like line, area, scatter, etc.
}

export interface GroupableChartOptions extends G2BaseOptions {
  // For charts that support grouping/stacking like column, bar
  stack?: boolean;
  group?: boolean;
}

export interface PieChartOptions extends G2BaseOptions {
  // For pie/donut charts
  innerRadius?: number;
}

export interface HistogramChartOptions extends G2BaseOptions {
  // For histogram charts
  binNumber?: number;
}

export interface DualAxesChartOptions extends G2BaseOptions {
  // For dual axes charts with series
  series?: Array<{
    type: "column" | "line";
    data: number[];
    axisYTitle?: string;
  }>;
  categories?: string[];
}

// G6 options with graph-specific properties
export interface G6ChartOptions extends BaseChartOptions {
  // Graph charts have data with nodes/edges structure
  data?: {
    // biome-ignore lint/suspicious/noExplicitAny: Node properties vary by chart type
    nodes: Array<{ name: string; [key: string]: any }>;
    // biome-ignore lint/suspicious/noExplicitAny: Edge properties vary by chart type
    edges?: Array<{
      name?: string;
      source: string;
      target: string;
      [key: string]: any;
    }>;
  };
}

export interface TreeChartOptions extends BaseChartOptions {
  // Tree charts have hierarchical data structure
  data?: {
    name: string;
    // biome-ignore lint/suspicious/noExplicitAny: Tree children structure varies by chart type
    children?: any[];
  };
}

// Legacy generic types for backward compatibility
export type G2ChartOptions = G2BaseOptions & {
  // Include all possible properties for backward compatibility
  stack?: boolean;
  group?: boolean;
  innerRadius?: number;
  binNumber?: number;
  // biome-ignore lint/suspicious/noExplicitAny: Series data structure varies by chart type
  series?: any[];
  categories?: string[];
};

export type CommonOptions = BaseChartOptions;
