import { z } from "zod";
import { MCPChartClient } from "./mcp-chart-client.js";

const mcpClient = new MCPChartClient(
  process.env.MCP_SSE_URL ||
    "https://mcp.api-inference.modelscope.net/95fad3671a484b/sse",
);

/**
 * 动态创建 MCP Chart 工具
 * 从远程 MCP Server 获取工具定义并转换为 Mastra 工具
 */
export async function createChartTools() {
  try {
    console.log("🔌 Connecting to MCP Server Chart...");
    const mcpTools = await mcpClient.listTools();
    console.log(`✅ Found ${mcpTools.length} chart tools from MCP Server`);

    // biome-ignore lint/suspicious/noExplicitAny: 工具配置需要灵活的类型
    const mastraTools: Record<string, any> = {};

    for (const mcpTool of mcpTools) {
      // 将 MCP inputSchema 转换为 Zod schema
      const zodSchema = convertMCPSchemaToZod(mcpTool.inputSchema);

      // 创建 Mastra 工具 - 使用完整配置对象
      const toolConfig = {
        id: mcpTool.name,
        description: mcpTool.description || "Chart generation tool",
        inputSchema: zodSchema,
        outputSchema: z.object({
          chart: z.string().describe("Chart specification in vis-chart format"),
          description: z.string().optional(),
        }),
        // biome-ignore lint/suspicious/noExplicitAny: executionContext 类型由 Mastra 运行时决定
        execute: async (executionContext: any) => {
          const input = executionContext.context as Record<string, unknown>;
          console.log(`🎨 Calling MCP tool: ${mcpTool.name}`, input);

          try {
            const result = await mcpClient.callTool(mcpTool.name, input);

            // 提取图表配置
            let chartSpec = null;
            if (result.result?._meta?.spec) {
              chartSpec = result.result._meta.spec;
            } else if (result.result?.content) {
              const textContent = result.result.content.find(
                (c: { type: string; text?: string }) => c.type === "text",
              );
              if (textContent?.text) {
                try {
                  chartSpec = JSON.parse(textContent.text);
                } catch {
                  chartSpec = { raw: textContent.text };
                }
              }
            }

            if (!chartSpec) {
              throw new Error("Failed to extract chart spec from MCP response");
            }

            // 格式化为 vis-chart Markdown
            const chartMarkdown = `\`\`\`vis-chart\n${JSON.stringify(chartSpec, null, 2)}\n\`\`\``;

            const textContent = result?.result?.content?.find(
              (c: { type: string; text?: string }) => c.type === "text",
            );

            return {
              url: textContent?.text || "",
              chart: chartMarkdown,
              description: result.result?._meta?.description || "图表已生成",
            };
          } catch (error) {
            console.error("❌ MCP tool call failed:", error);
            throw error;
          }
        },
      };

      // 直接使用工具配置对象
      mastraTools[mcpTool.name] = toolConfig;
    }

    return mastraTools;
  } catch (error) {
    console.error("❌ Failed to create chart tools:", error);
    throw error;
  }
}

/**
 * 将 MCP JSON Schema 转换为 Zod Schema
 */
// biome-ignore lint/suspicious/noExplicitAny: MCP schema 结构不确定，返回值需要兼容 Zod
function convertMCPSchemaToZod(schema: any): any {
  try {
    // 简化版本：直接返回通用 schema
    return z.any();
  } catch (e) {
    return z.any();
  }
}
