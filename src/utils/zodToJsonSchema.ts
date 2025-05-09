import { zodToJsonSchema as zodToJsonSchemaOriginal } from "zod-to-json-schema";
import { z } from "zod";

// TODO: use zod v4 JSON to schema to replace zod-to-json-schema when v4 is stable
export const zodToJsonSchema = (schema: z.ZodType<any>) => {
  return zodToJsonSchemaOriginal(schema, {
    rejectedAdditionalProperties: undefined,
  });
};
