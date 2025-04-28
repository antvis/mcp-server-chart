# MCP Server Chart  ![](https://badge.mcpx.dev?type=server 'MCP Server') [![npm Version](https://img.shields.io/npm/v/@antv/mcp-server-chart.svg)](https://www.npmjs.com/package/@antv/mcp-server-chart) [![npm License](https://img.shields.io/npm/l/@antv/mcp-server-chart.svg)](https://www.npmjs.com/package/@antv/mcp-server-chart)

A Model Context Protocol server for generating charts using [AntV](https://github.com/antvis/).

![MCP Server Chart](https://glama.ai/mcp/servers/@antvis/mcp-server-chart/badge)

This is a TypeScript-based MCP server that provides chart generation capabilities. It allows you to create various types of charts through MCP tools.


## ✨ Features

Now 4 charts supported.

- `generate_line_chart` - Generate a line chart URL.
- `generate_column_chart` - Generate a column chart URL.
- `generate_pie_chart` - Generate a pie chart URL.
- `generate_area_chart` - Generate a area chart URL.

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
