import type { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import type { Request, Response } from "express";
import { createExpressServer } from "../utils";

export const startSSEMcpServer = async (
  server: Server,
  endpoint = "/sse",
  port = 1122,
): Promise<void> => {
  const activeTransports: Record<string, SSEServerTransport> = {};

  // Custom cleanup for SSE server
  const cleanup = () => {
    // Close all active transports
    for (const transport of Object.values(activeTransports)) {
      transport.close();
    }
    server.close();
  };

  // Create Express server
  const { app, start } = createExpressServer({
    port,
    serverType: "SSE Server",
    cleanup,
  });

  // Handle GET requests to the SSE endpoint
  app.get(endpoint, async (req: Request, res: Response) => {
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
  app.post("/messages", async (req: Request, res: Response) => {
    const sessionId = req.query.sessionId as string;

    if (!sessionId) {
      res.status(400).send("No sessionId");
      return;
    }

    const activeTransport: SSEServerTransport | undefined =
      activeTransports[sessionId];

    if (!activeTransport) {
      res.status(400).send("No active transport");
      return;
    }

    await activeTransport.handlePostMessage(req, res);
  });

  // Start the server and log endpoints
  start([endpoint, "/messages"]);
};
