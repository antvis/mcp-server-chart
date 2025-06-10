import { afterEach, describe, expect, it } from "vitest";
import { getVisRequestServer } from "../../src/utils/env";

describe("env", () => {
  it("default vis request server", () => {
    expect(getVisRequestServer()).toBe(
      "https://antv-studio.alipay.com/api/gpt-vis",
    );
  });

  it("modify vis request server by env", () => {
    process.env.VIS_REQUEST_SERVER = "https://example.com/api/gpt-vis";
    expect(getVisRequestServer()).toBe("https://example.com/api/gpt-vis");
  });

  afterEach(() => {
    process.env.VIS_REQUEST_SERVER =
      "https://antv-studio.alipay.com/api/gpt-vis";
  });
});
