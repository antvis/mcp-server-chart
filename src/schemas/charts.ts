import { z } from "zod";
import {
  BaseConfigSchema,
  LineChartDataSchema,
  ColumnChartDataSchema,
  PieChartDataSchema,
  AreaChartDataSchema,
  BarChartDataSchema,
  ScatterChartDataSchema,
  WordCloudChartDataSchema,
  RadarChartDataSchema,
  TreeNodeSchema,
  NodeSchema,
  EdgeSchema,
  MindMapNodeSchema,
  FishboneNodeSchema,
  DualAxesSeriesSchema,
} from "./base";

// Chart input schemas
export const LineChartInputSchema = z.object({
  data: z
    .array(LineChartDataSchema)
    .describe("Data for line chart, such as, [{ time: '2015', value: 23 }]."),
  stack: z
    .boolean()
    .optional()
    .describe(
      "Whether stacking is enabled. When enabled, line charts require a 'group' field in the data.",
    ),
  width: BaseConfigSchema.width.optional(),
  height: BaseConfigSchema.height.optional(),
  title: BaseConfigSchema.title,
  axisXTitle: BaseConfigSchema.axisXTitle,
  axisYTitle: BaseConfigSchema.axisYTitle,
});

export const ColumnChartInputSchema = z.object({
  data: z
    .array(ColumnChartDataSchema)
    .describe(
      "Data for column chart, such as, [{ category: '北京' value: 825; group: '油车' }].",
    ),
  group: z
    .boolean()
    .optional()
    .describe(
      "Whether grouping is enabled. When enabled, column charts require a 'group' field in the data.",
    ),
  stack: z
    .boolean()
    .optional()
    .describe(
      "Whether stacking is enabled. When enabled, column charts require a 'group' field in the data.",
    ),
  width: BaseConfigSchema.width.optional(),
  height: BaseConfigSchema.height.optional(),
  title: BaseConfigSchema.title,
  axisXTitle: BaseConfigSchema.axisXTitle,
  axisYTitle: BaseConfigSchema.axisYTitle,
});

export const PieChartInputSchema = z.object({
  data: z
    .array(PieChartDataSchema)
    .describe(
      "Data for pie chart, (such as, [{ category: '分类一', value: 27 }])",
    ),
  innerRadius: z
    .number()
    .default(0)
    .describe(
      "Set the pie chart as a donut chart. Set the value to 0.6 to enable it.",
    ),
  width: BaseConfigSchema.width.optional(),
  height: BaseConfigSchema.height.optional(),
  title: BaseConfigSchema.title,
});

export const AreaChartInputSchema = z.object({
  data: z
    .array(AreaChartDataSchema)
    .describe("Data for area chart, such as, [{ time: '2018', value: 99.9 }]."),
  stack: z
    .boolean()
    .optional()
    .describe(
      "Whether stacking is enabled. When enabled, area charts require a 'group' field in the data.",
    ),
  width: BaseConfigSchema.width.optional(),
  height: BaseConfigSchema.height.optional(),
  title: BaseConfigSchema.title,
  axisXTitle: BaseConfigSchema.axisXTitle,
  axisYTitle: BaseConfigSchema.axisYTitle,
});

export const BarChartInputSchema = z.object({
  data: z
    .array(BarChartDataSchema)
    .describe(
      "Data for bar chart, such as, [{ category: '分类一', value: 10 }].",
    ),
  group: z
    .boolean()
    .optional()
    .describe(
      "Whether grouping is enabled. When enabled, bar charts require a 'group' field in the data.",
    ),
  stack: z
    .boolean()
    .optional()
    .describe(
      "Whether stacking is enabled. When enabled, bar charts require a 'group' field in the data.",
    ),
  width: BaseConfigSchema.width.optional(),
  height: BaseConfigSchema.height.optional(),
  title: BaseConfigSchema.title,
  axisXTitle: BaseConfigSchema.axisXTitle,
  axisYTitle: BaseConfigSchema.axisYTitle,
});

