# MCP Chart Demo - Conversational Chart Generation

This is a conversational chart generation demo application based on MCP Server Chart and @antv/gpt-vis.

## Features

- 🤖 Natural Language Interaction: Describe requirements through conversation
- 📊 Smart Chart Generation: Call MCP Server Chart service to generate chart configurations
- 🎨 Rich Visualizations: Render various types of charts using @antv/gpt-vis
- 💬 Smooth Chat Experience: Chat interface based on Ant Design X
- 🧠 LLM Intelligence: Support for Alibaba Cloud Bailian/OpenAI and other LLM platforms

## Quick Start

### 1. Install Dependencies

```bash
cd playground
npm install
```

### 2. Start MCP Server

Start MCP Server in SSE mode from the project root directory:

```bash
# In project root directory
npm run build
node build/index.js -t sse
```

The service will start at `http://localhost:1122/sse`.

### 3. Start Playground

Create a `.env` file based on `.env.example` and configure `VITE_OPENAI_API_KEY` and other settings:

```env
VITE_OPENAI_API_KEY=your_openai_api_key

``` 

Then, start the playground application:

```bash
cd playground
npm run dev
```

The application will start at `http://localhost:3000`.



## Development Guide

### Modify MCP Server Address

If the MCP Server is running at a different address, modify the proxy configuration in `vite.config.ts`:

```typescript
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://your-mcp-server:port',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});
```

### Customize Chart Styles

You can customize the chart theme by modifying the `ConfigProvider` in `App.tsx`:

```tsx
<ConfigProvider
  theme={{
    algorithm: theme.darkAlgorithm, // Use dark theme
  }}
>
  {/* ... */}
</ConfigProvider>
```


## License

MIT

