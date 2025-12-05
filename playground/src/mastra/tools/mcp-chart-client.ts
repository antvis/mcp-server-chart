import EventSource from "eventsource";

interface MCPToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: string;
    properties: Record<string, unknown>;
    required?: string[];
  };
}

interface MCPResponse {
  result?: {
    tools?: MCPToolDefinition[];
    content?: Array<{ type: string; text: string }>;
    _meta?: {
      spec?: Record<string, unknown>;
      description?: string;
    };
  };
  error?: {
    code: number;
    message: string;
    data?: unknown;
  };
}

/**
 * MCP Server Chart Client
 * 连接到远程 MCP SSE 服务
 */
export class MCPChartClient {
  private sessionId: string | null = null;
  private eventSource: EventSource | null = null;
  private connected = false;
  private messageCallbacks: Map<string, (data: unknown) => void> = new Map();
  private sseUrl: string;
  private messagesUrl: string;
  /* 缓存工具列表 */
  private toolsCache: MCPToolDefinition[] | null = null;

  constructor(sseUrl: string) {
    this.sseUrl = sseUrl;
    this.messagesUrl = sseUrl.replace(/\/sse\/?$/, "/messages");
  }

  /**
   * 连接到 MCP Server
   */
  async connect(): Promise<void> {
    if (this.connected) return;

    return new Promise<void>((resolve, reject) => {
      const es = new EventSource(this.sseUrl);

      const onError = (err: Event) => {
        console.error("❌ SSE error event:", err);
        es.close();
        this.connected = false;
        reject(new Error("SSE connection failed"));
      };
      es.addEventListener("error", onError);

      // 监听所有事件类型以便调试
      es.onopen = () => {
        console.log("🔌 SSE connection opened");
      };

      // 监听 endpoint 事件，获取 session_id
      es.addEventListener("endpoint", async (event: MessageEvent) => {
        let endpointUri: string;
        try {
          const data = JSON.parse(event.data);
          endpointUri = data.uri ?? data;
        } catch {
          endpointUri = event.data;
        }
        const url = new URL(endpointUri, this.sseUrl);
        this.sessionId = url.searchParams.get("session_id");
        this.messagesUrl = url.toString();
        this.connected = true;
        console.log(
          "✅ MCP SSE connected, session_id:",
          this.sessionId,
          "endpoint:",
          this.messagesUrl,
        );

        try {
          // 完成 MCP 握手：initialize -> initialized
          await this.performHandshake();
          console.log("✅ MCP Server Chart 已就绪");
          resolve();
        } catch (err) {
          console.error("❌ MCP 握手失败:", err);
          reject(err);
        }
      });

      // 监听普通消息，缓存工具列表
      es.addEventListener("message", (event: MessageEvent) => {
        try {
          const data = JSON.parse(event.data);

          // 缓存初始工具列表
          const tools = data.result?.tools;
          if (tools?.length) {
            this.toolsCache = tools;
            console.log("[MCP] 工具列表已缓存，共", tools.length, "个");
          }

          // 处理异步回调
          if (data.id !== undefined) {
            const key = String(data.id);
            if (this.messageCallbacks.has(key)) {
              const callback = this.messageCallbacks.get(key);
              if (callback) {
                callback(data);
                this.messageCallbacks.delete(key);
              }
            }
          }
        } catch (e) {
          console.error("❌ Failed to parse SSE message:", e);
        }
      });

      // 兜底超时
      setTimeout(() => {
        if (!this.connected) {
          es.close();
          reject(new Error("SSE connection timeout"));
        }
      }, 20000);

      this.eventSource = es;
    });
  }

