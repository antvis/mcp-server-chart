import { z } from "zod";

// Define Zod schemas for base configuration properties
export const ThemeSchema = z
  .enum(["default", "academy"])
  .optional()
  .default("default")
  .describe("Set the theme for the chart, optional, default is 'default'.");

export const TextureSchema = z
  .enum(["default", "rough"])
  .optional()
  .default("default")
  .describe(
    "Set the texture for the chart, optional, default is 'default'. 'rough' refers to hand-drawn style.",
  );

export const WidthSchema = z
  .number()
  .optional()
  .default(600)
  .describe("Set the width of chart, default is 600.");

export const HeightSchema = z
  .number()
  .optional()
  .default(400)
  .describe("Set the height of chart, default is 400.");

export const TitleSchema = z
  .string()
  .optional()
  .default("")
  .describe("Set the title of chart.");

export const AxisXTitleSchema = z
  .string()
  .optional()
  .default("")
  .describe("Set the x-axis title of chart.");

export const AxisYTitleSchema = z
  .string()
  .optional()
  .default("")
  .describe("Set the y-axis title of chart.");

export const NodeSchema = z.object({
  name: z.string(),
});

export const EdgeSchema = z.object({
  source: z.string(),
  target: z.string(),
  name: z.string().optional().default(""),
});

// --- The following are only available for Map charts ---

export const MapTitleSchema = z
  .string()
  .describe(
    "The map title should not exceed 16 characters. The content should be consistent with the information the map wants to convey and should be accurate, rich, creative, and attractive.",
  );

export const MapWidthSchema = z
  .number()
  .optional()
  .default(1600)
  .describe("Set the width of map, default is 1600.");

export const MapHeightSchema = z
  .number()
  .optional()
  .default(1000)
  .describe("Set the height of map, default is 1000.");

export const POIsSchema = z
  .array(z.string())
  .nonempty("At least one POI name is required.")
  .describe(
    'A list of keywords for the names of points of interest (POIs) in Chinese. These POIs usually contain a group of places with similar locations, so the names should be more descriptive, must adding attributives to indicate that they are different places in the same area, such as "北京市" is better than "北京", "杭州西湖" is better than "西湖"; in addition, if you can determine that a location may appear in multiple areas, you can be more specific, such as "杭州西湖的苏堤春晓" is better than "苏堤春晓". The tool will use these keywords to search for specific POIs and query their detailed data, such as latitude and longitude, location photos, etc. For example, ["西安钟楼", "西安大唐不夜城", "西安大雁塔"].',
  );
