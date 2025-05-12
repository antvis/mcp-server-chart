import { z } from "zod";

/**
 * valid empty object
 * @param schema
 * @returns
 */
export const nonEmptyObject = <T extends z.ZodSchema<object>>(schema: T) =>
  z.preprocess((arg: unknown) => {
    if (
      typeof arg !== "object" ||
      arg === null ||
      Object.keys(arg).length === 0
    ) {
      throw new Error("Data cannot be empty");
    }
    return arg;
  }, schema);
