import type { IncomingMessage, ServerResponse } from "node:http";
import type { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { type RequestHandlers, createBaseHttpServer } from "../utils";

export const startSSEMcpServer = async (
  server: Server,
  endpoint = "/sse",
  port = 1122,
): Promise<void> => {
  const activeTransports: Record<string, SSEServerTransport> = {};

  // Define the request handler for SSE-specific logic
  const handleRequest: RequestHandlers["handleRequest"] = async (
    req: IncomingMessage,
    res: ServerResponse,
  ) => {
    if (!req.url) {
      res.writeHead(400).end("No URL");
      return;
    }

    const reqUrl = new URL(req.url, "http://localhost");

    // Handle GET requests to the SSE endpoint
    if (req.method === "GET" && reqUrl.pathname === endpoint) {
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

          res.writeHead(500).end("Error connecting to server");
        }
      }

      return;
    }

    // Handle POST requests to the messages endpoint
    if (req.method === "POST" && req.url?.startsWith("/messages")) {
      const sessionId = new URL(
        req.url,
        "https://example.com",
      ).searchParams.get("sessionId");

      if (!sessionId) {
        res.writeHead(400).end("No sessionId");
        return;
      }

      const activeTransport: SSEServerTransport | undefined =
        activeTransports[sessionId];

      if (!activeTransport) {
        res.writeHead(400).end("No active transport");
        return;
      }

      await activeTransport.handlePostMessage(req, res);
      return;
    }

    // If we reach here, no handler matched
    res.writeHead(404).end("Not found");
  };

  // Custom cleanup for SSE server
  const cleanup = () => {
    // Close all active transports
    for (const transport of Object.values(activeTransports)) {
      transport.close();
    }
    server.close();
  };

  // Create the HTTP server using our factory
  createBaseHttpServer(port, endpoint, {
    handleRequest,
    cleanup,
    serverType: "SSE Server",
  });
};
