import http from "node:http";
import type { IncomingMessage, ServerResponse } from "node:http";

/**
 * Interface for request handlers that will be passed to the server factory
 */
export interface RequestHandlers {
  /**
   * Main handler for HTTP requests
   */
  handleRequest: (req: IncomingMessage, res: ServerResponse) => Promise<void>;

  /**
   * Custom cleanup function to be called when the server is shutting down
   */
  cleanup?: () => void;

  /**
   * Server type name for logging purposes
   */
  serverType: string;
}

/**
 * Handles CORS headers for incoming requests
 */
function handleCORS(req: IncomingMessage, res: ServerResponse): void {
  if (req.headers.origin) {
    try {
      const origin = new URL(req.headers.origin as string);
      res.setHeader("Access-Control-Allow-Origin", origin.origin);
      res.setHeader("Access-Control-Allow-Credentials", "true");
      res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
      res.setHeader("Access-Control-Allow-Headers", "*");
    } catch (error) {
      console.error("Error parsing origin:", error);
    }
  }
}

/**
 * Handles common endpoints like health check and ping
 * @returns true if the request was handled, false otherwise
 */
function handleCommonEndpoints(
  req: IncomingMessage,
  res: ServerResponse,
): boolean {
  if (!req.url) {
    res.writeHead(400).end("No URL");
    return true;
  }

  if (req.method === "GET" && req.url === "/health") {
    res.writeHead(200, { "Content-Type": "text/plain" }).end("OK");
    return true;
  }

  if (req.method === "GET" && req.url === "/ping") {
    res.writeHead(200).end("pong");
    return true;
  }

  return false;
}

/**
 * Sets up signal handlers for graceful shutdown
 */
function setupCleanupHandlers(
  httpServer: http.Server,
  customCleanup?: () => void,
): void {
  const cleanup = () => {
    console.log("\nClosing server...");

    // Execute custom cleanup if provided
    if (customCleanup) customCleanup();

    httpServer.close(() => {
      console.log("Server closed");
      process.exit(0);
    });
  };

  process.on("SIGINT", cleanup);
  process.on("SIGTERM", cleanup);
}

/**
 * Logs server startup information with formatted URLs
 */
function logServerStartup(
  serverType: string,
  port: number,
  endpoint: string,
): void {
  const serverUrl = `http://localhost:${port}${endpoint}`;
  const healthUrl = `http://localhost:${port}/health`;
  const pingUrl = `http://localhost:${port}/ping`;

  console.log(
    `${serverType} running on: \x1b[32m\u001B[4m${serverUrl}\u001B[0m\x1b[0m`,
  );
  console.log("\nTest endpoints:");
  console.log(`• Health check: \u001B[4m${healthUrl}\u001B[0m`);
  console.log(`• Ping test: \u001B[4m${pingUrl}\u001B[0m`);
}

/**
 * Creates a base HTTP server with common functionality
 */
export function createBaseHttpServer(
  port: number,
  endpoint: string,
  handlers: RequestHandlers,
): http.Server {
  const httpServer = http.createServer(async (req, res) => {
    // Handle CORS for all requests
    handleCORS(req, res);

    // Handle OPTIONS requests
    if (req.method === "OPTIONS") {
      res.writeHead(204).end();
      return;
    }

    // Handle common endpoints like health and ping
    if (handleCommonEndpoints(req, res)) return;

    // Pass remaining requests to the specific handler
    try {
      await handlers.handleRequest(req, res);
    } catch (error) {
      console.error(`Error in ${handlers.serverType} request handler:`, error);
      res.writeHead(500).end("Internal Server Error");
    }
  });

  // Set up cleanup handlers
  setupCleanupHandlers(httpServer, handlers.cleanup);

  // Start listening and log server info
  httpServer.listen(port, () => {
    logServerStartup(handlers.serverType, port, endpoint);
  });

  return httpServer;
}
