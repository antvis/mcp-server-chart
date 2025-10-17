#!/usr/bin/env node
import { Client } from "@modelcontextprotocol/sdk/client";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";

const url = process.argv[2] || "http://localhost:1122/sse";
const qps = Number(process.argv[3]) || 20;
const duration = Number(process.argv[4]) || 15;

console.log(`Transport stress test: ${url} @ ${qps} QPS for ${duration}s`);

(async () => {
  const transport = new SSEClientTransport(new URL(url), {});

  transport.onerror = (err) => {
    console.error("Transport error:", err);
  };

  // instantiate client that will use this transport
  const client = new Client(
    { name: "stress-client", version: "1.0.0" },
    { capabilities: {} },
  );

  // client.connect will start the transport internally
  try {
    await client.connect(transport);
  } catch (err) {
    console.error("Failed to connect client/transport:", err);
    process.exit(1);
  }

  // discover tools and pick a generate_* tool to call
  let tool: { name: string };
  try {
    const toolsResult = await client.listTools();
    const tools = toolsResult?.tools ?? [];
    // prefer a line generator
    tool =
      tools.find((t: { name: string }) => t.name === "generate_line_chart") ||
      tools[0];
    console.log("✅ success get tools:", tools);
  } catch (e) {
    console.error("Failed to list tools:", e?.message ? e.message : e);
  }
  // sent counters
  let sent = 0;
  let success = 0;
  let fail = 0;
  let inflight = 0;

  const intervalMs = 1000 / qps;
  let stopped = false;

  function sendOne() {
    if (stopped) return;
    sent++;
    inflight++;
    const seq = sent;

    const payload = {
      type: "line",
      data: [
        { time: "2020", value: 100 },
        { time: "2021", value: 120 },
        { time: "2022", value: 145 },
      ],
    };
    const callParams = {
      name: tool.name,
      arguments: payload,
    };

    client
      .callTool(callParams)
      .then((res) => {
        success++;
        if (seq % Math.max(1, Math.floor(qps / 2)) === 0) {
          console.log(`✅ success seq=${seq} totalSuccess=${success}`);
        }
        console.log(
          "   full response:",
          JSON.stringify(res).substring(0, 200) +
            (JSON.stringify(res).length > 200 ? "..." : "") +
            Date.now(),
        );
      })
      .catch((e) => {
        fail++;
        console.error(`❌ fail seq=${seq}:`, e?.message ? e.message : e);
      })
      .finally(() => {
        inflight--;
      });
  }

  const timer = setInterval(sendOne, intervalMs);

  setTimeout(() => {
    stopped = true;
    clearInterval(timer);
    const startWait = Date.now();
    const check = () => {
      if (inflight <= 0 || Date.now() - startWait > 10000) {
        console.log("\n--- Transport stress test complete ---");
        console.log(`Requested duration: ${duration}s`);
        console.log(`Total sent: ${sent}`);
        console.log(`Success: ${success}`);
        console.log(`Fail: ${fail}`);
        console.log(`Approx achieved RPS: ${(sent / duration).toFixed(2)}`);
        // close transport
        transport
          .close()
          .catch(() => {})
          .finally(() => process.exit(0));
        return;
      }
      setTimeout(check, 200);
    };
    check();
  }, duration * 1000);
})();
