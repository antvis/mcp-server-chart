# Vercel 部署指南

## 快速部署步骤

### 1. 安装 Vercel CLI（如果还没有）
```bash
npm i -g vercel
```

### 2. 登录 Vercel
```bash
vercel login
```

### 3. 进入 playground 目录
```bash
cd playground
```

### 4. 首次部署（预览环境）
```bash
vercel
```

按照提示操作：
- **Set up and deploy?** Yes
- **Which scope?** 选择你的账号
- **Link to existing project?** No  
- **Project name?** mcp-server-chart（或你喜欢的名字）
- **In which directory?** `./` (当前目录)
- **Override settings?** No

### 5. 配置环境变量
```bash
# 为生产环境添加 API Key
vercel env add DEEPSEEK_API_KEY production
# 输入你的 DeepSeek API Key

# 为预览环境也添加
vercel env add DEEPSEEK_API_KEY preview
# 再次输入你的 API Key
```

### 6. 测试预览部署
从步骤 4 的输出中复制预览 URL，然后测试：
```bash
node ./scripts/test-vercel.mjs https://your-preview-url.vercel.app
```

### 7. 部署到生产环境
```bash
vercel --prod
```

### 8. 测试生产部署
```bash
node ./scripts/test-vercel.mjs https://your-production-url.vercel.app
```

## API 端点

部署成功后，你的 API 将提供以下端点：

- **健康检查**: `GET https://your-project.vercel.app/api/health`
- **生成图表**: `POST https://your-project.vercel.app/api/agents/chartAgent/generate`
- **流式生成**: `POST https://your-project.vercel.app/api/agents/chartAgent/stream`

## 示例请求

### 生成图表（非流式）
```bash
curl -X POST https://your-project.vercel.app/api/agents/chartAgent/generate \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {
        "role": "user",
        "content": "用柱状图展示2024年各季度销售数据：Q1:120万, Q2:150万, Q3:180万, Q4:200万"
      }
    ]
  }'
```

### 流式生成
```bash
curl -X POST https://your-project.vercel.app/api/agents/chartAgent/stream \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {
        "role": "user",
        "content": "生成饼图展示市场份额"
      }
    ]
  }'
```

## 环境变量

在 Vercel Dashboard 或通过 CLI 设置以下环境变量：

| 变量名 | 必需 | 说明 |
|--------|------|------|
| `DEEPSEEK_API_KEY` | ✅ | DeepSeek API 密钥 |
| `MCP_SSE_URL` | ❌ | MCP Server URL（可选，有默认值） |
| `NODE_ENV` | ❌ | Node 环境（自动设置为 production） |

## 监控和日志

### 查看部署列表
```bash
vercel ls
```

### 查看部署日志
```bash
vercel logs <deployment-url>
```

### 实时查看日志
```bash
vercel logs <deployment-url> --follow
```

## 故障排查

### 部署失败
1. 检查依赖是否正确安装
2. 确认 `vercel.json` 配置正确
3. 查看构建日志：`vercel logs`

### API 返回 500 错误
1. 检查环境变量是否已设置
2. 查看运行时日志
3. 确认 DeepSeek API Key 有效

### API 返回 404
1. 确认 API 路径正确
2. 检查 `vercel.json` 的路由配置
3. 确认文件结构：`api/agents/[agentName]/generate.ts`

## 更新部署

修改代码后，重新部署：

```bash
# 部署到预览环境
vercel

# 部署到生产环境
vercel --prod
```

## 删除部署

```bash
# 删除特定部署
vercel rm <deployment-url>

# 删除整个项目
vercel rm <project-name> --yes
```
