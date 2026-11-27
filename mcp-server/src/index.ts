#!/usr/bin/env node
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { configFromEnv } from './client.js';
import { createServer } from './server.js';
import { AREA_GROUPS } from './tools/areas.js';

async function main() {
  const cfg = configFromEnv();
  // Optional: PIXERA_AREAS=timelines,timeline-items to expose only some areas (saves client context).
  const wanted = (process.env.PIXERA_AREAS ?? '').split(',').map((s) => s.trim()).filter(Boolean);
  for (const a of wanted) if (!AREA_GROUPS[a]) throw new Error(`Unknown PIXERA_AREAS entry '${a}'. Known: ${Object.keys(AREA_GROUPS).join(', ')}`);
  const groups = wanted.length ? wanted.flatMap((a) => AREA_GROUPS[a]) : undefined;
  const { server, client } = createServer(cfg, groups);
  await server.connect(new StdioServerTransport());
  // stdout is the MCP channel - log to stderr only.
  console.error(`pixera-mcp ready (Pixera ${cfg.host}:${cfg.port}, mode ${cfg.mode})`);
  const shutdown = () => {
    client.disconnect();
    process.exit(0);
  };
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
