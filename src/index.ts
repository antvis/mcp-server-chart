#!/usr/bin/env node
import { McpServerChart } from "./server";

const server = new McpServerChart();
server.runStdioServer().catch(console.error);
