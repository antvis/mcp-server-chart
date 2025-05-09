import { z } from "zod";

// Define Zod schemas for base configuration
export const BaseConfigSchema = {
  width: z
    .number()
    .default(600)
    .describe("Set the width of chart, default is 600."),
  height: z
    .number()
    .default(400)
    .describe("Set the height of chart, default is 400."),
  title: z.string().optional().describe("Set the title of chart."),
  axisXTitle: z.string().optional().describe("Set the x-axis title of chart."),
  axisYTitle: z.string().optional().describe("Set the y-axis title of chart."),
};

// Common data schema components
export const LineChartDataSchema = z.object({
  time: z.string(),
  value: z.number(),
});

export const ColumnChartDataSchema = z.object({
  category: z.string(),
  value: z.number(),
  group: z.string().optional(),
});

export const PieChartDataSchema = z.object({
  category: z.string(),
  value: z.number(),
});

export const AreaChartDataSchema = z.object({
  time: z.string(),
  value: z.number(),
  group: z.string().optional(),
});

export const BarChartDataSchema = z.object({
  category: z.string(),
  value: z.number(),
  group: z.string().optional(),
});

export const ScatterChartDataSchema = z.object({
  x: z.number(),
  y: z.number(),
});

export const WordCloudChartDataSchema = z.object({
  text: z.string(),
  value: z.string(),
});

export const RadarChartDataSchema = z.object({
  name: z.string(),
  value: z.number(),
  group: z.string().optional(),
});

// Define recursive schema for hierarchical data
export const TreeNodeSchema: z.ZodType<any> = z.lazy(() =>
  z.object({
    name: z.string(),
    value: z.number(),
    children: z.array(TreeNodeSchema).optional(),
  }),
);

export const NodeSchema = z.object({
  name: z.string(),
});

export const EdgeSchema = z.object({
  source: z.string(),
  target: z.string(),
  name: z.string(),
});

export const MindMapNodeSchema: z.ZodType<any> = z.lazy(() =>
  z.object({
    name: z.string(),
    children: z.array(MindMapNodeSchema).optional(),
  }),
);

export const FishboneNodeSchema: z.ZodType<any> = z.lazy(() =>
  z.object({
    name: z.string(),
    children: z.array(FishboneNodeSchema).optional(),
  }),
);

export const DualAxesSeriesSchema = z.object({
  type: z
    .enum(["column", "line"])
    .describe("The optional value can be 'column' or 'line'."),
  data: z
    .array(z.number())
    .describe(
      "When type is column, the data represents quantities. When type is line, the data represents ratios.",
    ),
  axisYTitle: z.string().describe("Set the y-axis title of the chart series."),
});
