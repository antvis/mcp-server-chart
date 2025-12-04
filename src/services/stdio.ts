import type { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { logger } from "../utils/logger";

export async function startStdioMcpServer(server: Server): Promise<void> {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  logger.success("Stdio MCP Server started");
}
