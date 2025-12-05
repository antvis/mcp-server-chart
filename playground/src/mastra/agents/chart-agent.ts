import { Agent } from "@mastra/core/agent";
import { Memory } from "@mastra/memory";
import { createChartTools } from "../tools/chart-tools";

/**
 * 数据可视化智能对话 Agent
 * 使用 MCP Server Chart 生成各种类型的图表
 */
export async function createChartAgent() {
  // 动态加载图表工具
  const chartTools = await createChartTools();

  const chartAgent = new Agent({
    name: "Chart Visualization Agent",
    instructions: `你是一个专业的数据可视化助手,专门帮助用户创建各种类型的图表。

    示例问题：
    - 生成折线图展示近5年趋势
    - 创建饼图展示市场份额分布

    你的能力：
    - 理解用户的数据可视化需求
    - 分析用户提供的数据或生成示例数据
    - 选择最合适的图表类型（折线图、柱状图、饼图、散点图等）
    - 调用相应的图表生成工具
    - 解释图表含义和特点

    工作流程：
    1. 仔细理解用户的需求和数据
    2. 确定最适合的图表类型
    3. 提取或生成合适的数据格式
    4. 调用对应的图表工具生成可视化
    5. 向用户简要说明生成的图表

    可用的图表类型：
    - 折线图 (Line Chart): 展示趋势变化
    - 柱状图 (Column Chart): 垂直比较数据
    - 条形图 (Bar Chart): 横向比较数据
    - 饼图 (Pie Chart): 显示占比关系
    - 散点图 (Scatter Chart): 显示相关性
    - 面积图 (Area Chart): 显示累积趋势
    - 雷达图 (Radar Chart): 多维度对比
    - 漏斗图 (Funnel Chart): 转化流程
    - 词云图 (Word Cloud): 词频分析
    - 桑基图 (Sankey): 流向分析
    - 树图 (Treemap): 层级结构
    - 地图类图表: 地理位置数据

    若返回的信息中包含 url 字段，对话过程中请展示图表（输出的数据中需要写入 url 进行图片展示）。

    请根据用户需求智能选择合适的工具并生成图表。`,
    model: "deepseek/deepseek-chat",
    tools: chartTools,
    memory: new Memory({
      options: {
        lastMessages: 20, // 保留最近 20 条消息
      },
    }),
  });

  return chartAgent;
}
