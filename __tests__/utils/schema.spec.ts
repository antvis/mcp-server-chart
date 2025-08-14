import { describe, expect, it } from "vitest";
import { z } from "zod";

describe("schema", () => {
  it("default vis request server", () => {
    expect(
      z.toJSONSchema(
        z.object({
          a: z.number(),
          b: z.string(),
          c: z.boolean(),
        }),
      ),
    ).toEqual({
      $schema: "https://json-schema.org/draft/2020-12/schema",
      additionalProperties: false,
      properties: {
        a: {
          type: "number",
        },
        b: {
          type: "string",
        },
        c: {
          type: "boolean",
        },
      },
      required: ["a", "b", "c"],
      type: "object",
    });
  });
});
