# MCP Server Chart  ![](https://badge.mcpx.dev?type=server 'MCP Server')  [![build](https://github.com/antvis/mcp-server-chart/actions/workflows/build.yml/badge.svg)](https://github.com/antvis/mcp-server-chart/actions/workflows/build.yml) [![npm Version](https://img.shields.io/npm/v/@antv/mcp-server-chart.svg)](https://www.npmjs.com/package/@antv/mcp-server-chart) [![smithery badge](https://smithery.ai/badge/@antvis/mcp-server-chart)](https://smithery.ai/server/@antvis/mcp-server-chart) [![npm License](https://img.shields.io/npm/l/@antv/mcp-server-chart.svg)](https://www.npmjs.com/package/@antv/mcp-server-chart)

A Model Context Protocol server for generating charts using [AntV](https://github.com/antvis/).

<a href="https://glama.ai/mcp/servers/@antvis/mcp-server-chart">
  <img width="380" src="https://glama.ai/mcp/servers/@antvis/mcp-server-chart/badge" />
</a>

This is a TypeScript-based MCP server that provides chart generation capabilities. It allows you to create various types of charts through MCP tools.


## ✨ Features

Now 15+ charts supported.

<img width="640" alt="mcp-server-chart preview" src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*ZlzKQKoJzsYAAAAAAAAAAAAAemJ7AQ/fmt.webp" />

- `generate_area_chart` - Generate a `area` chart, and return an image URL.
- `generate_bar_chart` - Generate a `bar` chart, and return an image URL.
- `generate_column_chart` - Generate a `column` chart, and return an image URL.
- `generate_dual_axes_chart` - Generate a `dual-axes` chart, and return an image URL.
- `generate_fishbone_diagram` - Generate a `fishbone-diagram` chart, and return an image URL.
- `generate_flow_diagram` - Generate a `flow-diagram` chart, and return an image URL.
- `generate_histogram_chart` - Generate a `histogram` chart, and return an image URL.
- `generate_line_chart` - Generate a `line` chart, and return an image URL.
- `generate_mind_map` - Generate a `mind-map` chart, and return an image URL.
- `generate_network_graph` - Generate a `network-graph` chart, and return an image URL.
- `generate_pie_chart` - Generate a `pie` chart, and return an image URL.
- `generate_radar_chart` - Generate a `radar` chart, and return an image URL.
- `generate_scatter_chart` - Generate a `scatter` chart, and return an image URL.
- `generate_treemap_chart` - Generate a `treemap` chart, and return an image URL.
- `generate_word_cloud_chart` - Generate a `word-cloud` chart, and return an image URL.


## 🤖 Usage

To use with `Desktop APP`, such as Claude, VSCode, Cline, Cherry Studio, and so on, add the  MCP server config below. On Mac system:

```json
{
  "mcpServers": {
    "mcp-server-chart": {
      "command": "npx",
      "args": [
        "-y",
        "@antv/mcp-server-chart"
      ]
    }
  }
}
```

On Window system:

```json
{
  "mcpServers": {
    "mcp-server-chart": {
      "command": "cmd",
      "args": [
        "/c",
        "npx",
        "-y",
        "@antv/mcp-server-chart"
      ]
    }
  }
}
```

### Run with SSE transport

install the package globally:

```bash
npm install -g @antv/mcp-server-chart
```

run the server:

```bash
mcp-server-chart --transport sse --port 1122 --endpoint /sse
```


Also, you can use it on [aliyun](https://bailian.console.aliyun.com/?tab=mcp#/mcp-market/detail/antv-visualization-chart), [modelscope](https://www.modelscope.cn/mcp/servers/@antvis/mcp-server-chart), [glama.ai](https://glama.ai/mcp/servers/@antvis/mcp-server-chart), [smithery.ai](https://smithery.ai/server/@antvis/mcp-server-chart) or others with HTTP, SSE Protocol.


## 📠 Private Deployment

`MCP Server Chart` provides a free chart generation service by default. For users with a need for private deployment, they can try using `VIS_REQUEST_SERVER` to customize their own chart generation service.

```json
{
  "mcpServers": {
    "mcp-server-chart": {
      "command": "npx",
      "args": [
        "-y",
        "@antv/mcp-server-chart"
      ],
      "env": {
        "VIS_REQUEST_SERVER": "<YOUR_VIS_REQUEST_SERVER>"
      }
    }
  }
}
```

You can use AntV's project [GPT-Vis-SSR](https://github.com/antvis/GPT-Vis/tree/main/bindings/gpt-vis-ssr) to deploy an HTTP service in a private environment, and then pass the URL address through env `VIS_REQUEST_SERVER`.


## 🔨 Development

Install dependencies:

```bash
npm install
```

Build the server:

```bash
npm run build
```

Start the MCP server:

```bash
npm run start
```

### CLI Options
```
MCP Server Chart CLI
Options:
  --transport, -t  Specify the transport protocol: "stdio" or "sse" (default: "stdio")
  --port, -p       Specify the port for SSE transport (default: 1122)
  --endpoint, -e   Specify the endpoint for SSE transport (default: "/sse")
  --help, -h       Show this help message
```

## 📄 License

MIT@[AntV](https://github.com/antvis).