  /**
   * 获取工具列表
   * 优先使用 SSE 推送的缓存，缺失时主动请求 tools/list
   */
  async listTools(): Promise<MCPToolDefinition[]> {
    if (!this.connected) await this.connect();

    if (this.toolsCache?.length) {
      return this.toolsCache;
    }

    const requestId = Date.now();
    const requestKey = String(requestId);

    // 注册 SSE 回调
    const resultPromise = new Promise<MCPToolDefinition[]>(
      (resolve, reject) => {
        const timeout = setTimeout(() => {
          this.messageCallbacks.delete(requestKey);
          reject(new Error("tools/list timeout"));
        }, 30000);

        this.messageCallbacks.set(requestKey, (data) => {
          clearTimeout(timeout);
          const response = data as MCPResponse;

          if (response.error) {
            reject(new Error(`MCP error: ${response.error.message}`));
            return;
          }

          const tools = response.result?.tools;
          if (tools?.length) {
            this.toolsCache = tools;
            console.log("✅ 成功加载", tools.length, "个图表工具");
            resolve(tools);
          } else {
            reject(new Error("No tools in response"));
          }
        });
      },
    );

    const requestBody = {
      jsonrpc: "2.0",
      method: "tools/list",
      id: requestId,
    };

    const resp = await fetch(this.getMessagesUrl(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });

    // 同步响应
    if (resp.ok && resp.status !== 202) {
      this.messageCallbacks.delete(requestKey);
      const data = (await resp.json()) as MCPResponse;

      if (data.error) {
        throw new Error(`MCP error: ${data.error.message}`);
      }

      const tools = data.result?.tools;
      if (tools?.length) {
        this.toolsCache = tools;
        console.log("✅ 成功加载", tools.length, "个图表工具");
        return tools;
      }
      throw new Error("No tools in sync response");
    }

    // 异步响应，等待 SSE
    if (resp.status === 202) {
      return resultPromise;
    }

    this.messageCallbacks.delete(requestKey);
    throw new Error(`MCP request failed: ${resp.status} ${resp.statusText}`);
  }

  /**
   * 调用 MCP 工具
   */
  async callTool(
    name: string,
    args: Record<string, unknown>,
  ): Promise<MCPResponse> {
    if (!this.connected) await this.connect();

    const requestId = Date.now();
    const requestKey = String(requestId);

    const resultPromise = new Promise<MCPResponse>((resolve, reject) => {
      this.messageCallbacks.set(requestKey, (data) =>
        resolve(data as MCPResponse),
      );
      setTimeout(() => {
        if (this.messageCallbacks.has(requestKey)) {
          this.messageCallbacks.delete(requestKey);
          reject(new Error("Tool call timeout"));
        }
      }, 30000);
    });

    const requestBody = {
      jsonrpc: "2.0",
      method: "tools/call",
      params: { name, arguments: args },
      id: requestId,
    };
    // console.log('[MCP] tools/call 请求体:', JSON.stringify(requestBody));

    const resp = await fetch(this.getMessagesUrl(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });

    if (resp.status === 202) {
      return resultPromise;
    }
    if (resp.ok) return (await resp.json()) as MCPResponse;
    throw new Error(`MCP request failed: ${resp.status} ${resp.statusText}`);
  }

  /**
   * 断开连接
   */
  disconnect(): void {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
    this.connected = false;
    this.sessionId = null;
  }

  private getMessagesUrl(): string {
    const base =
      this.messagesUrl || this.sseUrl.replace(/\/sse\/?$/, "/messages");
    const url = new URL(base, this.sseUrl);
    if (this.sessionId && !url.searchParams.has("session_id")) {
      url.searchParams.set("session_id", this.sessionId);
    }
    return url.toString();
  }

  /**
   * 执行 MCP 握手流程：initialize -> initialized
   */
  private async performHandshake(): Promise<void> {
    const initId = Date.now();
    const initKey = String(initId);

    // 等待 initialize 响应
    const initPromise = new Promise<MCPResponse>((resolve, reject) => {
      const timeout = setTimeout(() => {
        this.messageCallbacks.delete(initKey);
        reject(new Error("Initialize timeout"));
      }, 10000);

      this.messageCallbacks.set(initKey, (data) => {
        clearTimeout(timeout);
        resolve(data as MCPResponse);
      });
    });

    // 发送 initialize
    const initResp = await fetch(this.getMessagesUrl(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        method: "initialize",
        params: {
          protocolVersion: "2024-11-05",
          capabilities: {},
          clientInfo: {
            name: "mcp-chart-mastra-client",
            version: "1.0.0",
          },
        },
        id: initId,
      }),
    });

    let initResult: MCPResponse;
    if (initResp.status === 202) {
      // 等待 SSE 推送
      initResult = await initPromise;
    } else if (initResp.ok) {
      initResult = await initResp.json();
      this.messageCallbacks.delete(initKey);
    } else {
      this.messageCallbacks.delete(initKey);
      throw new Error(`Initialize failed: ${initResp.status}`);
    }

    // 发送 initialized 通知（无需等待响应）
    await fetch(this.getMessagesUrl(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        method: "notifications/initialized",
      }),
    });
  }
}
