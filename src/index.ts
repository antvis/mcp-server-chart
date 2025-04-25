import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import axios from "axios";
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from "@modelcontextprotocol/sdk/types.js";


class GptVisChartServer {
  private server: Server;

  constructor() {
    this.server = new Server(
      {
        name: "gpt-vis-chart-server",
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

  private setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: "generate_line_chart",
          description: "Generate a line chart using gpt-vis",
          inputSchema: {
            type: "object",
            properties: {
              data: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    time:  {type: "string"},
                    value: {type: "string"}
                  },
                },
              },
              title: { type: "string" },
              axisXTitle: { type: "string" },
              axisYTitle: { type: "string" },
              width: { type: "number" },
              height: { type: "number" },
            },
            required: ["data"],
          },
        },
        {
          name: "generate_column_chart",
          description: "Generate a column chart using gpt-vis",
          inputSchema: {
            type: "object",
            properties: {
              data: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    category:  {type: "string"},
                    value: {type: "string"},
                    group: {type: "string"}
                  },
                  required: ["category", "value"],
                },
              },
              group: { type: "boolean" },
              stack: { type: "boolean"},
              title: { type: "string" },
              axisXTitle: { type: "string" },
              axisYTitle: { type: "string" },
              width: { type: "number" },
              height: { type: "number" },
            },
            required: ["data"],
          },
        },
      ],
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      switch (request.params.name) {
        case "generate_line_chart": {
          try {
            const config:any = request.params.arguments;
            const newConfig = {
              type: 'line',
              ...config,
            }
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
        case "generate_column_chart": {
          try {
            const config:any = request.params.arguments;
            const newConfig = {
              type: 'column',
              ...config,
            }
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

const server = new GptVisChartServer();
server.run().catch(console.error);
