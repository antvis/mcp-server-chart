import OpenAI from "openai/index.mjs";
import type { MCPClient } from "./mcpClient";

// LLM 配置
const LLM_API_KEY = import.meta.env.VITE_OPENAI_API_KEY || "";
const LLM_BASE_URL =
  import.meta.env.VITE_OPENAI_BASE_URL ||
  "https://dashscope.aliyuncs.com/compatible-mode/v1";
const LLM_MODEL = import.meta.env.VITE_OPENAI_MODEL || "qwen-plus";

// 检测是否使用百炼平台
const IS_BAILIAN = LLM_BASE_URL.includes("dashscope.aliyuncs.com");

interface MCPTool {
  name: string;
  description?: string;
  inputSchema?: Record<string, unknown>;
}

interface OpenAITool {
  type: "function";
  function: {
    name: string;
    description: string;
    parameters: Record<string, unknown>;
  };
}

/**
 * 将 MCP 工具定义转换为 OpenAI function calling 格式
 */
function convertMCPToolToOpenAI(mcpTool: MCPTool): OpenAITool {
  return {
    type: "function" as const,
    function: {
      name: mcpTool.name,
      description: mcpTool.description || "",
      parameters: mcpTool.inputSchema || {
        type: "object",
        properties: {},
      },
    },
  };
}

/**
 * LLM 服务类
 */
export class LLMService {
  private client: OpenAI;
  private mcpClient: MCPClient;
  private conversationHistory: Array<{
    role: "system" | "user" | "assistant";
    content: string;
  }> = [];
  private mcpTools: OpenAITool[] = [];

  constructor(mcpClient: MCPClient) {
    this.mcpClient = mcpClient;

    // 初始化 OpenAI 兼容客户端
    this.client = new OpenAI({
      apiKey: LLM_API_KEY,
      baseURL: LLM_BASE_URL,
      dangerouslyAllowBrowser: true, // 允许在浏览器中使用
    });

    console.log(
      `🤖 LLM 服务初始化 - ${IS_BAILIAN ? "阿里云百炼" : "OpenAI"} (${LLM_MODEL})`,
    );

    // 系统提示 - 针对百炼平台优化
    const systemPrompt = IS_BAILIAN
      ? `你是通义千问,一个专业的数据可视化助手。你可以帮助用户生成各种类型的图表。

当用户描述他们的需求时,你需要:
1. 理解用户想要什么类型的图表
2. 从用户描述中提取数据,或者生成合理的示例数据
3. 调用相应的图表生成工具(generate_xxx_chart)
4. 用简洁友好的语言向用户说明生成的图表

可用的图表类型和使用场景:
- 折线图(line): 显示数据随时间的趋势变化
- 柱状图(column): 垂直比较不同类别的数值
- 饼图(pie): 显示各部分占总体的比例
- 条形图(bar): 横向比较不同类别的数值
- 散点图(scatter): 显示两个变量之间的相关性
- 面积图(area): 显示数据的累积趋势

请仔细分析用户需求,选择最合适的图表类型,并确保生成的数据格式正确。`
      : `你是一个专业的数据可视化助手。你可以帮助用户生成各种类型的图表。

当用户描述他们的需求时,你需要:
1. 理解用户想要什么类型的图表
2. 提取或生成合适的数据
3. 调用相应的图表生成工具
4. 以友好的方式向用户展示结果

可用的图表类型:
- 折线图(line): 显示趋势变化
- 柱状图(column): 比较不同类别
- 饼图(pie): 显示比例分布
- 条形图(bar): 横向比较
- 散点图(scatter): 显示相关性
- 面积图(area): 显示累积趋势

请根据用户需求选择合适的图表类型并生成数据。`;

    this.conversationHistory.push({
      role: "system",
      content: systemPrompt,
    });

    // 异步初始化工具列表
    this.initTools();
  }

  /**
   * 初始化工具列表(异步)
   */
  private async initTools(): Promise<void> {
    try {
      const result = await this.mcpClient.listTools();
      console.log("MCP Server 工具列表原始响应:", result);

      if (result?.result?.tools) {
        this.mcpTools = result.result.tools.map(convertMCPToolToOpenAI);
        console.log(
          `✅ 从 MCP Server 加载了 ${this.mcpTools.length} 个工具:`,
          this.mcpTools.map((t) => t.function.name),
        );
      } else {
        console.error("❌ 无法从 MCP Server 获取工具列表");
        throw new Error("无法获取 MCP Server 工具列表");
      }
    } catch (error) {
      console.error("❌ 获取 MCP 工具列表失败:", error);
      throw error;
    }
  }

