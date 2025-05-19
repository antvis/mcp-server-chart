import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from "@modelcontextprotocol/sdk/types.js";
import * as Charts from "./charts";
import { startSSEMcpServer, startStdioMcpServer } from "./services";
import { ChartTypeMapping, generateChartUrl } from "./utils";

/**
 * MCP Server implementation for chart generation
 */
export class McpServerChart {
  private server: Server;

  constructor() {
    this.server = new Server(
      {
        name: "mcp-server-chart",
        version: "0.2.6",
      },
      {
        capabilities: {
          tools: {},
        },
      },
    );

    this.setupToolHandlers();

    this.server.onerror = (error) => console.error("[MCP Error]", error);
    process.on("SIGINT", async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  private setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: Object.values(Charts).map((chart) => chart.tool),
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const chartType =
        ChartTypeMapping[request.params.name as keyof typeof ChartTypeMapping];

      if (!chartType) {
        throw new McpError(
          ErrorCode.MethodNotFound,
          `Unknown tool: ${request.params.name}.`,
        );
      }

      try {
        // Validate input using Zod before sending to API
        const args = request.params.arguments || {};

        // Select the appropriate schema based on the chart type
        const schema = Charts[chartType].schema;

        if (schema) {
          // Use safeParse instead of parse and try-catch
          const result = schema.safeParse(args);
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
        throw new McpError(
          ErrorCode.InternalError,
          `Failed to generate chart: ${error?.message || "Unknown error."}`,
        );
      }
    });
  }

  async runStdioServer() {
    await startStdioMcpServer(this.server);
  }

  async runSSEServer(endpoint = "/sse", port = 8080) {
    await startSSEMcpServer(this.server, endpoint, port);
  }
}
