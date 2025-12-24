import { z } from "zod";
import { zodToJsonSchema } from "../utils";
import {
  BackgroundColorSchema,
  HeightSchema,
  PaletteSchema,
  TextureSchema,
  ThemeSchema,
  TitleSchema,
  WidthSchema,
} from "./base";

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
      "Data for word cloud chart, it should be an array of objects, each object contains a `text` field and a `value` field, such as, [{ value: 4.272, text: '形成' }].",
    )
    .nonempty({ message: "Word cloud chart data cannot be empty." }),
  style: z
    .object({
      backgroundColor: BackgroundColorSchema,
      palette: PaletteSchema,
      texture: TextureSchema,
    })
    .optional()
    .describe(
      "Style configuration for the chart with a JSON object, optional.",
    ),
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
  annotations: {
    title: "Generate Word Cloud Chart",
    destructiveHint: true,
  },
};

export const wordCloud = {
  schema,
  tool,
};
