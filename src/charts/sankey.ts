import { z } from "zod";

import {
  BackgroundColorSchema,
  HeightSchema,
  PaletteSchema,
  TextureSchema,
  ThemeSchema,
  TitleSchema,
  WidthSchema,
} from "./base";

const data = z.object({
  source: z.string(),
  target: z.string(),
  value: z.number(),
});

const schema = z.object({
  data: z
    .tuple([data], data)
    .check(z.minLength(1))
    .describe(
      "Date for sankey chart, such as, [{ source: 'Landing Page', target: 'Product Page', value: 50000 }, { source: 'Product Page', target: 'Add to Cart', value: 35000 }, { source: 'Add to Cart', target: 'Checkout', value: 25000 }, { source: 'Checkout', target: 'Payment', value: 15000 }, { source: 'Payment', target: 'Purchase Completed', value: 8000 }].",
    ),
  nodeAlign: z
    .enum(["left", "right", "justify", "center"])
    .optional()
    .prefault("center")
    .describe(
      "Alignment of nodes in the sankey chart, such as, 'left', 'right', 'justify', or 'center'.",
    ),
  style: z
    .object({
      backgroundColor: BackgroundColorSchema,
      palette: PaletteSchema,
      texture: TextureSchema,
    })
    .optional()
    .describe("Custom style configuration for the chart."),
  theme: ThemeSchema,
  width: WidthSchema,
  height: HeightSchema,
  title: TitleSchema,
});

const tool = {
  name: "generate_sankey_chart",
  description:
    "Generate a sankey chart to visualize the flow of data between different stages or categories, such as, the user journey from landing on a page to completing a purchase.",
  inputSchema: schema,
};

export const sankey = {
  schema,
  tool,
};
