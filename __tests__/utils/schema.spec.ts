import { afterEach, describe, expect, it } from "vitest";
import { z } from "zod";
import { zodToJsonSchema } from "../../src/utils/schema";

describe("schema", () => {
  it("default vis request server", () => {
    expect(
      zodToJsonSchema({
        a: z.number(),
        b: z.string(),
        c: z.boolean(),
      }),
    ).toEqual({
      $schema: "http://json-schema.org/draft-07/schema#",
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
