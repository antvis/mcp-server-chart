#!/usr/bin/env node
/*
  Test script for Vercel-deployed API
  Usage:
    node ./scripts/test-vercel.mjs https://your-project.vercel.app
*/

const baseUrl = process.argv[2] || process.env.VERCEL_URL;

if (!baseUrl) {
  console.error('❌ Error: Please provide Vercel URL');
  console.error('Usage: node ./scripts/test-vercel.mjs https://your-project.vercel.app');
  process.exit(1);
}

const log = (...args) => console.log('[vercel-test]', ...args);

async function testHealth() {
  const url = `${baseUrl}/api/health`;
  log(`GET ${url}`);
  const res = await fetch(url);
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(`Health check failed: ${res.status} ${JSON.stringify(json)}`);
  }
  log('✅ Health OK:', json);
}

async function testGenerate() {
  const url = `${baseUrl}/api/agents/chartAgent/generate`;
  log(`POST ${url}`);
  
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages: [
        { role: 'user', content: '用柱状图展示2024年各季度销售数据：Q1:120万, Q2:150万, Q3:180万, Q4:200万' },
      ],
    }),
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(`Generate failed: ${res.status} ${JSON.stringify(json)}`);
  }

  if (!json.text) {
    throw new Error('No text in response');
  }

  log('✅ Generate OK. Response length:', json.text.length);
  log('Response preview:', json.text.slice(0, 200) + '...');
}

async function testStream() {
  const url = `${baseUrl}/api/agents/chartAgent/stream`;
  log(`POST ${url}`);

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages: [
        { role: 'user', content: '生成饼图展示市场份额：苹果35%, 三星28%, 小米18%, 其他19%' },
      ],
    }),
  });

  if (!res.ok || !res.body) {
    const text = await res.text();
    throw new Error(`Stream failed: ${res.status} ${text}`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let collected = '';
  let chunkCount = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      if (!line.trim()) continue;
      try {
        const json = JSON.parse(line);
        chunkCount++;
        if (json.type === 'text-delta' && json.payload?.text) {
          collected += json.payload.text;
        }
      } catch (e) {
        // ignore parse errors
      }
    }
  }

  if (!collected) {
    throw new Error('Stream produced no content');
  }

  log('✅ Stream OK. Chunks received:', chunkCount);
  log('Content length:', collected.length);
  log('Content preview:', collected.slice(0, 200) + '...');
}

(async () => {
  const start = Date.now();
  try {
    log(`🚀 Testing Vercel deployment at ${baseUrl}`);
    log('');
    
    await testHealth();
    log('');
    
    await testGenerate();
    log('');
    
    await testStream();
    log('');
    
    const duration = ((Date.now() - start) / 1000).toFixed(2);
    log(`✅ All tests passed in ${duration}s`);
    process.exit(0);
  } catch (err) {
    console.error('');
    console.error('❌ Test failed:', err.message);
    process.exit(1);
  }
})();
