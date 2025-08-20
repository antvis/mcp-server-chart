import type { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import express from "express";

export const startSSEMcpServer = async (
  server: Server,
  endpoint = "/sse",
  port = 1122,
): Promise<void> => {
  const app = express();
  app.use(express.json());

  const activeTransports: Record<string, SSEServerTransport> = {};

  // Handle GET requests to the SSE endpoint
  app.get(endpoint, async (req, res) => {
    const transport = new SSEServerTransport("/messages", res);
    activeTransports[transport.sessionId] = transport;

    let closed = false;

    res.on("close", async () => {
      closed = true;
      try {
        await server.close();
      } catch (error) {
        console.error("Error closing server:", error);
      }
      delete activeTransports[transport.sessionId];
    });

    try {
      await server.connect(transport);
      await transport.send({
        jsonrpc: "2.0",
        method: "sse/connection",
        params: { message: "SSE Connection established" },
      });
    } catch (error) {
      if (!closed) {
        console.error("Error connecting to server:", error);
        res.status(500).send("Error connecting to server");
      }
    }
  });

  // Handle POST requests to the messages endpoint
  app.post("/messages", async (req, res) => {
    const sessionId = req.query.sessionId as string;

    if (!sessionId) {
      res.status(400).send("No sessionId");
      return;
    }

    const activeTransport = activeTransports[sessionId];
    if (!activeTransport) {
      res.status(400).send("No active transport");
      return;
    }

    await activeTransport.handlePostMessage(req, res);
  });

  app.listen(port, () => {
    console.log(`SSE Server running on http://localhost:${port}${endpoint}`);
  });
};
