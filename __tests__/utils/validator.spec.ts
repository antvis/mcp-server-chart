import { describe, expect, it } from "vitest";
import { z } from "zod";
import * as Charts from "../../src/charts";
import { validatedNodeEdgeDataSchema } from "../../src/utils/validator";
import { FlowDiagramSchema, MindMapSchema } from "../constant";

describe("validator", () => {
  it("should valid schema for mind-map chart", () => {
    const chartType = "mind-map";
    expect(() => {
      const schema = Charts[chartType].schema;
      z.object(schema).safeParse(MindMapSchema);
    }).toThrow("Invalid parameters: node's name '文字动画' should be unique.");
  });

  it("should valid schema for flow diagram chart", () => {
    const chartType = "flow-diagram";
    expect(() => {
      const schema = Charts[chartType].schema;
      z.object(schema).safeParse(FlowDiagramSchema);
    }).toThrow(
      "Invalid parameters: edge pair 'KnowledgeBase-Model' should be unique.",
    );
  });

  it("should distinguish edge pairs when node names contain hyphens", () => {
    expect(() =>
      validatedNodeEdgeDataSchema({
        nodes: [{ name: "a-b" }, { name: "a" }, { name: "b-c" }, { name: "c" }],
        edges: [
          { name: "edge 1", source: "a-b", target: "c" },
          { name: "edge 2", source: "a", target: "b-c" },
        ],
      }),
    ).not.toThrow();
  });
});
