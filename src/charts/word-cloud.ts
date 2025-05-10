import { z } from "zod";
import { zodToJsonSchema } from "../utils";
import {
  WidthSchema,
  HeightSchema,
  TitleSchema,
} from "./base";

// Word cloud data schema
const data = z.object({
  text: z.string(),
  value: z.string(),
});

// Word cloud input schema
const schema = z.object({
  data: z
    .array(data)
    .describe(
      "Data for word cloud chart, such as, [{ value: '4.272', text: '形成' }].",
    ),
  width: WidthSchema.optional(),
  height: HeightSchema.optional(),
  title: TitleSchema,
});

// Word cloud tool descriptor
const tool = {
  name: "generate_word_cloud_chart",
  description:
    "Generate a word cloud chart to show word frequency or weight through text size variation, such as, analyzing common words in social media, reviews, or feedback.",
  inputSchema: zodToJsonSchema(schema),
};

export const wordCloud = {
  schema,
  tool,
};
