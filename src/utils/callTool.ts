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
        logger.error(`Invalid parameters: ${result.error.message}`);
        throw new McpError(
          ErrorCode.InvalidParams,
          `Invalid parameters: ${result.error.message}`,
        );
      }
    }

    const isMapChartTool = [
      "generate_district_map",
      "generate_path_map",
      "generate_pin_map",
    ].includes(tool);

    if (isMapChartTool) {
      // For map charts, we use the generateMap function, and return the mcp result.
      const { metadata, ...result } = await generateMap(tool, args);
      return result;
    }

    const url = await generateChartUrl(chartType, args);
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
        spec: { type: chartType, ...args },
      },
    };
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  } catch (error: any) {
    const message = error?.message || "Unknown error";
    logger.error(`Failed to generate chart: ${message}.`);
    if (error instanceof McpError) throw error;
    if (error instanceof ValidateError)
      throw new McpError(ErrorCode.InvalidParams, error.message);
    // Return isError content instead of throwing InternalError (-32603).
    // InternalError is treated as a server crash by MCP clients; agents
    // cannot recover from it. Returning isError: true with a descriptive
    // message lets agents self-correct (e.g., fix their input and retry).
    return {
      content: [
        {
          type: "text",
          text: `Failed to generate chart: ${message}. Please check that the data matches the expected format for this chart type.`,
        },
      ],
      isError: true,
    };
  }
}
