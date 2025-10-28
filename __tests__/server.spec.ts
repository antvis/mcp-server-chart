import { spawn } from "node:child_process";
import { Client } from "@modelcontextprotocol/sdk/client";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import { describe, expect, it } from "vitest";

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
function spawnAsync(command: string, args: string[]): Promise<any> {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args);

    child.stdout.on("data", (data) => {
      resolve(child);
    });
  });
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
function killAsync(child: any): Promise<void> {
  return new Promise((resolve, reject) => {
    child.on("exit", () => {
      resolve();
    });
    child.kill();
  });
}

describe("MCP Server", () => {
  it("stdio", async () => {
    const transport = new StdioClientTransport({
      command: "ts-node",
      args: ["./src/index.ts"],
    });
    const client = new Client({
      name: "stdio-client",
      version: "1.0.0",
    });
    await client.connect(transport);
    const listTools = await client.listTools();

    expect(listTools.tools.length).toBe(25);

    const spec = {
      type: "line",
      data: [
        { time: "2020", value: 100 },
        { time: "2021", value: 120 },
        { time: "2022", value: 145 },
        { time: "2023", value: 150 },
        { time: "2024", value: 167 },
        { time: "2025", value: 163 },
      ],
    };

    const res = await client.callTool({
      name: "generate_line_chart",
      arguments: spec,
    });

    expect(res._meta).toEqual({
      description:
        "Charts spec configuration, you can use this config to generate the corresponding chart.",
      spec: spec,
    });

    // @ts-expect-error ignore
    expect(res.content[0].text.substring(0, 8)).toBe("https://");
  });

  it("sse", async () => {
    const child = await spawnAsync("ts-node", ["./src/index.ts", "-t", "sse"]);

    const url = "http://localhost:1122/sse";
    const transport = new SSEClientTransport(new URL(url), {});

    const client = new Client(
      { name: "stress-client", version: "1.0.0" },
      { capabilities: {} },
    );

    await client.connect(transport);
    const listTools = await client.listTools();

    expect(listTools.tools.length).toBe(25);

    const spec = {
      type: "line",
      data: [
        { time: "2020", value: 100 },
        { time: "2021", value: 120 },
        { time: "2022", value: 145 },
        { time: "2023", value: 150 },
        { time: "2024", value: 167 },
        { time: "2025", value: 163 },
      ],
    };

    const res = await client.callTool({
      name: "generate_line_chart",
      arguments: spec,
    });

    expect(res._meta).toEqual({
      description:
        "Charts spec configuration, you can use this config to generate the corresponding chart.",
      spec: spec,
    });

    // @ts-expect-error ignore
    expect(res.content[0].text.substring(0, 8)).toBe("https://");

    await killAsync(child);
  });

  it("streamable", async () => {
    const child = await spawnAsync("ts-node", [
      "./src/index.ts",
      "-t",
      "streamable",
    ]);

    const url = "http://localhost:1122/mcp";
    const transport = new StreamableHTTPClientTransport(new URL(url));
    const client = new Client({
      name: "streamable-http-client",
      version: "1.0.0",
    });
    await client.connect(transport);
    const listTools = await client.listTools();

    expect(listTools.tools.length).toBe(25);

    const spec = {
      type: "line",
      data: [
        { time: "2020", value: 100 },
        { time: "2021", value: 120 },
        { time: "2022", value: 145 },
        { time: "2023", value: 150 },
        { time: "2024", value: 167 },
        { time: "2025", value: 163 },
      ],
    };

    const res = await client.callTool({
      name: "generate_line_chart",
      arguments: spec,
    });

    expect(res._meta).toEqual({
      description:
        "Charts spec configuration, you can use this config to generate the corresponding chart.",
      spec: spec,
    });

    // @ts-expect-error ignore
    expect(res.content[0].text.substring(0, 8)).toBe("https://");

    await killAsync(child);
  });
});
