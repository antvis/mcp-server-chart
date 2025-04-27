import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import axios from "axios";
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from "@modelcontextprotocol/sdk/types.js";

const baseConfig = {
  title: { type: "string", description: "chart title" },
  axisXTitle: { type: "string", description: "x-axis title" },
  axisYTitle: { type: "string", description: "y-axis title" },
};

const tools = [
  {
    name: "generate_line_chart",
    description:
      "Generate a line chart to show trends over time, such as the ratio of Apple computer sales to Apple's profits changed  from 2000 to 2016",
    inputSchema: {
      type: "object",
      properties: {
        data: {
          type: "array",
          items: {
            type: "object",
            properties: {
              time: { type: "string" },
              value: { type: "number" },
            },
          },
          description:
            "data for line chart, (such as, [{time: string, value: string}])",
        },
        ...baseConfig,
      },
      required: ["data"],
    },
  },
  {
    name: "generate_column_chart",
    description:
      "Generate a column chart, which are best for comparing categorical data. such as when values are close, column charts are preferable because our eyes are better at judging height than other visual elements like area or angles.",
    inputSchema: {
      type: "object",
      properties: {
        data: {
          type: "array",
          items: {
            type: "object",
            properties: {
              category: { type: "string" },
              value: { type: "number" },
              group: { type: "number" },
            },
            required: ["category", "value"],
          },
          description:
            "data for column chart, (such as, [{category: string; value: number; group?: string}])",
        },
        group: {
          type: "boolean",
          description:
            'grouping is enabled. column charts require a "group" field in the data',
        },
        stack: {
          type: "boolean",
          description:
            'stacking is enabled. column charts require a "group" field in the data',
        },
        ...baseConfig,
      },
      required: ["data"],
    },
  },
  {
    name: "generate_pie_chart",
    description:
      "Generate a pie chart to show the proportion of parts, such as market share and budget allocation",
    inputSchema: {
      type: "object",
      properties: {
        data: {
          type: "array",
          items: {
            type: "object",
            properties: {
              category: { type: "string" },
              value: { type: "number" },
            },
            required: ["category", "value"],
          },
          description:
            "data for pie chart, (such as, [{category: string; value: number }])",
        },
        innerRadius: {
          type: "number",
          description:
            "Set the pie chart as a donut chart. Optional, number type. Set the value to 0.6 to enable it.",
        },
        ...baseConfig,
      },
      required: ["data"],
    },
  },
  {
    name: "generate_area_chart",
    description:
      "Generate a area chart to show data trends under continuous independent variables and observe the overall data trend, such as displacement = velocity (average or instantaneous) × time: s = v × t. If the x-axis is time (t) and the y-axis is velocity (v) at each moment, an area chart allows you to observe the trend of velocity over time and infer the distance traveled by the area's size.",
    inputSchema: {
      type: "object",
      properties: {
        data: {
          type: "array",
          items: {
            type: "object",
            properties: {
              time: { type: "string" },
              value: { type: "string" },
            },
            required: ["time", "value"],
          },
          description:
            "data for pie chart, (such as, [{time: string; value: number }])",
        },
        stack: {
          type: "boolean",
          description:
            'stacking is enabled. column charts require a "group" field in the data',
        },
        ...baseConfig,
      },
      required: ["data"],
    },
  },

  // 添加更多图表类型定义...
];

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
      tools: tools,
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
    console.error("MCP SERVER CHART running on stdio");
  }
}

const server = new McpServerChart();
server.run().catch(console.error);
