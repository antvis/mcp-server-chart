import { ErrorCode, McpError } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import * as Charts from "../charts";
import { generateChartUrl, generateMap } from "./generate";
import { logger } from "./logger";
import { ValidateError } from "./validator";

// Chart type mapping
const CHART_TYPE_MAP = {
  generate_area_chart: "area",
  generate_bar_chart: "bar",
  generate_boxplot_chart: "boxplot",
  generate_column_chart: "column",
  generate_district_map: "district-map",
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
  generate_path_map: "path-map",
  generate_pie_chart: "pie",
  generate_pin_map: "pin-map",
  generate_radar_chart: "radar",
  generate_sankey_chart: "sankey",
  generate_scatter_chart: "scatter",
  generate_treemap_chart: "treemap",
  generate_venn_chart: "venn",
  generate_violin_chart: "violin",
  generate_waterfall_chart: "waterfall",
  generate_word_cloud_chart: "word-cloud",
  generate_spreadsheet: "spreadsheet",
} as const;

// Line/area charts use time-based x-axis that needs chronological sorting
const TIME_BASED_CHARTS = ["generate_line_chart", "generate_area_chart"];

/**
 * Sort line/area chart data by time field to ensure x-axis labels are chronological.
 * ISO-8601 date strings (e.g., "2026-01", "2026-03") sort correctly as strings.
 */
function sortTimeBasedData(
  args: Record<string, unknown>,
): Record<string, unknown> {
  if (!Array.isArray(args.data)) {
    return args;
  }
  const sortedData = [...args.data].sort((a, b) => {
    const timeA = (a as { time?: string }).time ?? "";
    const timeB = (b as { time?: string }).time ?? "";
    return timeA.localeCompare(timeB);
  });
  return { ...args, data: sortedData };
}

// Pre-compile Zod schemas at module load time to avoid recompiling on every request.
// biome-ignore lint/suspicious/noExplicitAny: schema types vary per chart
const COMPILED_SCHEMA_CACHE = new Map<string, z.ZodObject<any>>();
for (const chartType of Object.values(CHART_TYPE_MAP)) {
  const schema = Charts[chartType as keyof typeof Charts]?.schema;
  if (schema) {
    COMPILED_SCHEMA_CACHE.set(chartType, z.object(schema));
  }
}

/**
 * Call a tool to generate a chart based on the provided name and arguments.
 * @param tool The name of the tool to call, e.g., "generate_area_chart".
 * @param args The arguments for the tool, which should match the expected schema for the chart type.
 * @returns
 */
export async function callTool(tool: string, args: object = {}) {
  logger.info(`Calling tool: ${tool}`);
  const chartType = CHART_TYPE_MAP[tool as keyof typeof CHART_TYPE_MAP];

  if (!chartType) {
    logger.error(`Unknown tool: ${tool}`);
    throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${tool}.`);
  }

  try {
    // Validate input using Zod before sending to API.
    // Use pre-compiled schema from cache to avoid recompiling on every call.
    const compiledSchema = COMPILED_SCHEMA_CACHE.get(chartType);

    if (compiledSchema) {
      // Use safeParse instead of parse and try-catch.
      const result = compiledSchema.safeParse(args);
      if (!result.success) {
        // ZodError.message includes stack trace in Zod v4; use issues for clean messages
        const cleanMessage = result.error.issues
          .map((issue) =>
            issue.path.length > 0
              ? `${issue.path.join(".")}: ${issue.message}`
              : issue.message,
          )
          .join("; ");
        logger.error(`Invalid parameters: ${cleanMessage}`);
        throw new McpError(ErrorCode.InvalidParams, cleanMessage);
      }
    }

    const isMapChartTool = [
      "generate_district_map",
      "generate_path_map",
      "generate_pin_map",
    ].includes(tool);

    // Sort time-based chart data to ensure x-axis labels are chronological
    const sortedArgs = TIME_BASED_CHARTS.includes(tool)
      ? sortTimeBasedData(args as Record<string, unknown>)
      : (args as Record<string, unknown>);

    if (isMapChartTool) {
      // For map charts, we use the generateMap function, and return the mcp result.
      const { metadata, ...result } = await generateMap(tool, sortedArgs);
      return result;
    }

    const url = await generateChartUrl(chartType, sortedArgs);
    logger.info(`Generated chart URL: ${url}`);

    return {
      content: [
        {
          type: "text",
          text: url,
        },
      ],
      _meta: {
        description:
          "The content returned by MCP is the remote image URL of the visualization chart, which can be rendered using Markdown or HTML image tags. The _meta.spec content corresponds to the chart's configuration and spec, which can be rendered using AntV GPT-Vis chart components.",
        spec: { type: chartType, ...sortedArgs },
      },
    };
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  } catch (error: any) {
    logger.error(
      `Failed to generate chart: ${error.message || "Unknown error"}.`,
    );
    if (error instanceof McpError) throw error;
    if (error instanceof ValidateError)
      throw new McpError(ErrorCode.InvalidParams, error.message);
    throw new McpError(
      ErrorCode.InternalError,
      `Failed to generate chart: ${error?.message || "Unknown error."}`,
    );
  }
}
