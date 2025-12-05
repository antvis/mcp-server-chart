/**
 * Mastra Chart App 使用示例
 *
 * 这个文件展示了如何在代码中直接使用 Chart Agent
 */

import { createMastraApp } from "./mastra";

async function main() {
  console.log("🎯 Starting Mastra Chart App Example...\n");

  // 初始化应用
  const mastra = await createMastraApp();

  // 获取 Chart Agent
  const agent = mastra.getAgent("chartAgent");

  // 示例 1: 生成折线图
  console.log("\n📈 Example 1: 生成折线图");
  console.log("─".repeat(50));

  const result1 = await agent.generate(
    "生成一个折线图，显示2019-2023年的销售趋势",
    {
      maxSteps: 5,
    },
  );

  console.log("Result:", result1.text);

  // 示例 2: 生成饼图
  console.log("\n🥧 Example 2: 生成饼图");
  console.log("─".repeat(50));

  const result2 = await agent.generate(
    "创建一个饼图，展示市场份额分布：A公司30%，B公司25%，C公司20%，其他25%",
    { maxSteps: 5 },
  );

  console.log("Result:", result2.text);

  // 示例 3: 生成柱状图
  console.log("\n📊 Example 3: 生成柱状图");
  console.log("─".repeat(50));

  const result3 = await agent.generate(
    "绘制一个柱状图，对比不同产品的销量：产品A: 120, 产品B: 98, 产品C: 156, 产品D: 87",
    { maxSteps: 5 },
  );

  console.log("Result:", result3.text);

  console.log("\n✅ All examples completed!");
}

// 运行示例
main().catch(console.error);
