import { randomUUID } from "node:crypto";
import { writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import type { Chart } from "@antv/g2-ssr";
import type { Graph } from "@antv/g6-ssr";
import { render } from "../render/index.js";

// Performance monitoring interface
interface RenderMetrics {
  startTime: number;
  endTime?: number;
  duration?: number;
  bufferSize?: number;
  memoryUsage: {
    before: NodeJS.MemoryUsage;
    after: NodeJS.MemoryUsage;
  };
}

/**
 * Create a timeout promise that rejects after specified milliseconds
 */
function createTimeout(ms: number): Promise<never> {
  return new Promise((_, reject) => {
    setTimeout(
      () => reject(new Error(`Chart generation timed out after ${ms}ms`)),
      ms,
    );
  });
}

/**
 * Get memory usage snapshot for monitoring
 */
function getMemorySnapshot(): NodeJS.MemoryUsage {
  return process.memoryUsage();
}

/**
 * Generate a chart URL using local SSR rendering with performance monitoring.
 * @param type The type of chart to generate
 * @param options Chart options
 * @param timeout Optional timeout in milliseconds (default: 30000)
 * @returns {Promise<string>} The generated chart file URL.
 * @throws {Error} If the chart generation fails.
 */
export async function generateChartUrl(
  type: string,
  options: Record<string, unknown>,
  timeout = 30000,
): Promise<string> {
  let vis: Chart | Graph | null = null;
  const metrics: RenderMetrics = {
    startTime: Date.now(),
    memoryUsage: {
      before: getMemorySnapshot(),
      after: getMemorySnapshot(), // Will be updated later
    },
  };

  try {
    console.log(
      `[LOCAL] Generating ${type} chart with options:`,
      JSON.stringify(options, null, 2),
    );

    // Use local SSR rendering with timeout protection
    const renderOptions = {
      type,
      ...options,
    };

    // Race between chart generation and timeout
    // biome-ignore lint/suspicious/noExplicitAny: Render options have complex union types
    const renderPromise = render(renderOptions as any);
    const timeoutPromise = createTimeout(timeout);

    vis = await Promise.race([renderPromise, timeoutPromise]);

    // Generate buffer and measure performance
    const bufferStartTime = Date.now();
    const buffer = vis.toBuffer();
    const bufferEndTime = Date.now();

    metrics.bufferSize = buffer.length;
    console.log(
      `[LOCAL] Generated buffer of size: ${buffer.length} bytes in ${bufferEndTime - bufferStartTime}ms`,
    );

    // Save to temporary file
    const fileName = `chart-${randomUUID()}.png`;
    const filePath = join(tmpdir(), fileName);

    const writeStartTime = Date.now();
    await writeFile(filePath, buffer);
    const writeEndTime = Date.now();

    // Update metrics
    metrics.endTime = Date.now();
    metrics.duration = metrics.endTime - metrics.startTime;
    metrics.memoryUsage.after = getMemorySnapshot();

    // Log performance metrics
    console.log(`[LOCAL] Performance metrics for ${type} chart:`, {
      totalDuration: metrics.duration,
      bufferGeneration: bufferEndTime - bufferStartTime,
      fileWrite: writeEndTime - writeStartTime,
      bufferSize: metrics.bufferSize,
      memoryDelta: {
        rss: metrics.memoryUsage.after.rss - metrics.memoryUsage.before.rss,
        heapUsed:
          metrics.memoryUsage.after.heapUsed -
          metrics.memoryUsage.before.heapUsed,
        heapTotal:
          metrics.memoryUsage.after.heapTotal -
          metrics.memoryUsage.before.heapTotal,
      },
    });

    console.log(`[LOCAL] Saved chart to: ${filePath}`);

    // Return file:// URL
    return `file://${filePath}`;
  } catch (error: unknown) {
    // Log error with context
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    const duration = Date.now() - metrics.startTime;

    console.error(`[LOCAL] Chart generation failed after ${duration}ms:`, {
      type,
      error: errorMessage,
      options: JSON.stringify(options),
    });

    throw new Error(`Failed to generate ${type} chart: ${errorMessage}`);
  } finally {
    // Clean up resources to prevent memory leaks and hanging processes
    if (vis && typeof vis.destroy === "function") {
      try {
        vis.destroy();
        console.log(`[LOCAL] Successfully cleaned up ${type} chart resources`);
      } catch (cleanupError) {
        console.warn(
          `[LOCAL] Warning: Failed to cleanup ${type} chart resources:`,
          cleanupError,
        );
      }
    }

    // Force garbage collection if available (development/debugging)
    if (global.gc && process.env.NODE_ENV === "development") {
      global.gc();
      console.log("[LOCAL] Forced garbage collection");
    }
  }
}
