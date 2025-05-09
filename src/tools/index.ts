import { zodToJsonSchema } from "zod-to-json-schema";
import { SchemaMap } from "../schemas";

// Define tool descriptors
const ToolDescriptors = [
  {
    name: "generate_line_chart",
    description:
      "Generate a line chart to show trends over time, such as, the ratio of Apple computer sales to Apple's profits changed from 2000 to 2016.",
    schema: SchemaMap.line,
  },
  {
    name: "generate_column_chart",
    description:
      "Generate a column chart, which are best for comparing categorical data, such as, when values are close, column charts are preferable because our eyes are better at judging height than other visual elements like area or angles.",
    schema: SchemaMap.column,
  },
  {
    name: "generate_pie_chart",
    description:
      "Generate a pie chart to show the proportion of parts, such as, market share and budget allocation.",
    schema: SchemaMap.pie,
  },
  {
    name: "generate_area_chart",
    description:
      "Generate a area chart to show data trends under continuous independent variables and observe the overall data trend, such as, displacement = velocity (average or instantaneous) × time: s = v × t. If the x-axis is time (t) and the y-axis is velocity (v) at each moment, an area chart allows you to observe the trend of velocity over time and infer the distance traveled by the area's size.",
    schema: SchemaMap.area,
  },
  {
    name: "generate_bar_chart",
    description:
      "Generate a bar chart to show data for numerical comparisons among different categories, such as, comparing categorical data and for horizontal comparisons.",
    schema: SchemaMap.bar,
  },
  {
    name: "generate_histogram_chart",
    description:
      "Generate a histogram chart to show the frequency of data points within a certain range. It can observe data distribution, such as, normal and skewed distributions, and identify data concentration areas and extreme points.",
    schema: SchemaMap.histogram,
  },
  {
    name: "generate_scatter_chart",
    description:
      "Generate a scatter chart to show the relationship between two variables, helps discover their relationship or trends, such as, the strength of correlation, data distribution patterns.",
    schema: SchemaMap.scatter,
  },
  {
    name: "generate_word_cloud_chart",
    description:
      "Generate a word cloud chart to show word frequency or weight through text size variation, such as, analyzing common words in social media, reviews, or feedback.",
    schema: SchemaMap["word-cloud"],
  },
  {
    name: "generate_radar_chart",
    description:
      "Generate a radar chart to display multidimensional data (four dimensions or more), such as, evaluate Huawei and Apple phones in terms of five dimensions: ease of use, functionality, camera, benchmark scores, and battery life.",
    schema: SchemaMap.radar,
  },
  {
    name: "generate_treemap_chart",
    description:
      "Generate a treemap chart to display hierarchical data and can intuitively show comparisons between items at the same level, such as, show disk space usage with treemap.",
    schema: SchemaMap.treemap,
  },
  {
    name: "generate_dual_axes_chart",
    description:
      "Generate a dual axes chart which is a combination chart that integrates two different chart types, typically combining a bar chart with a line chart to display both the trend and comparison of data, such as, the trend of sales and profit over time.",
    schema: SchemaMap["dual-axes"],
  },
  {
    name: "generate_mind_map",
    description:
      "Generate a mind map chart to organizes and presents information in a hierarchical structure with branches radiating from a central topic, such as, a diagram showing the relationship between a main topic and its subtopics.",
    schema: SchemaMap["mind-map"],
  },
  {
    name: "generate_network_graph",
    description:
      "Generate a network graph chart to show relationships (edges) between entities (nodes), such as, relationships between people in social networks.",
    schema: SchemaMap["network-graph"],
  },
  {
    name: "generate_flow_diagram",
    description:
      "Generate a flow diagram chart to show the steps and decision points of a process or system, such as, scenarios requiring linear process presentation.",
    schema: SchemaMap["flow-diagram"],
  },
  {
    name: "generate_fishbone_diagram",
    description:
      "Generate a fishbone diagram chart to uses a fish skeleton, like structure to display the causes or effects of a core problem, with the problem as the fish head and the causes/effects as the fish bones. It suits problems that can be split into multiple related factors.",
    schema: SchemaMap["fishbone-diagram"],
  },
];

// Generate Tools array for MCP protocol
export const Tools = ToolDescriptors.map((tool) => ({
  name: tool.name,
  description: tool.description,
  inputSchema: zodToJsonSchema(tool.schema),
}));
