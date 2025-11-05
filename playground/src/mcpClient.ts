import axios from "axios";

const MCP_SSE_URL = "/api/sse";
const MCP_MESSAGES_URL = "/api/messages";

export interface ChartData {
  time?: string;
  value: number;
  category?: string;
  group?: string;
  [key: string]: unknown;
}

export interface ChartConfig {
  type: string;
  data: ChartData[];
  title?: string;
  axisXTitle?: string;
  axisYTitle?: string;
  [key: string]: unknown;
}

/**
 * MCP SSE 客户端类
 */
export class MCPClient {
  private sessionId: string | null = null;
  private eventSource: EventSource | null = null;
  private connected = false;
  private messageCallbacks: Map<number, (data: unknown) => void> = new Map();

  /**
   * 连接到 MCP Server (SSE)
   */
  async connect(): Promise<void> {
    if (this.connected) {
      return;
    }

    return new Promise((resolve, reject) => {
      try {
        this.eventSource = new EventSource(MCP_SSE_URL);

        this.eventSource.addEventListener("endpoint", (event: MessageEvent) => {
          // event.data 可能是 JSON 字符串或普通字符串
          let endpointUri: string;
          try {
            const data = JSON.parse(event.data);
            endpointUri = data.uri || data;
          } catch {
            endpointUri = event.data;
          }

          // 从 endpoint URL 中提取 sessionId
          // 格式: /messages?sessionId=xxx
          const url = new URL(endpointUri, window.location.origin);
          this.sessionId = url.searchParams.get("sessionId");
          this.connected = true;
          console.log("SSE connected, sessionId:", this.sessionId);
          console.log("Endpoint URI:", endpointUri);
          resolve();
        });

        // 监听 message 事件来接收 MCP Server 的响应
        this.eventSource.addEventListener("message", (event: MessageEvent) => {
          try {
            const data = JSON.parse(event.data);
            console.log("收到 SSE 消息:", data);

            // 如果是 JSONRPC 响应,根据 id 调用对应的回调
            if (data.id !== undefined && this.messageCallbacks.has(data.id)) {
              const callback = this.messageCallbacks.get(data.id);
              if (callback) {
                callback(data);
                this.messageCallbacks.delete(data.id);
              }
            }
          } catch (e) {
            console.error("解析 SSE 消息失败:", e);
          }
        });

        this.eventSource.addEventListener("error", (error) => {
          console.error("SSE connection error:", error);
          this.connected = false;
          reject(new Error("SSE connection failed"));
        });

        setTimeout(() => {
          if (!this.connected) {
            this.eventSource?.close();
            reject(new Error("SSE connection timeout"));
          }
        }, 10000);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * 调用 MCP 工具
   */
  async callTool(
    name: string,
    args: Record<string, unknown>,
  ): Promise<unknown> {
    if (!this.connected || !this.sessionId) {
      await this.connect();
    }

    const requestId = Date.now();

    // 创建一个 Promise 来等待 SSE 返回结果
    const resultPromise = new Promise((resolve, reject) => {
      this.messageCallbacks.set(requestId, (data) => {
        resolve(data);
      });

      setTimeout(() => {
        if (this.messageCallbacks.has(requestId)) {
          this.messageCallbacks.delete(requestId);
          reject(new Error("Tool call timeout"));
        }
      }, 30000);
    });

    await axios.post(`${MCP_MESSAGES_URL}?sessionId=${this.sessionId}`, {
      jsonrpc: "2.0",
      method: "tools/call",
      params: {
        name,
        arguments: args,
      },
      id: requestId,
    });

    return resultPromise;
  }

  /**
   * 获取 MCP Server 的工具列表
   */
  async listTools(): Promise<unknown> {
    if (!this.connected || !this.sessionId) {
      await this.connect();
    }

    const requestId = Date.now();

    // 创建一个 Promise 来等待 SSE 返回结果
    const resultPromise = new Promise((resolve, reject) => {
      // 设置回调来接收结果
      this.messageCallbacks.set(requestId, (data) => {
        resolve(data);
      });

      setTimeout(() => {
        if (this.messageCallbacks.has(requestId)) {
          this.messageCallbacks.delete(requestId);
          reject(new Error("List tools timeout"));
        }
      }, 10000);
    });

    await axios.post(`${MCP_MESSAGES_URL}?sessionId=${this.sessionId}`, {
      jsonrpc: "2.0",
      method: "tools/list",
      params: {},
      id: requestId,
    });

    return resultPromise;
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
}

export const mcpClient = new MCPClient();