export const HistogramChartInputSchema = z.object({
  data: z
    .array(z.number())
    .describe("Data for histogram chart, such as, [78, 88, 60, 100, 95]."),
  binNumber: z
    .number()
    .optional()
    .describe(
      "Number of intervals to define the number of intervals in a histogram.",
    ),
  width: BaseConfigSchema.width.optional(),
  height: BaseConfigSchema.height.optional(),
  title: BaseConfigSchema.title,
  axisXTitle: BaseConfigSchema.axisXTitle,
  axisYTitle: BaseConfigSchema.axisYTitle,
});

export const ScatterChartInputSchema = z.object({
  data: z
    .array(ScatterChartDataSchema)
    .describe("Data for scatter chart, such as, [{ x: 10, y: 15 }]."),
  width: BaseConfigSchema.width.optional(),
  height: BaseConfigSchema.height.optional(),
  title: BaseConfigSchema.title,
  axisXTitle: BaseConfigSchema.axisXTitle,
  axisYTitle: BaseConfigSchema.axisYTitle,
});

export const WordCloudChartInputSchema = z.object({
  data: z
    .array(WordCloudChartDataSchema)
    .describe(
      "Data for word cloud chart, such as, [{ value: '4.272', text: '形成' }].",
    ),
  width: BaseConfigSchema.width.optional(),
  height: BaseConfigSchema.height.optional(),
  title: BaseConfigSchema.title,
});

export const RadarChartInputSchema = z.object({
  data: z
    .array(RadarChartDataSchema)
    .describe(
      "Data for radar chart, such as, [{ name: 'Design', value: 70 }].",
    ),
  width: BaseConfigSchema.width.optional(),
  height: BaseConfigSchema.height.optional(),
  title: BaseConfigSchema.title,
});

export const TreemapChartInputSchema = z.object({
  data: z
    .array(TreeNodeSchema)
    .describe(
      "Data for treemap chart, such as, [{ name: 'Design', value: 70, children: [{ name: 'Tech', value: 20 }] }].",
    ),
  width: BaseConfigSchema.width.optional(),
  height: BaseConfigSchema.height.optional(),
  title: BaseConfigSchema.title,
});

export const DualAxesChartInputSchema = z.object({
  categories: z
    .array(z.string())
    .describe(
      "Categories for dual axes chart, such as, ['2015', '2016', '2017'].",
    ),
  series: z.array(DualAxesSeriesSchema),
  width: BaseConfigSchema.width.optional(),
  height: BaseConfigSchema.height.optional(),
  title: BaseConfigSchema.title,
  axisXTitle: BaseConfigSchema.axisXTitle,
});

export const MindMapChartInputSchema = z.object({
  data: MindMapNodeSchema.describe(
    "Data for mind map chart, such as, { name: 'main topic', children: [{ name: 'topic 1', children: [{ name:'subtopic 1-1' }] }",
  ),
  width: BaseConfigSchema.width.optional(),
  height: BaseConfigSchema.height.optional(),
  title: BaseConfigSchema.title,
});

export const NetworkGraphInputSchema = z.object({
  data: z
    .object({
      nodes: z.array(NodeSchema),
      edges: z.array(EdgeSchema),
    })
    .describe(
      "Data for network graph chart, such as, { nodes: [{ name: 'node1' }, { name: 'node2' }], edges: [{ source: 'node1', target: 'node2', name: 'edge1' }] }",
    ),
  width: BaseConfigSchema.width.optional(),
  height: BaseConfigSchema.height.optional(),
  title: BaseConfigSchema.title,
});

export const FlowDiagramInputSchema = z.object({
  data: z
    .object({
      nodes: z.array(NodeSchema),
      edges: z.array(EdgeSchema),
    })
    .describe(
      "Data for flow diagram chart, such as, { nodes: [{ name: 'node1' }, { name: 'node2' }], edges: [{ source: 'node1', target: 'node2', name: 'edge1' }] }",
    ),
  width: BaseConfigSchema.width.optional(),
  height: BaseConfigSchema.height.optional(),
  title: BaseConfigSchema.title,
});

export const FishboneDiagramInputSchema = z.object({
  data: FishboneNodeSchema.describe(
    "Data for fishbone diagram chart, such as, { name: 'main topic', children: [{ name: 'topic 1', children: [{ name: 'subtopic 1-1' }] }",
  ),
  width: BaseConfigSchema.width.optional(),
  height: BaseConfigSchema.height.optional(),
  title: BaseConfigSchema.title,
});
