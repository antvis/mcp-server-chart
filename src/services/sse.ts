import http from "node:http";
import type { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";

export const startSSEMcpServer = async (
  server: Server,
  endpoint = "/sse",
  port = 9528,
): Promise<void> => {
  const activeTransports: Record<string, SSEServerTransport> = {};

  const httpServer = http.createServer(async (req, res) => {
    if (req.headers.origin) {
      try {
        const origin = new URL(req.headers.origin);

        res.setHeader("Access-Control-Allow-Origin", origin.origin);
        res.setHeader("Access-Control-Allow-Credentials", "true");
        res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        res.setHeader("Access-Control-Allow-Headers", "*");
      } catch (error) {
        console.error("Error parsing origin:", error);
      }
    }

    if (req.method === "OPTIONS") {
      res.writeHead(204).end();
      return;
    }

    if (!req.url) {
      res.writeHead(400).end("No URL");
      return;
    }

    if (req.method === "GET" && req.url === "/health") {
      res.writeHead(200, { "Content-Type": "text/plain" }).end("OK");
      return;
    }

    if (req.method === "GET" && req.url === "/ping") {
      res.writeHead(200).end("pong");
      return;
    }

    if (
      req.method === "GET" &&
      new URL(req.url, "http://localhost").pathname === endpoint
    ) {
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
  });

  // clean up server when process exit
  const cleanup = () => {
    console.log("\nClosing SSE server...");
    httpServer.close(() => {
      console.log("SSE server closed");
      process.exit(0);
    });
  };

  process.on("SIGINT", cleanup); // Ctrl+C
  process.on("SIGTERM", cleanup); // kill command

  httpServer.listen(port, () => {
    console.error(
      `MCP Server Chart running on SSE at port ${port} with endpoint ${endpoint}`,
    );
  });
};
