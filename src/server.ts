import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from "@modelcontextprotocol/sdk/types.js";
import * as Charts from "./charts";
import {
  startHTTPStreamableServer,
  startSSEMcpServer,
  startStdioMcpServer,
} from "./services";
import { ChartTypeMapping, generateChartUrl } from "./utils";

/**
 * Creates and configures an MCP server for chart generation.
 */
export function createServer(): Server {
  const server = new Server(
    {
      name: "mcp-server-chart",
      version: "0.4.2",
    },
    {
      capabilities: {
        tools: {},
      },
    },
  );

  setupToolHandlers(server);

  server.onerror = (error) => console.error("[MCP Error]", error);
  process.on("SIGINT", async () => {
    await server.close();
    process.exit(0);
  });

  return server;
}

/**
 * Sets up tool handlers for the MCP server.
 */
function setupToolHandlers(server: Server): void {
  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: Object.values(Charts).map((chart) => chart.tool),
  }));

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const chartType =
      ChartTypeMapping[request.params.name as keyof typeof ChartTypeMapping];

    if (!chartType) {
      throw new McpError(
        ErrorCode.MethodNotFound,
        `Unknown tool: ${request.params.name}.`,
      );
    }

    try {
      // Validate input using Zod before sending to API.
      const args = request.params.arguments || {};

      // Select the appropriate schema based on the chart type.
      const schema = Charts[chartType].schema;

      if (schema) {
        // Use safeParse instead of parse and try-catch.
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

/**
 * Runs the server with stdio transport.
 */
export async function runStdioServer(): Promise<void> {
  const server = createServer();
  await startStdioMcpServer(server);
}

/**
 * Runs the server with SSE transport.
 */
export async function runSSEServer(
  endpoint = "/sse",
  port = 1122,
): Promise<void> {
  const server = createServer();
  await startSSEMcpServer(server, endpoint, port);
}

/**
 * Runs the server with HTTP streamable transport.
 */
export async function runHTTPStreamableServer(
  endpoint = "/mcp",
  port = 1122,
): Promise<void> {
  await startHTTPStreamableServer(createServer, endpoint, port);
}
