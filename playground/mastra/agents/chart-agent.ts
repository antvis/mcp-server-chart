import { Agent } from "@mastra/core/agent";
import { Memory } from "@mastra/memory";
import { createChartTools } from "../tools/chart-tools.js";

/**
 * 数据可视化智能对话 Agent
 * 使用 MCP Server Chart 生成各种类型的图表
 */
export async function createChartAgent() {
  // 动态加载图表工具
  const chartTools = await createChartTools();

  const chartAgent = new Agent({
    name: "Chart Visualization Agent",
    instructions: `你是一个数据可视化助手。

=== 核心规则（必须严格执行）===

当你调用任何图表生成工具（如 generate_pie_chart, generate_line_chart, generate_column_chart 等）后：

1. 工具会返回一个对象，包含三个字段：
   - chart: 字符串，格式为 \`\`\`vis-chart\\n{JSON}\\n\`\`\`
   - url: 字符串，图片链接
   - description: 字符串，描述

2. **你必须直接输出 chart 字段的值**
   - chart 字段已经是完整的 Markdown 代码块
   - 直接复制粘贴 chart 的值到回复中
   - 不要修改、不要包装、不要解析

3. **完全忽略 url 字段**
   - 永远不要使用 ![](url) 语法
   - 永远不要提及图片链接

=== 输出模板 ===

用户: "生成一个XXX图表"

你的回复格式：
[简短介绍]

[直接粘贴 tool.result.chart 的值]

[简短分析]

=== 实际示例 ===

工具返回值:
{
  "chart": "\`\`\`vis-chart\\n{\\n  \\"type\\": \\"column\\",\\n  \\"data\\": [{\\"quarter\\": \\"Q1\\", \\"value\\": 125}]\\n}\\n\`\`\`",
  "url": "https://xxx.png",
  "description": "..."
}

✅ 正确回复:
我为您生成了季度销售额对比柱状图。

\`\`\`vis-chart
{
  "type": "column",
  "data": [{"quarter": "Q1", "value": 125}]
}
\`\`\`

从图表可以看出销售额逐季增长。

❌ 错误回复:
![图表](https://xxx.png)  ← 禁止！

    === 图表类型 ===
    - 折线图 (Line): 趋势变化
    - 柱状图 (Column): 垂直对比
    - 条形图 (Bar): 横向对比  
    - 饼图 (Pie): 占比关系
    - 散点图 (Scatter): 相关性
    - 面积图 (Area): 累积趋势
    - 雷达图 (Radar): 多维对比
    - 漏斗图 (Funnel): 转化流程
    - 词云图 (Word Cloud): 词频
    - 桑基图 (Sankey): 流向
    - 树图 (Treemap): 层级
    - 地图: 地理位置

=== 重要提醒 ===
输出工具返回的 chart 字段，不要用 url！
格式检查：必须包含 \`\`\`vis-chart 开头的代码块。`,
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
