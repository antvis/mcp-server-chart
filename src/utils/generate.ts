import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { getServiceIdentifier, getVisRequestServer } from "./env";

/**
 * Generate a chart URL using the provided configuration.
 * @param type The type of chart to generate
 * @param options Chart options
 * @returns {Promise<string>} The generated chart URL.
 * @throws {Error} If the chart generation fails.
 */
export async function generateChartUrl(
  type: string,
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  options: Record<string, any>,
): Promise<string> {
  const url = getVisRequestServer();

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      type,
      ...options,
      source: "mcp-server-chart",
    }),
  });

  const { success, errorMessage, resultObj } = await response.json();

  if (!success) {
    throw new Error(errorMessage);
  }

  return resultObj;
}

type ResponseResult = {
  metadata: unknown;
  /**
   * @docs https://modelcontextprotocol.io/specification/2025-03-26/server/tools#tool-result
   */
  content: CallToolResult["content"];
  isError?: CallToolResult["isError"];
};

/**
 * Generate a map
 * @param tool - The tool name
 * @param input - The input
 * @returns
 */
export async function generateMap(
  tool: string,
  input: unknown,
): Promise<ResponseResult> {
  const url = getVisRequestServer();

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      source: "mcp-server-chart",
      serviceId: getServiceIdentifier(),
      tool,
      input,
    }),
  });

  const { success, errorMessage, resultObj } = await response.json();

  if (!success) {
    throw new Error(errorMessage);
  }
  return resultObj;
}
