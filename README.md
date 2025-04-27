# MCP Server Chart 

A Model Context Protocol server for generating charts using antvis[https://github.com/antvis/mcp-server-chart].

This is a TypeScript-based MCP server that provides chart generation capabilities. It allows you to create various types of charts through MCP tools.


## Features

### Tools 
- `generate_line_chart` - Generate a line chart URL 
- `generate_column_chart` - Generate a column chart URL 
- `generate_pie_chart` - Generate a pie chart URL 
- `generate_area_chart` - Generate a area chart URL 


## Supported Chart
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


## Getting Started

Install dependencies:
```bash
npm install
```

Build the server:
```bash
npm run build
```




## 📜 License

This project is licensed under the MIT License.
