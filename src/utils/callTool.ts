import { ErrorCode, McpError } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import * as Charts from "../charts";
import { generateChartUrl } from "./generate";
import { ValidateError } from "./validator";

// Chart type mapping
const CHART_TYPE_MAP = {
  generate_area_chart: "area",
  generate_bar_chart: "bar",
  generate_boxplot_chart: "boxplot",
  generate_column_chart: "column",
  generate_dual_axes_chart: "dual-axes",
  generate_fishbone_diagram: "fishbone-diagram",
  generate_flow_diagram: "flow-diagram",
  generate_funnel_chart: "funnel",
  generate_histogram_chart: "histogram",
  generate_line_chart: "line",
  generate_liquid_chart: "liquid",
  generate_mind_map: "mind-map",
  generate_network_graph: "network-graph",
  generate_organization_chart: "organization-chart",
  generate_pie_chart: "pie",
  generate_radar_chart: "radar",
  generate_sankey_chart: "sankey",
  generate_scatter_chart: "scatter",
  generate_treemap_chart: "treemap",
  generate_venn_chart: "venn",
  generate_violin_chart: "violin",
  generate_word_cloud_chart: "word-cloud",
} as const;

/**
 * Call a tool to generate a chart based on the provided name and arguments.
 * @param tool The name of the tool to call, e.g., "generate_area_chart".
 * @param args The arguments for the tool, which should match the expected schema for the chart type.
 * @returns
 */
export async function callTool(tool: string, args: object = {}) {
  const chartType = CHART_TYPE_MAP[tool as keyof typeof CHART_TYPE_MAP];

  if (!chartType) {
    throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${tool}.`);
  }

  try {
    // Validate input using Zod before sending to API.
    // Select the appropriate schema based on the chart type.
    const schema = Charts[chartType].schema;

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
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  } catch (error: any) {
    if (error instanceof McpError) throw error;
    if (error instanceof ValidateError)
      throw new McpError(ErrorCode.InvalidParams, error.message);
    throw new McpError(
      ErrorCode.InternalError,
      `Failed to generate chart: ${error?.message || "Unknown error."}`,
    );
  }
}
