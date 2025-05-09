// Export all chart tools
import { LineChartTool, LineChartInputSchema } from "./line";
import { ColumnChartTool, ColumnChartInputSchema } from "./column";
import { PieChartTool, PieChartInputSchema } from "./pie";
import { AreaChartTool, AreaChartInputSchema } from "./area";
import { BarChartTool, BarChartInputSchema } from "./bar";
import { HistogramChartTool, HistogramChartInputSchema } from "./histogram";
import { ScatterChartTool, ScatterChartInputSchema } from "./scatter";
import { WordCloudChartTool, WordCloudChartInputSchema } from "./word-cloud";
import { RadarChartTool, RadarChartInputSchema } from "./radar";
import { TreemapChartTool, TreemapChartInputSchema } from "./treemap";
import { DualAxesChartInputSchema, DualAxesChartTool } from "./dual-axes";
import { MindMapChartInputSchema, MindMapChartTool } from "./mind-map";
import {
  NetworkGraphChartTool,
  NetworkGraphInputSchema,
} from "./network-graph";
import { FlowDiagramChartTool, FlowDiagramInputSchema } from "./flow-diagram";
import {
  FishboneDiagramChartTool,
  FishboneDiagramInputSchema,
} from "./fishbone-diagram";

// Export all chart tools
export const ChartTools = [
  LineChartTool,
  ColumnChartTool,
  PieChartTool,
  AreaChartTool,
  BarChartTool,
  HistogramChartTool,
  ScatterChartTool,
  WordCloudChartTool,
  RadarChartTool,
  TreemapChartTool,
  DualAxesChartTool,
  MindMapChartTool,
  NetworkGraphChartTool,
  FlowDiagramChartTool,
  FishboneDiagramChartTool,
];

export const SchemaMap = {
  line: LineChartInputSchema,
  column: ColumnChartInputSchema,
  pie: PieChartInputSchema,
  area: AreaChartInputSchema,
  bar: BarChartInputSchema,
  histogram: HistogramChartInputSchema,
  scatter: ScatterChartInputSchema,
  "word-cloud": WordCloudChartInputSchema,
  radar: RadarChartInputSchema,
  treemap: TreemapChartInputSchema,
  "dual-axes": DualAxesChartInputSchema,
  "mind-map": MindMapChartInputSchema,
  "network-graph": NetworkGraphInputSchema,
  "flow-diagram": FlowDiagramInputSchema,
  "fishbone-diagram": FishboneDiagramInputSchema,
};

// Export all schemas and tools individually
export { LineChartTool, LineChartInputSchema };
export { ColumnChartTool, ColumnChartInputSchema };
export { PieChartTool, PieChartInputSchema };
export { AreaChartTool, AreaChartInputSchema };
export { BarChartTool, BarChartInputSchema };
export { HistogramChartTool, HistogramChartInputSchema };
export { ScatterChartTool, ScatterChartInputSchema };
export { WordCloudChartTool, WordCloudChartInputSchema };
export { RadarChartTool, RadarChartInputSchema };
export { TreemapChartTool, TreemapChartInputSchema };
export { DualAxesChartTool, DualAxesChartInputSchema };
export { MindMapChartTool, MindMapChartInputSchema };
export { NetworkGraphChartTool, NetworkGraphInputSchema };
export { FlowDiagramChartTool, FlowDiagramInputSchema };
export { FishboneDiagramChartTool, FishboneDiagramInputSchema };
