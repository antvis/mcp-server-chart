import * as z from "zod";

export const zodToJsonSchema = (schema: Record<string, z.ZodType<any>>) => {
  return z.toJSONSchema(z.object(schema), {
    override: (ctx) => {
      if (ctx?.jsonSchema?.type === 'object') {
        ctx.jsonSchema.additionalProperties = undefined;
      }
    }
  });
};
