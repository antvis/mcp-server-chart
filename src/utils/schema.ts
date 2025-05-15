import type { z } from "zod";
import { zodToJsonSchema as zodToJsonSchemaOriginal } from "zod-to-json-schema";

// TODO: use zod v4 JSON to schema to replace zod-to-json-schema when v4 is stable
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const zodToJsonSchema = (schema: z.ZodType<any>) => {
  return zodToJsonSchemaOriginal(schema, {
    rejectedAdditionalProperties: undefined,
  });
};
