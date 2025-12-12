import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { MCPChartClient } from "./mcp-chart-client";

const mcpClient = new MCPChartClient(
  process.env.MCP_SSE_URL ||
    "https://mcp.api-inference.modelscope.net/d399f56c695348/sse",
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

    const mastraTools: Record<string, ReturnType<typeof createTool>> = {};

    for (const mcpTool of mcpTools) {
      // 将 MCP inputSchema 转换为 Zod schema
      const zodSchema = convertMCPSchemaToZod(mcpTool.inputSchema);

      // 创建 Mastra 工具
      mastraTools[mcpTool.name] = createTool({
        id: mcpTool.name,
        description: mcpTool.description,
        inputSchema: zodSchema,
        outputSchema: z.object({
          chart: z.string().describe("Chart specification in vis-chart format"),
          description: z.string().optional(),
        }),
        execute: async (executionContext) => {
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
      });
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
function convertMCPSchemaToZod(schema: {
  type: string;
  properties: Record<string, unknown>;
  required?: string[];
}): z.ZodObject<z.ZodRawShape> {
  const shape: z.ZodRawShape = {};

  for (const [key, prop] of Object.entries(schema.properties)) {
    const propSchema = prop as {
      type?: string;
      description?: string;
      items?: { type: string };
      properties?: Record<string, unknown>;
    };

    let zodType: z.ZodTypeAny;

    switch (propSchema.type) {
      case "string":
        zodType = z.string();
        break;
      case "number":
        zodType = z.number();
        break;
      case "boolean":
        zodType = z.boolean();
        break;
      case "array":
        if (propSchema.items?.type === "object") {
          zodType = z.array(z.record(z.unknown()));
        } else {
          zodType = z.array(z.unknown());
        }
        break;
      case "object":
        if (propSchema.properties) {
          zodType = convertMCPSchemaToZod({
            type: "object",
            properties: propSchema.properties,
            required: [],
          });
        } else {
          zodType = z.record(z.unknown());
        }
        break;
      default:
        zodType = z.unknown();
    }

    if (propSchema.description) {
      zodType = zodType.describe(propSchema.description);
    }

    // 检查是否是必填字段
    if (!schema.required?.includes(key)) {
      zodType = zodType.optional();
    }

    shape[key] = zodType;
  }

  return z.object(shape);
}
