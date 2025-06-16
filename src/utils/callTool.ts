import { ErrorCode, McpError } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import * as Charts from "../charts";
import { generateChartUrl } from "./generate";

// Chart type definitions
export type ChartType = keyof typeof Charts;
export type ToolName =
  | `generate_${string}_chart`
  | `generate_${string}_diagram`
  | `generate_${string}_map`;

// Chart type mapping with proper typing
const CHART_TYPE_MAP: Record<string, ChartType> = {
  generate_area_chart: "area",
  generate_bar_chart: "bar",
  generate_column_chart: "column",
  generate_dual_axes_chart: "dual-axes",
  generate_fishbone_diagram: "fishbone-diagram",
  generate_flow_diagram: "flow-diagram",
  generate_histogram_chart: "histogram",
  generate_line_chart: "line",
  generate_mind_map: "mind-map",
  generate_network_graph: "network-graph",
  generate_pie_chart: "pie",
  generate_radar_chart: "radar",
  generate_scatter_chart: "scatter",
  generate_treemap_chart: "treemap",
  generate_word_cloud_chart: "word-cloud",
} as const;

/**
 * Call a tool to generate a chart based on the provided name and arguments.
 * @param tool The name of the tool to call, e.g., "generate_area_chart".
 * @param args The arguments for the tool, which should match the expected schema for the chart type.
 * @returns
 */
export async function callTool(
  tool: string,
  args: Record<string, unknown> = {},
) {
  const chartType = CHART_TYPE_MAP[tool];

  if (!chartType) {
    throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${tool}.`);
  }

  try {
    // Validate input using Zod before sending to API.
    // Select the appropriate schema based on the chart type.
    const chartConfig = Charts[chartType];

    if (!chartConfig) {
      throw new McpError(
        ErrorCode.InternalError,
        `Chart configuration not found for type: ${chartType}`,
      );
    }

    const { schema } = chartConfig;

    if (schema) {
      // Use safeParse instead of parse and try-catch.
      const result = z.object(schema).safeParse(args);
      if (!result.success) {
        throw new McpError(
          ErrorCode.InvalidParams,
          `Invalid parameters: ${result.error.message}`,
        );
      }
    }

    const url = await generateChartUrl(chartType, args);

    return {
      content: [
        {
          type: "text",
          text: url,
        },
      ],
    };
  } catch (error: unknown) {
    if (error instanceof McpError) throw error;

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    throw new McpError(
      ErrorCode.InternalError,
      `Failed to generate chart: ${errorMessage}`,
    );
  }
}
