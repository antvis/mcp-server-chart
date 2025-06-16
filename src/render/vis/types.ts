import type { Options as G2Options } from "@antv/g2-ssr";
import type { Options as G6Options } from "@antv/g6-ssr";

// Extended G2 options with common chart properties
export type G2ChartOptions = G2Options & {
  // Custom properties added by gpt-vis for convenience
  axisXTitle?: string;
  axisYTitle?: string;
  theme?: string;
  // Chart-specific properties
  stack?: boolean;
  group?: boolean;
};

// Extended G6 options with common graph properties
export type G6ChartOptions = G6Options & {
  // Custom properties added by gpt-vis for convenience
  theme?: string;
};

// Legacy type for backward compatibility during transition
export type CommonOptions = {
  width?: number;
  height?: number;
  theme?: string;
};
