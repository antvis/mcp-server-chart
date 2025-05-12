import { z } from "zod";

// Define Zod schemas for base configuration properties
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
  name: z.string().min(1),
});

export const EdgeSchema = z.object({
  source: z.string(),
  target: z.string(),
  name: z.string().optional().default(""),
});
