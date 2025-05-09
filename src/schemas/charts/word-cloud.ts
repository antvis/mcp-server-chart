import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import { BaseConfigSchema } from "../base";

// Word cloud data schema
const WordCloudChartDataSchema = z.object({
  text: z.string(),
  value: z.string(),
});

// Word cloud input schema
export const WordCloudChartInputSchema = z.object({
  data: z
    .array(WordCloudChartDataSchema)
    .describe(
      "Data for word cloud chart, such as, [{ value: '4.272', text: '形成' }].",
    ),
  width: BaseConfigSchema.width.optional(),
  height: BaseConfigSchema.height.optional(),
  title: BaseConfigSchema.title,
});

// Word cloud tool descriptor
export const WordCloudChartTool = {
  name: "generate_word_cloud_chart",
  description:
    "Generate a word cloud chart to show word frequency or weight through text size variation, such as, analyzing common words in social media, reviews, or feedback.",
  inputSchema: zodToJsonSchema(WordCloudChartInputSchema),
};
