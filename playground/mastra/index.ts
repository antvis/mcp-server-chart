import { Mastra } from "@mastra/core";
import { LibSQLStore } from "@mastra/libsql";
import { createChartAgent } from "./agents/chart-agent";

// 预先初始化图表 Agent，确保 Mastra 应用加载时即可使用动态图表工具
const chartAgent = await createChartAgent();

// Create and export mastra instance with telemetry config
export const mastra = new Mastra({
  telemetry: {
    enabled: false,
  },
  storage: new LibSQLStore({
    url: ":memory:", // 使用内存数据库存储对话历史
  }),
  agents: {
    chartAgent,
  },
});

export async function createMastraApp() {
  return mastra;
}