  /**
   * 处理用户消息
   */
  async processMessage(userMessage: string): Promise<string> {
    try {
      // 确保工具列表已加载
      if (this.mcpTools.length === 0) {
        console.log("工具列表未就绪，等待初始化...");
        await this.initTools();
      }

      // 添加用户消息到历史
      this.conversationHistory.push({
        role: "user",
        content: userMessage,
      });

      // 调用 LLM
      const response = await this.client.chat.completions.create({
        model: LLM_MODEL,
        messages: this
          .conversationHistory as OpenAI.Chat.ChatCompletionMessageParam[],
        tools: this.mcpTools as OpenAI.Chat.ChatCompletionTool[],
        tool_choice: "auto",
      });

      const message = response.choices[0].message;

      // 如果 LLM 决定调用工具
      if (message.tool_calls && message.tool_calls.length > 0) {
        const toolCall = message.tool_calls[0];
        const toolName = toolCall.function.name;
        const toolArgs = JSON.parse(toolCall.function.arguments);

        console.log("LLM 决定调用工具:", toolName, toolArgs);

        // 调用 MCP Server 工具
        const mcpResult = await this.mcpClient.callTool(toolName, toolArgs);

        console.log("MCP Server 返回结果:", mcpResult);

        // 解析 MCP 返回的结果
        let chartSpec = null;
        if (mcpResult?.result) {
          const result = mcpResult.result;

          // 优先从 _meta.spec 中获取图表配置
          if (result._meta?.spec) {
            chartSpec = result._meta.spec;
            console.log("从 _meta.spec 提取图表配置:", chartSpec);
          }
          // 否则尝试从 content 中解析
          else if (result.content && Array.isArray(result.content)) {
            const textContent = result.content.find(
              (c: { type: string; text?: string }) => c.type === "text",
            );
            if (textContent?.text) {
              try {
                chartSpec = JSON.parse(textContent.text);
              } catch (e) {
                chartSpec = { raw: textContent.text };
              }
            }
          }
          // 最后使用整个 result
          else {
            chartSpec = result;
          }
        }

        if (!chartSpec) {
          console.error("无法提取图表配置,MCP 返回:", mcpResult);
          throw new Error("MCP Server 返回的数据格式不正确");
        }

        // 直接构造响应(不使用 tool role,因为百炼不支持)
        const chartMarkdown = `
\`\`\`vis-chart
${JSON.stringify(chartSpec, null, 2)}
\`\`\`
        `.trim();

        // 生成友好的回复文本
        const chartTypeName = this.getChartTypeName(toolCall.function.name);
        const friendlyResponse = `好的,我为您生成了一个${chartTypeName}。`;
        const fullResponse = `${friendlyResponse}\n\n${chartMarkdown}`;

        // 添加到历史
        this.conversationHistory.push({
          role: "assistant",
          content: fullResponse,
        });

        return fullResponse;
      }
      // LLM 直接回复,不调用工具
      const content = message.content || "抱歉,我无法理解您的需求。";

      this.conversationHistory.push({
        role: "assistant",
        content,
      });

      return content;
    } catch (error) {
      console.error("LLM 处理失败:", error);
      throw error;
    }
  }

  /**
   * 获取图表类型的中文名称
   */
  private getChartTypeName(toolName: string): string {
    const names: Record<string, string> = {
      generate_line_chart: "折线图",
      generate_column_chart: "柱状图",
      generate_pie_chart: "饼图",
      generate_scatter_chart: "散点图",
      generate_area_chart: "面积图",
      generate_bar_chart: "条形图",
      generate_radar_chart: "雷达图",
      generate_funnel_chart: "漏斗图",
      generate_word_cloud_chart: "词云图",
      generate_treemap_chart: "矩形树图",
      generate_sankey_chart: "桑基图",
      generate_histogram_chart: "直方图",
    };

    return names[toolName] || "图表";
  }

  /**
   * 重置对话历史
   */
  resetConversation(): void {
    this.conversationHistory = [this.conversationHistory[0]];
  }
}
