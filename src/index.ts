#!/usr/bin/env node
import { parseArgs } from "node:util";
import {
  runHTTPStreamableServer,
  runSSEServer,
  runStdioServer,
} from "./server";

// Parse command line arguments
const parsed = parseArgs({
  options: {
    transport: {
      type: "string",
      short: "t",
      default: "stdio",
    },
    host: {
      type: "boolean",
      short: "h",
      default: false,
    },
    port: {
      type: "string",
      short: "p",
      default: "1122",
    },
    endpoint: {
      type: "string",
      short: "e",
      default: "", // We'll handle defaults per transport type
    },
    help: {
      type: "boolean",
      short: "H",
    },
  },
  allowPositionals: true,
  tokens: true,
});
// Initialize default host value
let host = "localhost";
// Flag to track if we're expecting a host value in the next token
let isHostValue = false;

// Iterate through parsed command line tokens to extract host value
for (const item of parsed.tokens) {
  // If current token is the host option flag
  if (item.kind === "option" && item.name === "host") {
    isHostValue = true;
    continue;
  }
  // If we're expecting a host value (previous token was --host flag)
  if (isHostValue) {
    // Deep copy the token to avoid reference issues
    const temp = JSON.parse(JSON.stringify(item));
    // Extract host value or default to "0.0.0.0"
    host = temp.value || "0.0.0.0";
    isHostValue = false;
    break;
  }
}

// If --host flag was set but no value followed it, use "0.0.0.0" as default
if (isHostValue) {
  host = "0.0.0.0";
}

// Create a deep copy of parsed values and assign the determined host
const values = JSON.parse(JSON.stringify(parsed.values));
values.host = host;

// Display help information if requested
if (values.help) {
  console.log(`
MCP Server Chart CLI

Options:
  --transport, -t  Specify the transport protocol: "stdio", "sse", or "streamable" (default: "stdio")
  --host, -h       Specify the host for SSE or streamable transport (default: localhost)
  --port, -p       Specify the port for SSE or streamable transport (default: 1122)
  --endpoint, -e   Specify the endpoint for the transport:
                   - For SSE: default is "/sse"
                   - For streamable: default is "/mcp"
  --help, -H       Show this help message
  `);
  process.exit(0);
}

// Run in the specified transport mode
const transport = values.transport.toLowerCase();

if (transport === "sse") {
  const port = Number.parseInt(values.port as string, 10);
  // Use provided endpoint or default to "/sse" for SSE
  const endpoint = values.endpoint || "/sse";
  const host = values.host || "localhost";
  runSSEServer(endpoint, port, host).catch(console.error);
} else if (transport === "streamable") {
  const port = Number.parseInt(values.port as string, 10);
  // Use provided endpoint or default to "/mcp" for streamable
  const endpoint = values.endpoint || "/mcp";
  const host = values.host || "localhost";
  runHTTPStreamableServer(endpoint, port, host).catch(console.error);
} else {
  runStdioServer().catch(console.error);
}
