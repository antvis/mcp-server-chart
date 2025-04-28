#!/usr/bin/env node
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
  width: {
    type: "number",
    description: "Set the width of chart, default is 600.",
  },
  height: {
    type: "number",
    description: "Set the height of chart, default is 400.",
  },
  title: { type: "string", description: "Set the title of chart." },
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
            type: "object",
            properties: {
              time: { type: "string" },
              value: { type: "number" },
            },
          },
          description:
            "Data for line chart, such as, [{ time: '2015', value: 23 }].",
        },
        stack: {
          type: "boolean",
          description:
            "Whether stacking is enabled. When enabled, line charts require a 'group' field in the data.",
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
            "Data for column chart, such as, [{ category: '北京' value: 825; group: '油车' }].",
        },
        group: {
          type: "boolean",
          description:
            "Whether grouping is enabled. When enabled, column charts require a 'group' field in the data.",
        },
        stack: {
          type: "boolean",
          description:
            "Whether stacking is enabled. When enabled, column charts require a 'group' field in the data.",
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
            "Data for pie chart, (such as, [{ category: '分类一', value: 27 }])",
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
            "Data for pie chart, such as, [{ time: '2018'; value: 99.9 }].",
        },
        stack: {
          type: "boolean",
          description:
            "Whether stacking is enabled. When enabled, area charts require a 'group' field in the data.",
        },
        ...BaseConfig,
      },
      required: ["data"],
    },
  },
  {
    name: "generate_bar_chart",
    description:
      "Generate a bar chart to show data for numerical comparisons among different categories, such as comparing categorical data and for horizontal comparisons.",
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
            "Data for bar chart, such as, [{ category: '分类一'; value: 10 }].",
        },
        group: {
          type: "boolean",
          description:
            "Whether grouping is enabled. When enabled, bar charts require a 'group' field in the data.",
        },
        stack: {
          type: "boolean",
          description:
            "Whether stacking is enabled. When enabled, bar charts require a 'group' field in the data.",
        },
        ...BaseConfig,
      },
      required: ["data"],
    },
  },
  {
    name: "generate_histogram_chart",
    description:
      "Generate a histogram chart to show the frequency of data points within a certain range. It can observe data distribution, such as normal and skewed distributions, and identify data concentration areas and extreme points.",
    inputSchema: {
      type: "object",
      properties: {
        data: {
          type: "array",
          description: "Data for bar chart, such as, [ 78, 88, 60, 100, 95 ].",
        },
        binNumber: {
          type: "number",
          description:
            "Number of intervals to define the number of intervals in a histogram.",
        },
        ...BaseConfig,
      },
      required: ["data"],
    },
  },
  {
    name: "generate_scatter_chart",
    description:
      "Generate a scatter chart to show the relationship between two variables, helps discover their relationship or trends, such as the strength of correlation, data distribution patterns, etc.",
    inputSchema: {
      type: "object",
      properties: {
        data: {
          type: "array",
          items: {
            type: "object",
            item: {
              properties: {
                x: { type: "number" },
                y: { type: "number" },
              },
              required: ["x", "y"],
            },
          },
          description: "Data for scatter chart, such as, [{ x: 10, y: 15 }].",
        },
        ...BaseConfig,
      },
      required: ["data"],
    },
  },
  {
    name: "generate_word_cloud_chart",
    description:
      "Generate a word cloud chart to show word frequency or weight through text size variation, such as, analyzing common words in social media, reviews, or feedback.",
    inputSchema: {
      type: "object",
      properties: {
        data: {
          type: "array",
          items: {
            type: "object",
            item: {
              properties: {
                value: { type: "string" },
                text: { type: "string" },
              },
              required: ["value", "text"],
            },
          },
          description:
            "Data for word cloud chart, such as, [{ value: '4.272', text: '形成' }].",
        },
        ...BaseConfig,
      },
      required: ["data"],
    },
  },
  {
    name: "generate_radar_chart",
    description:
      "Generate a radar chart to display multidimensional data (four dimensions or more), such as, evaluate Huawei and Apple phones in terms of five dimensions: ease of use, functionality, camera, benchmark scores, and battery life.",
    inputSchema: {
      type: "object",
      properties: {
        data: {
          type: "array",
          items: {
            type: "object",
            properties: {
              name: { type: "string" },
              value: { type: "number" },
              group: { type: "string" },
            },
            required: ["name", "value"],
          },
          description:
            "Data for radar chart, such as, [{ name: 'Design', value: 70 }].",
        },
        ...BaseConfig,
      },
      required: ["data"],
    },
  },
  {
    name: "generate_treemap_chart",
    description:
      "Generate a treemap chart to display hierarchical data and can intuitively show comparisons between items at the same level, such as, show disk space usage with treemap.",
    inputSchema: {
      type: "object",
      properties: {
        data: {
          type: "array",
          items: {
            type: "object",
            properties: {
              name: { type: "string" },
              value: { type: "number" },
              children: {
                type: "array",
                items: { $ref: "#" },
              },
            },
            required: ["name", "value"],
          },
          description:
            "Data for treemap chart, such as, [{ name: 'Design', value: 70, children: [{ name: 'Tech', value: 20 }] }].",
        },
        ...BaseConfig,
      },
      required: ["data"],
    },
  },
  {
    name: "generate_dual_axes_chart",
    description:
      "Generate a dual axes chart which is a combination chart that integrates two different chart types, typically combining a bar chart with a line chart to display both the trend and comparison of data, such as, the trend of sales and profit over time.",
    inputSchema: {
      type: "object",
      properties: {
        width: BaseConfig.width,
        height: BaseConfig.height,
        title: BaseConfig.title,
        axisXTitle: BaseConfig.axisXTitle,
        categories: {
          type: "array",
          items: {
            type: "string",
          },
          description:
            "Categories for dual axes chart, such as, ['2015', '2016', '2017'].",
        },
        series: {
          type: "array",
          items: {
            type: "object",
            properties: {
              name: { type: "string" },
              type: { type: "string" },
              axisYTitle: {
                type: "string",
                description: "Set the y-axis title of the chart series.",
              },
            },
          },
        },
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
  const response = await axios.post(
    url,
    {
      type,
      ...options,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  return response.data.resultObj;
}

class McpServerChart {
  private server: Server;

  constructor() {
    this.server = new Server(
      {
        name: "mcp-server-chart",
        version: "0.2.1",
      },
      {
        capabilities: {
          tools: {},
        },
      },
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
        generate_bar_chart: "bar",
        generate_histogram_chart: "histogram",
        generate_scatter_chart: "scatter",
        generate_word_cloud_chart: "word-cloud",
        generate_radar_chart: "radar",
        generate_treemap_chart: "treemap",
        generate_dual_axis_chart: "dual-axis",
      } as any;

      const type = ChartTypeMapping[request.params.name];

      if (!type) {
        throw new McpError(
          ErrorCode.MethodNotFound,
          `Unknown tool: ${request.params.name}.`,
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
          `Failed to generate chart: ${error?.message || "Unknown error."}`,
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
