#!/usr/bin/env node
import { parseArgs } from "node:util";
import {
  runHTTPStreamableServer,
  runSSEServer,
  runStdioServer,
} from "./server";

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
  --transport, -t  Specify the transport protocol: "stdio" or "sse" or "streamable" (default: "stdio")
  --port, -p       Specify the port for SSE or streamable transport (default: 1122)
  --endpoint, -e   Specify the endpoint for SSE or streamable transport (default: "/sse")
  --help, -h       Show this help message
  `);
  process.exit(0);
}

// Run in the specified transport mode
const transport = values.transport.toLowerCase();
if (transport === "sse") {
  const port = Number.parseInt(values.port as string, 10);
  const endpoint = values.endpoint as string;
  runSSEServer(endpoint, port).catch(console.error);
} else if (transport === "streamable") {
  const port = Number.parseInt(values.port as string, 10);
  const endpoint = values.endpoint as string;
  runHTTPStreamableServer(endpoint, port).catch(console.error);
} else {
  runStdioServer().catch(console.error);
}
