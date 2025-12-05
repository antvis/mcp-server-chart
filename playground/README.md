# MCP Chart Mastra App

基于 [Mastra 框架](https://mastra.ai) 构建的数据可视化智能对话应用，通过 MCP (Model Context Protocol) 连接到远程图表生成服务。

## ✨ 特性

- 🤖 **智能对话**: 使用 Mastra Agent 理解自然语言需求
- 📊 **丰富图表**: 支持 20+ 种图表类型（折线图、柱状图、饼图、地图等）
- 🔌 **MCP 集成**: 通过 SSE 连接到远程 MCP Server Chart 服务
- 🎨 **GPT-Vis 渲染**: 使用 AntV GPT-Vis 渲染交互式图表
- 🚀 **开箱即用**: 基于 Mastra 框架，快速启动和部署

## 🏗️ 架构

```
用户输入 → Mastra Agent → MCP Server Chart (SSE) → 图表配置 → GPT-Vis 渲染
```

## 📦 安装

```bash
# 安装依赖
npm install

# 或使用 pnpm
pnpm install
```

## ⚙️ 配置

创建 `.env` 文件并配置：

```env
# LLM API Key (选择一个)
OPENAI_API_KEY=your-openai-api-key
# 或
DEEPSEEK_API_KEY=your-deepseek-api-key

# MCP Server Chart SSE 地址
MCP_SSE_URL=https://mcp.api-inference.modelscope.net/d399f56c695348/sse
```

## 🚀 快速开始

### 启动开发服务器

```bash
npm run dev
```

然后访问 [http://localhost:4111](http://localhost:4111) 打开 Mastra Studio。

### 测试示例

在 Mastra Studio 中尝试以下对话：

```
生成一个折线图，显示2019-2023年的销售趋势
```

```
创建一个饼图，展示市场份额分布：A公司30%，B公司25%，C公司20%，其他25%
```

```
绘制一个柱状图，对比不同产品的销量：产品A: 120, 产品B: 98, 产品C: 156, 产品D: 87
```

## 📊 支持的图表类型

| 类别 | 图表类型 |
|------|---------|
| **基础统计** | 折线图、柱状图、条形图、饼图、面积图、散点图 |
| **分布分析** | 直方图、箱线图、小提琴图 |
| **关系网络** | 桑基图、网络图、流程图、思维导图、组织架构图、鱼骨图 |
| **层次结构** | 树图、韦恩图 |
| **地理可视化** | 地图、路径地图、点标注地图 |
| **其他** | 词云图、水波图、双轴图 |

## 🔧 开发

### 项目结构

```
playground/
├── src/
│   └── mastra/
│       ├── index.ts              # Mastra 应用入口
│       ├── agents/
│       │   └── chart-agent.ts    # 图表可视化 Agent
│       └── tools/
│           ├── mcp-chart-client.ts   # MCP SSE 客户端
│           └── chart-tools.ts        # 动态工具生成
├── package.json
├── tsconfig.json
└── .env
```

### 核心组件

#### 1. MCP Chart Client
连接到远程 MCP Server Chart 服务，通过 SSE 进行通信。

#### 2. Chart Tools
动态从 MCP Server 获取工具定义，转换为 Mastra 工具格式。

#### 3. Chart Agent
智能对话 Agent，理解用户需求并调用合适的图表工具。

### 自定义模型

在 `src/mastra/agents/chart-agent.ts` 中修改模型：

```typescript
model: 'openai/gpt-4o-mini',  // OpenAI
// 或
model: 'deepseek-chat',        // DeepSeek
// 或
model: 'google/gemini-2.5-pro', // Google Gemini
```

## 🌐 部署

### 构建生产版本

```bash
npm run build
```

### 启动生产服务器

```bash
npm start
```

## 🔗 相关资源

- [Mastra 文档](https://mastra.ai/docs)
- [MCP Server Chart](https://github.com/antvis/mcp-server-chart)
- [AntV GPT-Vis](https://github.com/antvis/GPT-Vis)
- [Model Context Protocol](https://modelcontextprotocol.io)

## 📄 License

MIT

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！
