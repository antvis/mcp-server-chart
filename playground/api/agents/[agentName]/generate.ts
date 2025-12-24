import { Mastra } from "@mastra/core";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createChartAgent } from "../../../mastra/agents/chart-agent.js";

// 初始化 Mastra（使用缓存避免重复初始化）
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

  // 只允许 POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { agentName } = req.query;
    const { messages } = req.body;

    // 验证参数
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

    // 获取 agent
    const mastra = await getMastra();
    const agent = mastra.getAgent(agentName);

    if (!agent) {
      return res.status(404).json({
        error: `Agent '${agentName}' not found`,
      });
    }

    // 生成回复
    const result = await agent.generate({ messages });

    // 返回结果
    return res.status(200).json({
      text: result.text || "",
      model: agentName,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Generate error:", error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
}

// 配置
export const config = {
  maxDuration: 60, // 最大执行时间 60 秒
  memory: 1024, // 1GB 内存
};
