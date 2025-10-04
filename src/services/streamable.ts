import type { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import express, { Request, Response } from "express";
import cors from "cors";

export const startHTTPStreamableServer = async (
  createServer: () => Server,
  endpoint = "/mcp",
  port = 1122,
  host = "localhost",
): Promise<void> => {
  const app = express();
  app.use(express.json());
  app.use(cors({ origin: '*', exposedHeaders: ['Mcp-Session-Id'] }));

  app.post(endpoint, async (req: Request, res: Response) => {
    try {
      const server = createServer();
      const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });
      await server.connect(transport);
      await transport.handleRequest(req, res, req.body);
      res.on('close', () => {
        transport.close();
        server.close();
      });
    } catch (error) {
      if (!res.headersSent) {
        res.status(500).json({
          jsonrpc: '2.0',
          error: { code: -32603, message: 'Internal server error' },
          id: null,
        });
      }
    }
  });

  app.get(endpoint, (req: Request, res: Response) => {
    res.status(405).json({
      jsonrpc: "2.0",
      error: { code: -32000, message: "Method not allowed" },
      id: null
    });
  });

  app.delete(endpoint, (req: Request, res: Response) => {
    res.status(405).json({
      jsonrpc: "2.0",
      error: { code: -32000, message: "Method not allowed" },
      id: null
    });
  });

  app.listen(port, host, () => {
    console.log(`Streamable HTTP Server listening on http://${host}:${port}${endpoint}`);
  });
};
