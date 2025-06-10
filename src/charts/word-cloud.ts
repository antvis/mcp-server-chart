import { z } from "zod";
import { zodToJsonSchema } from "../utils";
import { HeightSchema, ThemeSchema, TitleSchema, WidthSchema } from "./base";

// Word cloud data schema
const data = z.object({
  text: z.string(),
  value: z.number(),
});

// Word cloud input schema
const schema = {
  data: z
    .array(data)
    .describe(
      "Data for word cloud chart, such as, [{ value: 4.272, text: '形成' }].",
    )
    .nonempty({ message: "Word cloud chart data cannot be empty." }),
  theme: ThemeSchema,
  width: WidthSchema,
  height: HeightSchema,
  title: TitleSchema,
};

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
