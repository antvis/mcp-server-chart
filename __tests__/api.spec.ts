import { describe, expect, it } from "vitest";
import * as API from "../src/sdk";

describe("sdk API", () => {
  it("callTool", () => {
    expect(API.callTool).instanceOf(Function);
  });

  it("chart meta", () => {
    const { callTool, ...charts } = API;
    expect(Object.keys(charts)).toEqual([
      "area",
      "bar",
      "boxplot",
      "column",
      "dual-axes",
      "fishbone-diagram",
      "flow-diagram",
      "funnel",
      "histogram",
      "line",
      "liquid",
      "mind-map",
      "network-graph",
      "organization-chart",
      "pie",
      "radar",
      "sankey",
      "scatter",
      "treemap",
      "venn",
      "violin",
      "word-cloud",
    ]);
  });

  it("chart meta structure", () => {
    const { area } = API;
    expect(area.schema).toBeTypeOf("object");
    expect(area.tool).toBeTypeOf("object");
    expect(area.tool.name).toBeTypeOf("string");
    expect(area.tool.description).toBeTypeOf("string");
    expect(area.tool.inputSchema).toBeTypeOf("object");
  });
});
