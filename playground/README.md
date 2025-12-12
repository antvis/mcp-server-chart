# AntV 数据图表可视化

基于 Vite + React + Mastra + MCP Server Chart 的智能图表生成对话界面。

## 特性

- 🤖 **智能对话**：使用 Mastra Agent 理解自然语言需求
- 📊 **图表生成**：通过 MCP Server Chart 生成各种类型的可视化图表
- 🎨 **实时渲染**：使用 @antv/gpt-vis 在对话中实时展示图表
- 💬 **流畅交互**：现代化的聊天界面设计
- 🔄 **会话记忆**：支持多轮对话,记住上下文

## 快速开始

### 1. 安装依赖

\`\`\`bash
pnpm install
\`\`\`

### 2. 配置环境变量

复制 \`.env.example\` 到 \`.env\` 并配置 API Key。

### 3. 启动 Mastra 服务

\`\`\`bash
pnpm run dev:mastra
\`\`\`

### 4. 启动前端应用

\`\`\`bash
pnpm run dev
\`\`\`

访问 http://localhost:5173

## 使用说明

### 示例对话

- "生成折线图展示近5年趋势"
- "创建饼图展示市场份额分布"
- "画一个柱状图对比各季度销售额"
