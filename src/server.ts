import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import * as Charts from "./charts";
import {
  startHTTPStreamableServer,
  startSSEMcpServer,
  startStdioMcpServer,
} from "./services";
import { callTool } from "./utils/callTool";
import { getDisabledTools } from "./utils/env";

/**
 * Creates and configures an MCP server for chart generation.
 */
export function createServer(): Server {
  const server = new Server(
    {
      name: "mcp-server-chart",
      version: "0.8.x",
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
 * Gets enabled tools based on environment variables.
 */
function getEnabledTools() {
  const disabledTools = getDisabledTools();
  const allCharts = Object.values(Charts);

  if (disabledTools.length === 0) {
    return allCharts;
  }

  return allCharts.filter((chart) => !disabledTools.includes(chart.tool.name));
}

/**
 * Sets up tool handlers for the MCP server.
 */
function setupToolHandlers(server: Server): void {
  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: getEnabledTools().map((chart) => chart.tool),
  }));

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    return await callTool(request.params.name, request.params.arguments);
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
  host = "localhost",
): Promise<void> {
  const server = createServer();
  await startSSEMcpServer(server, endpoint, port, host);
}

/**
 * Runs the server with HTTP streamable transport.
 */
export async function runHTTPStreamableServer(
  endpoint = "/mcp",
  port = 1122,
  host = "localhost",
): Promise<void> {
  await startHTTPStreamableServer(createServer, endpoint, port, host);
}
