import http from "node:http";
import type { Server } from "@modelcontextprotocol/sdk/server/index.js";
import {
  type EventStore,
  StreamableHTTPServerTransport,
} from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { isInitializeRequest } from "@modelcontextprotocol/sdk/types.js";
import { InMemoryEventStore } from "../utils";

import { randomUUID } from "node:crypto";

export const startHTTPStreamableServer = async (
  createServer: () => Server,
  endpoint = "/mcp",
  port = 1122,
  eventStore: EventStore = new InMemoryEventStore(),
): Promise<void> => {
  const activeTransports: Record<
    string,
    {
      server: Server;
      transport: StreamableHTTPServerTransport;
    }
  > = {};

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

    if (req.method === "GET" && req.url === "/health") {
      res.writeHead(200, { "Content-Type": "text/plain" }).end("OK");
      return;
    }

    if (req.method === "GET" && req.url === "/ping") {
      res.writeHead(200).end("pong");
      return;
    }

    if (!req.url) {
      res.writeHead(400).end("No URL");
      return;
    }

    if (
      req.method === "POST" &&
      new URL(req.url, "http://localhost").pathname === endpoint
    ) {
      try {
        const sessionId = Array.isArray(req.headers["mcp-session-id"])
          ? req.headers["mcp-session-id"][0]
          : req.headers["mcp-session-id"];
        let transport: StreamableHTTPServerTransport;

        let server: Server;

        const body = await getBody(req);

        /**
         * diagram: https://modelcontextprotocol.io/specification/2025-03-26/basic/transports#sequence-diagram.
         */
        // 1. If the sessionId is provided and the server is already created, use the existing transport and server.
        if (sessionId && activeTransports[sessionId]) {
          transport = activeTransports[sessionId].transport;
          server = activeTransports[sessionId].server;

          // 2. If the sessionId is not provided and the request is an initialize request, create a new transport for the session.
        } else if (!sessionId && isInitializeRequest(body)) {
          transport = new StreamableHTTPServerTransport({
            // use the event store to store the events to replay on reconnect.
            // more details: https://modelcontextprotocol.io/specification/2025-03-26/basic/transports#resumability-and-redelivery.
            eventStore: eventStore || new InMemoryEventStore(),
            onsessioninitialized: (_sessionId: string) => {
              // add only when the id Sesison id is generated.
              activeTransports[_sessionId] = {
                server,
                transport,
              };
            },
            sessionIdGenerator: randomUUID,
          });

          // Handle the server close event.
          transport.onclose = async () => {
            const sid = transport.sessionId;
            if (sid && activeTransports[sid]) {
              try {
                await server?.close();
              } catch (error) {
                console.error("Error closing server:", error);
              }

              // delete used transport and server to avoid memory leak.
              delete activeTransports[sid];
            }
          };

          // Create the server
          try {
            server = createServer();
          } catch (error) {
            if (error instanceof Response) {
              res.writeHead(error.status).end(error.statusText);
              return;
            }
            res.writeHead(500).end("Error creating server");
            return;
          }

          server.connect(transport);

          await transport.handleRequest(req, res, body);
          return;
        } else {
          // Error if the server is not created but the request is not an initialize request.
          res.setHeader("Content-Type", "application/json");
          res.writeHead(400).end(
            JSON.stringify({
              error: {
                code: -32000,
                message: "Bad Request: No valid session ID provided",
              },
              id: null,
              jsonrpc: "2.0",
            }),
          );

          return;
        }

        // Handle the request if the server is already created.
        await transport.handleRequest(req, res, body);
      } catch (error) {
        console.error("Error handling request:", error);
        res.setHeader("Content-Type", "application/json");
        res.writeHead(500).end(
          JSON.stringify({
            error: { code: -32603, message: "Internal Server Error" },
            id: null,
            jsonrpc: "2.0",
          }),
        );
      }
      return;
    }

    if (
      req.method === "GET" &&
      new URL(req.url, "http://localhost").pathname === endpoint
    ) {
      const sessionId = req.headers["mcp-session-id"] as string | undefined;
      const activeTransport:
        | {
            server: Server;
            transport: StreamableHTTPServerTransport;
          }
        | undefined = sessionId ? activeTransports[sessionId] : undefined;

      if (!sessionId) {
        res.writeHead(400).end("No sessionId");
        return;
      }

      if (!activeTransport) {
        res.writeHead(400).end("No active transport");
        return;
      }

      const lastEventId = req.headers["last-event-id"] as string | undefined;
      if (lastEventId) {
        console.log(`Client reconnecting with Last-Event-ID: ${lastEventId}`);
      } else {
        console.log(`Establishing new SSE stream for session ${sessionId}`);
      }

      await activeTransport.transport.handleRequest(req, res);
      return;
    }

    if (
      req.method === "DELETE" &&
      new URL(req.url, "http://localhost").pathname === endpoint
    ) {
      console.log("received delete request");
      const sessionId = req.headers["mcp-session-id"] as string | undefined;
      if (!sessionId) {
        res.writeHead(400).end("Invalid or missing sessionId");
        return;
      }

      console.log("received delete request for session", sessionId);

      const transport = activeTransports[sessionId].transport;
      if (!transport) {
        res.writeHead(400).end("No active transport");
        return;
      }

      try {
        await transport.handleRequest(req, res);
      } catch (error) {
        console.error("Error handling delete request:", error);
        res.writeHead(500).end("Error handling delete request");
      }

      return;
    }
  });

  const cleanup = () => {
    console.log("\nClosing Streamable server...");
    for (const { server, transport } of Object.values(activeTransports)) {
      transport.close();
      server.close();
    }

    httpServer.close(() => {
      console.log("Streamable server closed");
      process.exit(0);
    });
  };

  process.on("SIGINT", cleanup); // Ctrl+C
  process.on("SIGTERM", cleanup); // kill command

  httpServer.listen(port, () => {
    const serverUrl = `http://localhost:${port}${endpoint}`;
    const healthUrl = `http://localhost:${port}/health`;
    const pingUrl = `http://localhost:${port}/ping`;

    console.log(
      `Streamable server running on: \x1b[32m\u001B[4m${serverUrl}\u001B[0m\x1b[0m`,
    );
    console.log("\nTest endpoints:");
    console.log(`• Health check: \u001B[4m${healthUrl}\u001B[0m`);
    console.log(`• Ping test: \u001B[4m${pingUrl}\u001B[0m`);
  });
};

function getBody(request: http.IncomingMessage) {
  return new Promise((resolve) => {
    const bodyParts: Buffer[] = [];
    let body: string;
    request
      .on("data", (chunk) => {
        bodyParts.push(chunk);
      })
      .on("end", () => {
        body = Buffer.concat(bodyParts).toString();
        resolve(JSON.parse(body));
      });
  });
}
