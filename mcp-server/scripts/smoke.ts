/**
 * End-to-end smoke test through a real MCP client against the mock Pixera.
 * Calls EVERY action of the selected areas with sample params, in both
 * framing modes, and checks the mock received exactly the right JSON-RPC call.
 *
 *   npx tsx scripts/smoke.ts                  # all areas + core tools + stdio launch
 *   npx tsx scripts/smoke.ts --area screens   # one area
 */
import path from 'node:path';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { createServer } from '../src/server.js';
import { normalizeParam, toolNameForScope, type ToolGroup } from '../src/types.js';
import type { PixeraMode } from '../src/client.js';
import { AREA_SCOPES } from '../src/tools/area-scopes.js';
import { startMock } from '../test/mock-pixera.js';
import { areasFromArgv, loadAreaGroups, ROOT } from './lib.js';

function sample(t: string): unknown {
  const opt = /^optional<(.+)>$/.exec(t);
  if (opt) return sample(opt[1]);
  if (t.endsWith('[]')) return [sample(t.slice(0, -2))];
  return ({ int: 1, uint: 2, uchar: 3, double: 0.5, float: 0.25, bool: true, string: 'x', handle: 123, timelineParamValue: 0.5 } as Record<string, unknown>)[t];
}

const failures: string[] = [];
const fail = (m: string) => failures.push(m);
const text = (r: any) => (r.content?.[0]?.text ?? '') as string;

async function run(groups: ToolGroup[], mode: PixeraMode, withCore: boolean) {
  const mock = await startMock(mode);
  const { server, client: px } = createServer({ host: '127.0.0.1', port: mock.port, mode, timeoutMs: 3000 }, groups);
  const [a, b] = InMemoryTransport.createLinkedPair();
  const client = new Client({ name: 'smoke', version: '0' });
  await Promise.all([server.connect(a), client.connect(b)]);
  let calls = 0;
  try {
    const listed = new Set((await client.listTools()).tools.map((t) => t.name));
    for (const g of groups) {
      const name = toolNameForScope(g.scope);
      if (!listed.has(name)) {
        fail(`[${mode}] tool ${name} not listed`);
        continue;
      }
      for (const [action, spec] of Object.entries(g.actions)) {
        const params = Object.fromEntries(
          Object.entries(spec.params ?? {}).map(([n, p]) => [n, sample(normalizeParam(p).type)]),
        );
        const args: Record<string, unknown> = { action, params };
        if (g.isClass) args.handle = 987654321;
        const before = mock.calls.length;
        const res: any = await client.callTool({ name, arguments: args });
        calls++;
        const got = mock.calls[before];
        if (res.isError) fail(`[${mode}] ${name}.${action}: ${text(res)}`);
        else if (!got || got.method !== `${g.scope}.${action}`) fail(`[${mode}] ${name}.${action}: mock got ${got?.method}`);
      }
    }
    // A wrong param type must be rejected client-side with a helpful message.
    const g = groups.find((x) => Object.values(x.actions).some((s) => Object.keys(s.params ?? {}).length));
    if (g) {
      const [action] = Object.entries(g.actions).find(([, s]) => Object.keys(s.params ?? {}).length)!;
      const res: any = await client.callTool({
        name: toolNameForScope(g.scope),
        arguments: { action, handle: 1, params: { __bogus__: 1 } },
      });
      if (!res.isError || !text(res).includes('Expected')) fail(`[${mode}] bad params were not rejected for ${g.scope}.${action}`);
    }
    if (withCore) {
      const t: any = await client.callTool({ name: 'pixera_connection', arguments: { action: 'test' } });
      if (t.isError || !text(t).includes('"apiRevision": 7')) fail(`[${mode}] pixera_connection test: ${text(t)}`);
      const s: any = await client.callTool({ name: 'pixera_search_api', arguments: { query: 'apply cue' } });
      if (s.isError || !text(s).includes('applyCue')) fail(`[${mode}] pixera_search_api: ${text(s).slice(0, 200)}`);
      const raw: any = await client.callTool({
        name: 'pixera_call',
        arguments: { method: 'Pixera.Timelines.getTimelineAtIndex', params: { index: 0 } },
      });
      if (raw.isError || text(raw).trim() !== '123456789') fail(`[${mode}] pixera_call: ${text(raw)}`);
      await client.callTool({
        name: 'pixera_utility',
        arguments: { action: 'setMonitoringEventMode', params: { mode: 'all' } },
      });
      await new Promise((r) => setTimeout(r, 50));
      const ev: any = await client.callTool({ name: 'pixera_connection', arguments: { action: 'take_events' } });
      if (!text(ev).includes('cueAdded')) fail(`[${mode}] monitoring event not buffered: ${text(ev)}`);
      calls += 5;
    }
  } finally {
    await client.close();
    px.disconnect();
    await mock.close();
  }
  return calls;
}

async function stdioLaunch() {
  const mock = await startMock('tcp');
  const transport = new StdioClientTransport({
    command: process.execPath,
    args: [path.join(ROOT, 'node_modules', 'tsx', 'dist', 'cli.mjs'), path.join(ROOT, 'src', 'index.ts')],
    env: { ...process.env, PIXERA_HOST: '127.0.0.1', PIXERA_PORT: String(mock.port), PIXERA_MODE: 'tcp' } as Record<string, string>,
    stderr: 'ignore',
  });
  const client = new Client({ name: 'smoke-stdio', version: '0' });
  try {
    await client.connect(transport);
    const tools = (await client.listTools()).tools;
    const r: any = await client.callTool({ name: 'pixera_utility', arguments: { action: 'getApiRevision' } });
    if (r.isError || text(r).trim() !== '7') fail(`[stdio] getApiRevision: ${text(r)}`);
    return tools.length;
  } finally {
    await client.close();
    await mock.close();
  }
}

const areas = areasFromArgv();
const groups: ToolGroup[] = [];
for (const a of areas) groups.push(...(await loadAreaGroups(a)).filter((g) => Object.keys(g.actions ?? {}).length));
const full = areas.length === Object.keys(AREA_SCOPES).length;
let total = 0;
for (const mode of ['tcp', 'dl'] as PixeraMode[]) total += await run(groups, mode, full);
let toolCount = -1;
if (full) toolCount = await stdioLaunch();

if (failures.length) {
  console.log(failures.slice(0, 200).join('\n'));
  console.log(`\nFAIL: ${failures.length} failure(s) out of ${total} calls (areas: ${areas.join(', ')})`);
  process.exit(1);
}
console.log(
  `OK: ${total} MCP tool calls succeeded in tcp + dl modes (areas: ${areas.join(', ')})` +
    (full ? `; stdio server lists ${toolCount} tools` : ''),
);
