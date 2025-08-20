import express, {
  type Express,
  type Request,
  type Response,
  type NextFunction,
} from "express";
import type { Server as HttpServer } from "node:http";

/**
 * Interface for Express-based handlers
 */
export interface ExpressServerOptions {
  port: number;
  serverType: string;
  cleanup?: () => void;
}

/**
 * Sets up CORS, common endpoints and middleware
 */
function setupMiddleware(app: Express): void {
  // CORS middleware
  app.use((req, res, next) => {
    if (req.headers.origin) {
      try {
        const origin = new URL(req.headers.origin as string);
        res.setHeader("Access-Control-Allow-Origin", origin.origin);
        res.setHeader("Access-Control-Allow-Credentials", "true");
        res.setHeader(
          "Access-Control-Allow-Methods",
          "GET, POST, DELETE, OPTIONS",
        );
        res.setHeader("Access-Control-Allow-Headers", "*");
      } catch (error) {
        console.error("Error parsing origin:", error);
      }
    }
    next();
  });

  // Handle OPTIONS requests
  app.options("*", (req, res) => res.status(204).end());

  // Parse JSON requests
  app.use(express.json());

  // Health check endpoints
  app.get("/health", (req, res) => res.status(200).type("text/plain").send("OK"));
  app.get("/ping", (req, res) => res.status(200).send("pong"));
}

/**
 * Sets up signal handlers for graceful shutdown
 */
function setupCleanupHandlers(
  httpServer: HttpServer,
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
  endpoints: string[],
): void {
  const baseUrl = `http://localhost:${port}`;
  const healthUrl = `${baseUrl}/health`;
  const pingUrl = `${baseUrl}/ping`;

  console.log(
    `${serverType} running on: \x1b[32m\u001B[4m${baseUrl}\u001B[0m\x1b[0m`,
  );
  console.log("\nEndpoints:");
  for (const endpoint of endpoints) {
    console.log(`• ${endpoint}: \u001B[4m${baseUrl}${endpoint}\u001B[0m`);
  }
  console.log("\nTest endpoints:");
  console.log(`• Health check: \u001B[4m${healthUrl}\u001B[0m`);
  console.log(`• Ping test: \u001B[4m${pingUrl}\u001B[0m`);
}

/**
 * Creates a base Express server with common functionality
 */
export function createExpressServer(options: ExpressServerOptions): {
  app: Express;
  httpServer: HttpServer;
  start: (endpoints: string[]) => void;
} {
  const app = express();

  // Set up all middleware and endpoints
  setupMiddleware(app);

  // Error handling middleware
  app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(`Error in ${options.serverType} request handler:`, error);
    res.status(500).send("Internal Server Error");
  });

  // Create HTTP server
  const httpServer = app.listen(options.port);

  // Set up cleanup handlers
  setupCleanupHandlers(httpServer, options.cleanup);

  return {
    app,
    httpServer,
    start: (endpoints: string[]) => {
      logServerStartup(options.serverType, options.port, endpoints);
    },
  };
}
