import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
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
export function createServer(): McpServer {
  const server = new McpServer({
    name: "mcp-server-chart",
    version: "0.8.x",
  });

  setupToolHandlers(server);

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
function setupToolHandlers(server: McpServer): void {
  for (const chart of getEnabledTools()) {
    const { name, description, inputSchema } = chart?.tool || {};
    if (!name || !description || !inputSchema) {
      continue;
    }

    // @ts-ignore
    server.tool(name, description, inputSchema.shape, async (params) => {
      return await callTool(chart.tool.name, params);
    });
  }
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
