// Export all chart tools
import { LineChartTool } from "./line";
import { ColumnChartTool } from "./column";
import { PieChartTool } from "./pie";
import { AreaChartTool } from "./area";
import { BarChartTool } from "./bar";
import { HistogramChartTool } from "./histogram";
import { ScatterChartTool } from "./scatter";
import { WordCloudChartTool } from "./word-cloud";
import { RadarChartTool } from "./radar";
import { TreemapChartTool } from "./treemap";
import { DualAxesChartTool } from "./dual-axes";
import { MindMapChartTool } from "./mind-map";
import { NetworkGraphChartTool } from "./network-graph";
import { FlowDiagramChartTool } from "./flow-diagram";
import { FishboneDiagramChartTool } from "./fishbone-diagram";

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

// Export all schemas and tools individually
export { LineChartTool, LineChartInputSchema } from "./line";
export { ColumnChartTool, ColumnChartInputSchema } from "./column";
export { PieChartTool, PieChartInputSchema } from "./pie";
export { AreaChartTool, AreaChartInputSchema } from "./area";
export { BarChartTool, BarChartInputSchema } from "./bar";
export { HistogramChartTool, HistogramChartInputSchema } from "./histogram";
export { ScatterChartTool, ScatterChartInputSchema } from "./scatter";
export { WordCloudChartTool, WordCloudChartInputSchema } from "./word-cloud";
export { RadarChartTool, RadarChartInputSchema } from "./radar";
export { TreemapChartTool, TreemapChartInputSchema } from "./treemap";
export { DualAxesChartTool, DualAxesChartInputSchema } from "./dual-axes";
export { MindMapChartTool, MindMapChartInputSchema } from "./mind-map";
export {
  NetworkGraphChartTool,
  NetworkGraphInputSchema,
} from "./network-graph";
export { FlowDiagramChartTool, FlowDiagramInputSchema } from "./flow-diagram";
export {
  FishboneDiagramChartTool,
  FishboneDiagramInputSchema,
} from "./fishbone-diagram";
