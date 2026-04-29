import { z } from "zod";

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const zodToJsonSchema = (schema: Record<string, z.ZodType<any>>) => {
  return z.object(schema).toJSONSchema({
    io: "input",
    target: "draft-07",
  });
};
