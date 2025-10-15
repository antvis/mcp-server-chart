import type { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import cors from "cors";
import express, { type Request, type Response } from "express";

export const startHTTPStreamableServer = async (
  createServer: () => Server,
  endpoint = "/mcp",
  port = 1122,
  host = "localhost",
): Promise<void> => {
  const app = express();
  app.use(express.json());
  app.use(cors({ origin: "*", exposedHeaders: ["Mcp-Session-Id"] }));

  app.post(endpoint, async (req: Request, res: Response) => {
    // In stateless mode, create a new transport for each request to prevent
    // request ID collisions. Different clients may use the same JSON-RPC request IDs,
    // which would cause responses to be routed to the wrong HTTP connections if
    // the transport state is shared.
    try {
      const server = createServer();
      const transport = new StreamableHTTPServerTransport({
        sessionIdGenerator: undefined,
        enableJsonResponse: true,
      });
      res.on("close", () => {
        transport.close();
      });

      await server.connect(transport);
      await transport.handleRequest(req, res, req.body);
    } catch (error) {
      if (!res.headersSent) {
        res.status(500).json({
          jsonrpc: "2.0",
          error: { code: -32603, message: "Internal server error" },
          id: null,
        });
      }
    }
  });

  app.listen(port, host, () => {
    console.log(
      `Streamable HTTP Server listening on http://${host}:${port}${endpoint}`,
    );
  });
};
