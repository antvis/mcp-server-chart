import axios from "axios";
import axiosRetry from "axios-retry";

// Configure axios with retry logic
axiosRetry(axios, {
  retries: 2,
  validateResponse: (response) => {
    // when status is 200 and success is true, pass
    // or else retry
    return response.status === 200 && response.data.success;
  },
});

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
  const url = "https://antv-studio.alipay.com/api/gpt-vis";

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

  return response.data.resultObj;
}
