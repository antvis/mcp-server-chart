import { describe, expect, it } from "vitest";
import { z } from "zod";
import * as Charts from "../../src/charts";
import { FlowDiagramSchema, MindMapSchema } from "../constant";

describe("validator", () => {
  it("should valid schema for mind-map chart", () => {
    const chartType = "mind-map";
    expect(() => {
      const schema = Charts[chartType].schema;
      z.object(schema).safeParse(MindMapSchema);
    }).toThrow("Cannot read properties of undefined (reading 'traits')");
  });

  it("should valid schema for flow diagram chart", () => {
    const chartType = "flow-diagram";
    expect(() => {
      const schema = Charts[chartType].schema;
      z.object(schema).safeParse(FlowDiagramSchema);
    }).toThrow("Cannot read properties of undefined (reading 'traits')");
  });
});
