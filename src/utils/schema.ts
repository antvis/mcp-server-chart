import { z } from "zod";

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const zodToJsonSchema = (schema: Record<string, z.ZodType<any>>) => {
  const result = z.toJSONSchema(z.object(schema), {
    target: "draft-7",
    // not set additionalProperties
    io: "input",
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    override: (ctx: any) => {
      if (ctx.zodSchema?.description) {
        ctx.jsonSchema.description = ctx.zodSchema.description;
      }

      if (typeof ctx?.zodSchema?.def?.defaultValue !== "undefined") {
        ctx.jsonSchema.default = ctx.zodSchema.def.defaultValue;
      }

      if (ctx?.jsonSchema?.type === "array" && ctx.jsonSchema.additionalItems) {
        // biome-ignore lint/performance/noDelete: <explanation>
        delete ctx.jsonSchema.additionalItems;
      }
    },
  });

  return result;
};
