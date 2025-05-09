import {
  LineChartInputSchema,
  ColumnChartInputSchema,
  PieChartInputSchema,
  AreaChartInputSchema,
  BarChartInputSchema,
  HistogramChartInputSchema,
  ScatterChartInputSchema,
  WordCloudChartInputSchema,
  RadarChartInputSchema,
  TreemapChartInputSchema,
  DualAxesChartInputSchema,
  MindMapChartInputSchema,
  NetworkGraphInputSchema,
  FlowDiagramInputSchema,
  FishboneDiagramInputSchema,
} from "./charts";

// Export the map of chart types to their respective schemas (for backward compatibility)
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

export { ChartTools } from "./charts";
