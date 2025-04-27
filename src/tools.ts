const baseConfig = {
  title: { type: "string", description: 'chart title'},
  axisXTitle: { type: "string",  description: 'x-axis title'},
  axisYTitle: { type: "string", description: 'y-axis title'},
};

export const tools = [
  {
    name: "generate_line_chart",
    description: "Generate a line chart to show trends over time, such as the ratio of Apple computer sales to Apple's profits changed  from 2000 to 2016",
    inputSchema: {
      type: "object",
      properties: {
        data: {
          type: "array",
          items: {
            type: "object",
            properties: {
              time: { type: "string" },
              value: { type: "string" },
            },
          },
          description: 'data for line chart, (such as, [{time: string, value: string}])'
        },
        ...baseConfig
      },
      required: ["data"],
    },
  },
  {
    name: "generate_column_chart",
    description: "Generate a column chart, which are best for comparing categorical data. such as when values are close, column charts are preferable because our eyes are better at judging height than other visual elements like area or angles.",
    inputSchema: {
      type: "object",
      properties: {
        data: {
          type: "array",
          items: {
            type: "object",
            properties: {
              category: { type: "string" },
              value: { type: "string" },
              group: { type: "string" },
            },
            required: ["category", "value"],
          },
          description: 'data for column chart, (such as, [{category: string; value: number; group?: string}])'
        },
        group: { type: "boolean", description: 'grouping is enabled. column charts require a "group" field in the data' },
        stack: { type: "boolean", description: 'stacking is enabled. column charts require a "group" field in the data'},
        ...baseConfig
      },
      required: ["data"],
    },
  },
  {
    name: "generate_pie_chart",
    description: "Generate a pie chart to show the proportion of parts, such as market share and budget allocation",
    inputSchema: {
      type: "object",
      properties: {
        data: {
          type: "array",
          items: {
            type: "object",
            properties: {
              category: { type: "string" },
              value: { type: "string" },
            },
            required: ["category", "value"],
          },
           description: 'data for pie chart, (such as, [{category: string; value: number }])'
        },
        innerRadius: { type: "number", description: 'Set the pie chart as a donut chart. Optional, number type. Set the value to 0.6 to enable it.' },
        ...baseConfig
      },
      required: ["data"],
    },
  },
  {
    name: "generate_area_chart",
    description: "Generate a area chart to show data trends under continuous independent variables and observe the overall data trend, such as displacement = velocity (average or instantaneous) × time: s = v × t. If the x-axis is time (t) and the y-axis is velocity (v) at each moment, an area chart allows you to observe the trend of velocity over time and infer the distance traveled by the area's size.",
    inputSchema: {
      type: "object",
      properties: {
        data: {
          type: "array",
          items: {
            type: "object",
            properties: {
              time: { type: "string" },
              value: { type: "string" },
            },
            required: ["time", "value"],
          },
          description: "data for pie chart, (such as, [{time: string; value: number }])"
        },
        stack: { type: "boolean", description: 'stacking is enabled. column charts require a "group" field in the data'},
        ...baseConfig
      },
      required: ["data"],
    },
  },

  // 添加更多图表类型定义...
];
