import { z } from "zod";

import {
  MapHeightSchema,
  MapTitleSchema,
  MapWidthSchema,
  POIsSchema,
} from "./base";

const schema = z.object({
  title: MapTitleSchema,
  data: z
    .tuple(
      [
        z
          .object({ data: POIsSchema })
          .describe("The route and places along it."),
      ],
      z.object({ data: POIsSchema }).describe("The route and places along it."),
    )
    .check(z.minLength(1))
    .describe(
      'Routes, each group represents all POIs along a route. For example, [{ "data": ["西安钟楼", "西安大唐不夜城", "西安大雁塔"] }, { "data": ["西安曲江池公园", "西安回民街"] }]',
    ),
  width: MapWidthSchema,
  height: MapHeightSchema,
});

// https://modelcontextprotocol.io/specification/2025-03-26/server/tools#listing-tools
const tool = {
  name: "generate_path_map",
  description:
    "Generate a route map to display the user's planned route, such as travel guide routes.",
  inputSchema: schema,
};

export const pathMap = {
  schema,
  tool,
};
