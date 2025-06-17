import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import axios from "axios";
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

  const response = await axios.post(
    url,
    {
      type,
      ...options,
      source: "mcp-server-chart",
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
  const { success, errorMessage, resultObj } = response.data;

  if (!success) {
    throw new Error(errorMessage);
  }

  return resultObj;
}

export interface ResponseResult {
  metadata: unknown;
  /**
   * @docs https://modelcontextprotocol.io/specification/2025-03-26/server/tools#tool-result
   */
  content: CallToolResult["content"];
  isError?: CallToolResult["isError"];
}
export interface ResponseData {
  success: boolean;
  errorMessage?: string;
  resultObj: ResponseResult;
}

/**
 * Generate a map
 * @param tool - The tool name
 * @param input - The input
 * @returns
 */
export async function generateMap(
  tool: string,
  input: unknown,
): Promise<ResponseData["resultObj"]> {
  const url = getVisRequestServer();
  const params = {
    source: "mcp-server-chart",
    serviceId: getServiceIdentifier(),
    tool,
    input,
  };
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
    signal: AbortSignal.timeout(15e3),
  });
  const { success, errorMessage, resultObj } =
    (await response.json()) as ResponseData;

  if (!success) {
    throw new Error(errorMessage);
  }
  return resultObj;
}
