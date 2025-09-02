import type { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import express from "express";

export const startSSEMcpServer = async (
  server: Server,
  endpoint = "/sse",
  port = 1122,
  host = "localhost",
): Promise<void> => {
  const app = express();
  app.use(express.json());

  const transports: Record<string, SSEServerTransport> = {};

  app.get(endpoint, async (req, res) => {
    try {
      const transport = new SSEServerTransport("/messages", res);
      transports[transport.sessionId] = transport;
      transport.onclose = () => delete transports[transport.sessionId];
      await server.connect(transport);
    } catch (error) {
      if (!res.headersSent)
        res.status(500).send("Error establishing SSE stream");
    }
  });

  app.post("/messages", async (req, res) => {
    const sessionId = req.query.sessionId as string;
    if (!sessionId) return res.status(400).send("Missing sessionId parameter");

    const transport = transports[sessionId];
    if (!transport) return res.status(404).send("Session not found");

    try {
      await transport.handlePostMessage(req, res, req.body);
    } catch (error) {
      if (!res.headersSent) res.status(500).send("Error handling request");
    }
  });

  app.listen(port, host, () => {
    console.log(`SSE Server listening on http://${host}:${port}${endpoint}`);
  });
};
