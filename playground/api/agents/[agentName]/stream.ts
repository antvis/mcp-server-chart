import { Mastra } from "@mastra/core";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createChartAgent } from "../../../mastra/agents/chart-agent.js";

let mastraInstance: Mastra | null = null;

async function getMastra() {
  if (!mastraInstance) {
    const chartAgent = await createChartAgent();
    mastraInstance = new Mastra({
      agents: {
        chartAgent,
      },
    });
  }
  return mastraInstance;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // 设置 CORS 头
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // 处理 OPTIONS 预检请求
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { agentName } = req.query;
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({
        error: "messages is required and must be an array",
      });
    }

    if (typeof agentName !== "string") {
      return res.status(400).json({
        error: "agentName is required",
      });
    }

    const mastra = await getMastra();
    const agent = mastra.getAgent(agentName);

    if (!agent) {
      return res.status(404).json({
        error: `Agent '${agentName}' not found`,
      });
    }

    // 设置流式响应头
    res.setHeader("Content-Type", "application/x-ndjson");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Accel-Buffering", "no");

    const streamResponse = await agent.stream({ messages });

    // 处理流响应 - 转换为通用格式
    try {
      // @ts-ignore - streamResponse 的类型可能不完全匹配
      for await (const chunk of streamResponse) {
        res.write(`${JSON.stringify(chunk)}\n`);
      }
    } catch (e) {
      // 备选方案：如果不支持异步迭代，尝试直接处理
      console.warn("Stream iteration failed, using fallback:", e);
      res.write(`${JSON.stringify({ text: String(streamResponse) })}\n`);
    }

    res.end();
  } catch (error) {
    console.error("Stream error:", error);
    if (!res.headersSent) {
      return res.status(500).json({
        error: error instanceof Error ? error.message : "Internal server error",
      });
    }
  }
}

export const config = {
  maxDuration: 60,
  memory: 1024,
};
