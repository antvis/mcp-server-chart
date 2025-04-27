import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import axios from "axios";
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from "@modelcontextprotocol/sdk/types.js";

import { tools } from "./tools.js";

class McpServerChart {
  private server: Server;

  constructor() {
    this.server = new Server(
      {
        name: "mcp-server-chart",
        version: "1.0.0",
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();

    this.server.onerror = (error) => console.error("[MCP Error]", error);
    process.on("SIGINT", async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  private async generateChartUrl(config: any): Promise<any> {
    const url = "https://antv-studio-pre.alipay.com/api/gpt-vis";
    // 发送请求到ssr服务
    return await axios.post(url, config, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  private async handleGenerateChart(request: any) {
    const chartTypeMapping: { [key: string]: string } = {
      generate_line_chart: "line",
      generate_column_chart: "column",
      generate_area_chart: "area",
      generate_pie_chart: "pie",
      // 可以继续添加其他图表类型映射
      // ...
    };
    const action = request.params.name;
    const chartType = chartTypeMapping[action];

    if (!chartType) {
      throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${action}`);
    }

    try {
      const config: any = request.params.arguments;
      const newConfig = {
        type: chartType,
        ...config,
      };
      const response = await this.generateChartUrl(newConfig);
      const url = response.data.resultObj;
      return {
        content: [
          {
            type: "text",
            text: url,
          },
        ],
      };
    } catch (error: any) {
      if (error instanceof McpError) {
        throw error;
      }
      throw new McpError(
        ErrorCode.InternalError,
        `Failed to generate chart: ${error?.message || "Unknown error"}`
      );
    }
  }

  private setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: tools
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      switch (request.params.name) {
        case "generate_line_chart":
        case "generate_column_chart":
        case "generate_pie_chart":
        case "generate_area_chart":
          return await this.handleGenerateChart(request);
        default:
          throw new McpError(
            ErrorCode.MethodNotFound,
            `Unknown tool: ${request.params.name}`
          );
      }
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error("QuickChart MCP server running on stdio");
  }
}

const server = new McpServerChart();
server.run().catch(console.error);
