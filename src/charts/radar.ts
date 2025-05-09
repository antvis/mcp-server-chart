import { z } from "zod";
import { zodToJsonSchema } from "../utils";
import { BaseConfigSchema } from "./base";

// Radar chart data schema
const data = z.object({
  name: z.string(),
  value: z.number(),
  group: z.string().optional(),
});

// Radar chart input schema
const schema = z.object({
  data: z
    .array(data)
    .describe(
      "Data for radar chart, such as, [{ name: 'Design', value: 70 }].",
    ),
  width: BaseConfigSchema.width.optional(),
  height: BaseConfigSchema.height.optional(),
  title: BaseConfigSchema.title,
});

// Radar chart tool descriptor
const tool = {
  name: "generate_radar_chart",
  description:
    "Generate a radar chart to display multidimensional data (four dimensions or more), such as, evaluate Huawei and Apple phones in terms of five dimensions: ease of use, functionality, camera, benchmark scores, and battery life.",
  inputSchema: zodToJsonSchema(schema),
};

export const radar = {
  schema,
  tool,
}; 