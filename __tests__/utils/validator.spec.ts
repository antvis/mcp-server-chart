import { describe, expect, it } from "vitest";
import { z } from "zod";
import * as Charts from "../../src/charts";
import { FlowDiagramSchema, MindMapSchema } from "../constant";

describe("validator", () => {
  it("should detect invalid mind-map chart data", () => {
    const chartType = "mind-map";
    const schema = Charts[chartType].schema;
    const result = z.object(schema).safeParse(MindMapSchema);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.message).toContain("Tree node names must be unique");
    }
  });

  it("should detect invalid flow diagram chart data", () => {
    const chartType = "flow-diagram";
    const schema = Charts[chartType].schema;
    const result = z.object(schema).safeParse(FlowDiagramSchema);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.message).toContain(
        "node names must be unique, edges must reference existing nodes, and edge pairs must be unique",
      );
    }
  });
});
