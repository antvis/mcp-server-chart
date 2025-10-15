import type { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import express, { type Request, type Response } from "express";
import { logger } from "../utils/logger";

export const startSSEMcpServer = async (
  server: Server,
  endpoint = "/sse",
  port = 1122,
  host = "localhost",
): Promise<void> => {
  const app = express();
  app.use(express.json());

  const transports: Record<string, SSEServerTransport> = {};

  app.get(endpoint, async (req: Request, res: Response) => {
    const transport = new SSEServerTransport("/messages", res);
    transports[transport.sessionId] = transport;

    transport.onclose = () => {
      delete transports[transport.sessionId];
      logger.info(`SSE Server disconnected: sessionId=${transport.sessionId}`);
    };

    await server.connect(transport);
    logger.info(`SSE Server connected: sessionId=${transport.sessionId}`);
  });

  app.post("/messages", async (req: Request, res: Response) => {
    const sessionId = req.query.sessionId as string;
    if (!sessionId) {
      logger.warn("SSE Server sessionId parameter is missing");
      return res.status(400).send("Missing sessionId parameter");
    }

    const transport = transports[sessionId];
    if (!transport) {
      logger.warn(`SSE Server session not found: sessionId=${sessionId}`);
      return res.status(404).send("Session not found");
    }

    try {
      logger.info(`SSE Server handling message: sessionId=${sessionId}`);
      await transport.handlePostMessage(req, res, req.body);
    } catch (e) {
      logger.error("SSE Server error handling message", e);
      if (!res.headersSent) res.status(500).send("Error handling request");
    }
  });

  app.listen(port, host, () => {
    logger.success(`SSE Server listening on http://${host}:${port}${endpoint}`);
  });
};
