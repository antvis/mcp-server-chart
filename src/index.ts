#!/usr/bin/env node
import { parseArgs } from "node:util";
import { McpServerChart } from "./server";

// Parse command line arguments
const { values } = parseArgs({
  options: {
    mode: {
      type: "string",
      short: "m",
      default: "stdio",
    },
    port: {
      type: "string",
      short: "p",
      default: "9528",
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
  --mode, -m     Specify the mode: "stdio" or "sse" (default: "stdio")
  --port, -p     Specify the port for SSE mode (default: 9528)
  --endpoint, -e Specify the endpoint for SSE mode (default: "/sse")
  --help, -h     Show this help message
  `);
  process.exit(0);
}

const server = new McpServerChart();

// Run in the specified mode
const mode = values.mode.toLowerCase();
if (mode === "sse") {
  // Default to SSE mode
  const port = Number.parseInt(values.port as string, 10);
  const endpoint = values.endpoint as string;
  server.runSSEServer(endpoint, port).catch(console.error);
} else {
  server.runStdioServer().catch(console.error);
}
