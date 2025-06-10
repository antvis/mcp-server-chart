import { afterEach, describe, expect, it } from "vitest";
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
      "column",
      "fishbone-diagram",
      "flow-diagram",
      "histogram",
      "line",
      "mind-map",
      "network-graph",
      "pie",
      "radar",
      "scatter",
      "treemap",
      "word-cloud",
      "dual-axes",
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
