import { randomUUID } from "node:crypto";
import { writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
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
  // biome-ignore lint/suspicious/noExplicitAny: Required for chart type union compatibility
  options: Record<string, any>,
): Promise<string> {
  let vis: any = null;
  
  try {
    console.log(
      `[LOCAL] Generating ${type} chart with options:`,
      JSON.stringify(options, null, 2),
    );

    // Use local SSR rendering
    const renderOptions = {
      // biome-ignore lint/suspicious/noExplicitAny: Type casting needed for union type compatibility
      type: type as any,
      ...options,
    };

    // biome-ignore lint/suspicious/noExplicitAny: Type casting needed for render function compatibility
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
    // biome-ignore lint/suspicious/noExplicitAny: Error type from external library is unknown
  } catch (error: any) {
    throw new Error(
      `Failed to generate chart: ${error?.message || "Unknown error"}`,
    );
  } finally {
    // Clean up resources to prevent memory leaks and hanging processes
    if (vis && typeof vis.destroy === "function") {
      vis.destroy();
    }
  }
}
