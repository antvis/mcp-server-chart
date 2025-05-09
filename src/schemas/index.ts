// Combine all schemas for easy reference
import * as ChartSchemas from "./charts";

// Export the map of chart types to their respective schemas
export const SchemaMap = {
  line: ChartSchemas.LineChartInputSchema,
  column: ChartSchemas.ColumnChartInputSchema,
  pie: ChartSchemas.PieChartInputSchema,
  area: ChartSchemas.AreaChartInputSchema,
  bar: ChartSchemas.BarChartInputSchema,
  histogram: ChartSchemas.HistogramChartInputSchema,
  scatter: ChartSchemas.ScatterChartInputSchema,
  "word-cloud": ChartSchemas.WordCloudChartInputSchema,
  radar: ChartSchemas.RadarChartInputSchema,
  treemap: ChartSchemas.TreemapChartInputSchema,
  "dual-axes": ChartSchemas.DualAxesChartInputSchema,
  "mind-map": ChartSchemas.MindMapChartInputSchema,
  "network-graph": ChartSchemas.NetworkGraphInputSchema,
  "flow-diagram": ChartSchemas.FlowDiagramInputSchema,
  "fishbone-diagram": ChartSchemas.FishboneDiagramInputSchema,
};
