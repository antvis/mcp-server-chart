#!/usr/bin/env node
import { parseArgs } from "node:util";
import { McpServerChart } from "./server";

// Parse command line arguments
const { values } = parseArgs({
  options: {
    transport: {
      type: "string",
      short: "t",
      default: "stdio",
    },
    port: {
      type: "string",
      short: "p",
      default: "1122",
    },
    endpoint: {
      type: "string",
      short: "e",
      default: "/sse",
    },
    help: {
      type: "boolean",
      short: "h",
    },
  },
});

// Display help information if requested
if (values.help) {
  console.log(`
MCP Server Chart CLI

Options:
  --transport, -t  Specify the transport protocol: "stdio" or "sse" (default: "stdio")
  --port, -p       Specify the port for SSE transport (default: 1122)
  --endpoint, -e   Specify the endpoint for SSE transport (default: "/sse")
  --help, -h       Show this help message
  `);
  process.exit(0);
}

const server = new McpServerChart();

// Run in the specified transport mode
const transport = values.transport.toLowerCase();
if (transport === "sse") {
  const port = Number.parseInt(values.port as string, 10);
  const endpoint = values.endpoint as string;
  server.runSSEServer(endpoint, port).catch(console.error);
} else {
  server.runStdioServer().catch(console.error);
}
