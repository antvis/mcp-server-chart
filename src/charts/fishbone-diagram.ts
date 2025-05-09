import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import { BaseConfigSchema } from "./base";

// Fishbone node schema
const FishboneNodeSchema: z.ZodType<any> = z.lazy(() =>
  z.object({
    name: z.string(),
    children: z.array(FishboneNodeSchema).optional(),
  }),
);

// Fishbone diagram input schema
const schema = z.object({
  data: FishboneNodeSchema.describe(
    "Data for fishbone diagram chart, such as, { name: 'main topic', children: [{ name: 'topic 1', children: [{ name: 'subtopic 1-1' }] }",
  ),
  width: BaseConfigSchema.width.optional(),
  height: BaseConfigSchema.height.optional(),
  title: BaseConfigSchema.title,
});

// Fishbone diagram tool descriptor
const tool = {
  name: "generate_fishbone_diagram",
  description:
    "Generate a fishbone diagram chart to uses a fish skeleton, like structure to display the causes or effects of a core problem, with the problem as the fish head and the causes/effects as the fish bones. It suits problems that can be split into multiple related factors.",
  inputSchema: zodToJsonSchema(schema),
};

export const fishboneDiagram = {
  schema,
  tool,
};
