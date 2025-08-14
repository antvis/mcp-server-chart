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

// Define recursive schema for hierarchical data.
// The recursive schema is not supported by gemini, and other clients, so we use a non-recursive schema which can represent a tree structure with a fixed depth.
// Ref: https://github.com/antvis/mcp-server-chart/issues/155
// Ref: https://github.com/antvis/mcp-server-chart/issues/132
const TreeNodeSchema = z.object({
  name: z.string(),
  value: z.number(),
  children: z
    .array(
      z.object({
        name: z.string(),
        value: z.number(),
        children: z
          .array(
            z.object({
              name: z.string(),
              value: z.number(),
            }),
          )
          .optional(),
      }),
    )
    .optional(),
});

// Treemap chart input schema
const schema = z.object({
  data: z
    .tuple([TreeNodeSchema], TreeNodeSchema)
    .check(z.minLength(1))
    .describe(
      "Data for treemap chart which is a hierarchical structure, such as, [{ name: 'Design', value: 70, children: [{ name: 'Tech', value: 20 }] }], and the maximum depth is 3.",
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

// Treemap chart tool descriptor
const tool = {
  name: "generate_treemap_chart",
  description:
    "Generate a treemap chart to display hierarchical data and can intuitively show comparisons between items at the same level, such as, show disk space usage with treemap.",
  inputSchema: schema,
};

export const treemap = {
  schema,
  tool,
};
