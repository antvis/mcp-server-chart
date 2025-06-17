import { z } from "zod";
import { zodToJsonSchema } from "../utils";
import {
  MapHeightSchema,
  MapTitleSchema,
  MapWidthSchema,
  POIsSchema,
} from "./base";

const schema = {
  title: MapTitleSchema,
  data: POIsSchema,
  markerPopup: z
    .object({
      type: z.string().default("image").describe('Must be "image".'),
      width: z.number().default(40).describe("Width of the photo."),
      height: z.number().default(40).describe("Height of the photo."),
      borderRadius: z
        .number()
        .default(8)
        .describe("Border radius of the photo."),
    })
    .optional()
    .describe(
      "Marker type, one is simple mode, which is just an icon and does not require `markerPopup` configuration; the other is image mode, which displays location photos and requires `markerPopup` configuration. Among them, `width`/`height`/`borderRadius` can be combined to realize rectangular photos and square photos. In addition, when `borderRadius` is half of the width and height, it can also be a circular photo.",
    ),
  width: MapWidthSchema,
  height: MapHeightSchema,
};

// https://modelcontextprotocol.io/specification/2025-03-26/server/tools#listing-tools
const tool = {
  name: "generate_pin_map",
  description:
    "Generate a point map to display the location and distribution of point data on the map, such as the location distribution of attractions, hospitals, supermarkets, etc.",
  inputSchema: zodToJsonSchema(schema),
};

export const pinMap = {
  schema,
  tool,
};
