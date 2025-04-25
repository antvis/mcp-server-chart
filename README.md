# antv-gpt-vis MCP Server

A Model Context Protocol server for generating charts using antv-gpt-vis

This is a TypeScript-based MCP server that provides chart generation capabilities. It allows you to create various types of charts through MCP tools.

## Overview

This server integrates with QuickChart.io's URL-based chart generation service to create chart images using Chart.js configurations. Users can generate various types of charts by providing data and styling parameters, which the server converts into chart URLs or downloadable images.

## Features

### Tools TODO
- `generate_chart` - Generate a chart URL using 
  - Supports multiple chart types: bar, line, pie, doughnut, radar, polarArea, scatter, bubble, radialGauge, speedometer
  - Customizable with labels, datasets, colors, and additional options
  - Returns a URL to the generated chart

- `download_chart` - Download a chart image to a local file
  - Takes chart configuration and output path as parameters
  - Saves the chart image to the specified location


## Supported Chart Types
- pie charts: For displaying proportional data
- radar charts: For showing multivariate data
- line charts: For showing trends over time
- bar charts: For comparing values across categories
- area chart: For visualizing cumulative trends over time
- column chart: For comparing values vertically between groups
- histogram charts: For displaying frequency distributions of numerical data
- scatter chart: For revealing correlations between two variables.
- word-cloud chart: For emphasizing keyword frequency by size.
- treemap chart: For hierarchical part-to-whole relationships.
- dual-axes chart: For comparing two datasets with separate scales.
- mind-map chart: For organizing ideas hierarchically.
- flow-diagram chart: For mapping processes or workflows stepwise.
- fishbone-diagram chart: For root-cause analysis of problems.
- network-graph chart: For visualizing connections between entities.

## Usage

### Chart Configuration
The server uses Chart.js configuration format. Here's a basic example:

```javascript
{
  "type": "line",
  "data": [
    { "time": 2018, "value": 91.9 },
    { "time": 2019, "value": 99.1 },
    { "time": 2020, "value": 101.6 },
    { "time": 2021, "value": 114.4 },
    { "time": 2022, "value": 121 }
  ],
  "axisXTitle" : "time",
   "axisYTitle" : "value"
}
```


## Development

Install dependencies:
```bash
npm install
```

Build the server:
```bash
npm run build
```

## Installation

### Installing

 ```bash
 npm install @antv/gpt-vis-mcp
 ```

### Installing via Smithery
 
 To install gpt-vis-mcp Server for Claude Desktop automatically via [Smithery](https://smithery.ai/server/@GongRzhe/Quickchart-MCP-Server):
 
 ```bash
  pnpx @modelcontextprotocol/inspector node /Users/mary/code/antv_project/GPT-Vis-MCP/build/index.js
 ```



## 📜 License

This project is licensed under the MIT License.
