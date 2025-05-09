import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from "@modelcontextprotocol/sdk/types.js";
import { ChartTypeMapping } from "./types";
import { SchemaMap } from "./schemas";
import { Tools } from "./tools";
import { generateChartUrl } from "./utils";
import { startStdioMcpServer } from "./services";

/**
 * MCP Server implementation for chart generation
 */
export class McpServerChart {
  private server: Server;

  constructor() {
    this.server = new Server(
      {
        name: "mcp-server-chart",
        version: "0.2.4",
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
      tools: Tools,
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
        const schema = SchemaMap[chartType];

        if (schema) {
          try {
            // Validate the arguments against the schema
            schema.parse(args);
          } catch (validationError: any) {
            throw new McpError(
              ErrorCode.InvalidParams,
              `Invalid parameters: ${validationError.message}`,
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
    console.error("MCP SERVER CHART running on stdio");
  }
}
