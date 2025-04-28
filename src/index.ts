#!/usr/bin/env  node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import axios from "axios";
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from "@modelcontextprotocol/sdk/types.js";

const BaseConfig = {
  title: { type: "string", description: "Set the chart title." },
  axisXTitle: { type: "string", description: "Set the x-axis title of chart." },
  axisYTitle: { type: "string", description: "Set the y-axis title of chart." },
};

const Tools = [
  {
    name: "generate_line_chart",
    description:
      "Generate a line chart to show trends over time, such as the ratio of Apple computer sales to Apple's profits changed from 2000 to 2016.",
    inputSchema: {
      type: "object",
      properties: {
        data: {
          type: "array",
          items: {
            type: "objec",
            properties: {
              time: { type: "string" },
              value: { type: "number" },
            },
          },
          description:
            "Data for line chart, such as, [{time: string, value: string}].",
        },
        ...BaseConfig,
      },
      required: ["data"],
    },
  },
  {
    name: "generate_column_chart",
    description:
      "Generate a column chart, which are best for comparing categorical data, such as when values are close, column charts are preferable because our eyes are better at judging height than other visual elements like area or angles.",
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
              group: { type: "string" },
            },
            required: ["category", "value"],
          },
          description:
            "Data for column chart, such as, [{category: string; value: number; group?: string}].",
        },
        group: {
          type: "boolean",
          description:
            "Grouping is enabled. column charts require a 'group' field in the data.",
        },
        stack: {
          type: "boolean",
          description:
            "Stacking is enabled. column charts require a 'group' field in the data.",
        },
        ...BaseConfig,
      },
      required: ["data"],
    },
  },
  {
    name: "generate_pie_chart",
    description:
      "Generate a pie chart to show the proportion of parts, such as market share and budget allocation.",
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
            "Data for pie chart, (such as, [{category: string; value: number }])",
        },
        innerRadius: {
          type: "number",
          description:
            "Set the pie chart as a donut chart. Set the value to 0.6 to enable it.",
          default: 0,
        },
        ...BaseConfig,
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
              value: { type: "number" },
              group: { type: "string" },
            },
            required: ["time", "value"],
          },
          description:
            "Data for pie chart, such as, [{time: string; value: number }].",
        },
        stack: {
          type: "boolean",
          description:
            "Stacking is enabled. column charts require a 'group' field in the data.",
        },
        ...BaseConfig,
      },
      required: ["data"],
    },
  },
];

/**
 * Generate a chart URL using the provided configuration.
 * @returns {Promise<any>} The generated chart URL.
 * @throws {Error} If the chart generation fails.
 */
async function generateChartUrl(type: string, options: any): Promise<any> {
  const url = "https://antv-studio.alipay.com/api/gpt-vis";
  const response = await axios.post(url, {
    type,
    ...options,
  }, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response.data.resultObj;
}

class McpServerChart {
  private server: Server;

  constructor() {
    this.server = new Server(
      {
        name: "mcp-server-chart",
        version: "0.1.0",
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

  private setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: Tools,
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const ChartTypeMapping = {
        generate_line_chart: "line",
        generate_column_chart: "column",
        generate_area_chart: "area",
        generate_pie_chart: "pie",
      } as any;

      const type = ChartTypeMapping[request.params.name];

      if (!type) {
        throw new McpError(
          ErrorCode.MethodNotFound,
          `Unknown tool: ${request.params.name}.`
        );
      }

      try {
        const url = await generateChartUrl(type, request.params.arguments);

        return {
          content: [
            {
              type: "text",
              text: url,
            },
          ],
        };
      } catch (error: any) {
        if (error instanceof McpError) throw error;
        throw new McpError(
          ErrorCode.InternalError,
          `Failed to generate chart: ${error?.message || "Unknown error."}`
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
