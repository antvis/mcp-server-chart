import { randomUUID } from "node:crypto";
import { writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import type { Chart } from "@antv/g2-ssr";
import type { Graph } from "@antv/g6-ssr";
import { render } from "../render/index.js";

/**
 * Generate a chart URL using local SSR rendering.
 * @param type The type of chart to generate
 * @param options Chart options
 * @returns {Promise<string>} The generated chart file URL.
 * @throws {Error} If the chart generation fails.
 */
export async function generateChartUrl(
  type: string,
  options: Record<string, unknown>,
): Promise<string> {
  let vis: Chart | Graph | null = null;

  try {
    console.log(
      `[LOCAL] Generating ${type} chart with options:`,
      JSON.stringify(options, null, 2),
    );

    // Use local SSR rendering
    const renderOptions = {
      // biome-ignore lint/suspicious/noExplicitAny: Type union complexity requires any for chart type
      type: type as any,
      ...options,
    };

    // biome-ignore lint/suspicious/noExplicitAny: Complex union type requires any for render options
    vis = await render(renderOptions as any);
    const buffer = vis.toBuffer();

    console.log(`[LOCAL] Generated buffer of size: ${buffer.length} bytes`);

    // Save to temporary file
    const fileName = `chart-${randomUUID()}.png`;
    const filePath = join(tmpdir(), fileName);
    await writeFile(filePath, buffer);

    console.log(`[LOCAL] Saved chart to: ${filePath}`);

    // Return file:// URL
    return `file://${filePath}`;
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    throw new Error(`Failed to generate chart: ${errorMessage}`);
  } finally {
    // Clean up resources to prevent memory leaks and hanging processes
    if (vis && typeof vis.destroy === "function") {
      vis.destroy();
    }
  }
}
