# MCP Server Chart  ![](https://badge.mcpx.dev?type=server 'MCP Server') [![npm Version](https://img.shields.io/npm/v/@antv/mcp-server-chart.svg)](https://www.npmjs.com/package/@antv/mcp-server-chart) [![smithery badge](https://smithery.ai/badge/@antvis/mcp-server-chart)](https://smithery.ai/server/@antvis/mcp-server-chart) [![npm License](https://img.shields.io/npm/l/@antv/mcp-server-chart.svg)](https://www.npmjs.com/package/@antv/mcp-server-chart)

A Model Context Protocol server for generating charts using [AntV](https://github.com/antvis/).

<a href="https://glama.ai/mcp/servers/@antvis/mcp-server-chart">
  <img width="380" height="200" src="https://glama.ai/mcp/servers/@antvis/mcp-server-chart/badge" />
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

To use with Claude Desktop, add the server config:


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


## 📄 License

MIT@[AntV](https://github.com/antvis).
