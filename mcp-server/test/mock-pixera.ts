/**
 * Mock Pixera JSON-RPC server for tests. It knows every method from
 * api/pixera_api.json, validates params strictly (names, types, handle for
 * class methods) and answers with a dummy value of the declared return type.
 *
 *   npx tsx test/mock-pixera.ts [port] [tcp|dl]     # standalone, default 1400 tcp
 */
import net from 'node:net';
import { pathToFileURL } from 'node:url';
import { loadApi, type ApiEntry } from '../src/apidef.js';
import { encodeMessage, FrameDecoder, type PixeraMode } from '../src/client.js';

export interface MockCall {
  method: string;
  params: Record<string, unknown>;
}

function checkType(v: unknown, t: string): boolean {
  const opt = /^optional<(.+)>$/.exec(t);
  if (opt) return v === undefined || checkType(v, opt[1]);
  if (t.endsWith('[]')) return Array.isArray(v) && v.every((x) => checkType(x, t.slice(0, -2)));
  switch (t) {
    case 'int':
    case 'uint':
    case 'handle':
    case 'uchar':
      return Number.isInteger(v);
    case 'double':
    case 'float':
      return typeof v === 'number';
    case 'bool':
    case 'boolean':
      return typeof v === 'boolean';
    case 'string':
      return typeof v === 'string';
    case 'timelineParamValue':
      return ['number', 'string', 'boolean'].includes(typeof v);
    default:
      return false;
  }
}

function dummy(t: string): unknown {
  if (t === 'null') return undefined;
  if (t.includes(',')) return t.split(',').map(dummy);
  if (t.endsWith('[]')) return [dummy(t.slice(0, -2)), dummy(t.slice(0, -2))];
  switch (t) {
    case 'int':
    case 'uint':
      return 7;
    case 'handle':
      return 123456789;
    case 'double':
    case 'float':
      return 1.5;
    case 'bool':
      return true;
    case 'string':
      return 'Abcd';
    case 'timelineParamValue':
      return 0.5;
    default:
      return { struct: t }; // ScreenPosValues etc.
  }
}

export function validateCall(e: ApiEntry | undefined, params: Record<string, unknown>): string | null {
  if (!e) return 'Unknown method';
  const rest = { ...params };
  if (e.isClass) {
    if (!Number.isInteger(rest.handle)) return 'Missing or invalid handle';
    delete rest.handle;
  }
  for (const p of e.params) {
    if (!checkType(rest[p.name], p.type)) return `Param '${p.name}' must be ${p.type}, got ${JSON.stringify(rest[p.name])}`;
    delete rest[p.name];
  }
  const extra = Object.keys(rest);
  return extra.length ? `Unknown params: ${extra.join(', ')}` : null;
}

export async function startMock(mode: PixeraMode, port = 0) {
  const methods = new Map(loadApi().map((e) => [e.method, e]));
  const calls: MockCall[] = [];
  const sockets = new Set<net.Socket>();
  const server = net.createServer((sock) => {
    sockets.add(sock);
    sock.on('close', () => sockets.delete(sock));
    const dec = new FrameDecoder();
    sock.on('data', (chunk) => {
      for (const text of dec.push(chunk)) {
        const msg = JSON.parse(text);
        const params = msg.params ?? {};
        calls.push({ method: msg.method, params });
        const e = methods.get(msg.method);
        const problem = validateCall(e, params);
        const reply: Record<string, unknown> = { jsonrpc: '2.0', id: msg.id };
        if (problem) reply.error = { code: -32602, message: `${msg.method}: ${problem}` };
        else {
          const r = dummy(e!.returns);
          if (r !== undefined) reply.result = r;
        }
        sock.write(encodeMessage(JSON.stringify(reply), mode));
        if (!problem && msg.method === 'Pixera.Utility.setMonitoringEventMode' && params.mode === 'all') {
          const ev = { jsonrpc: '2.0', id: -1, type: 'monEvent', name: 'cueAdded', entries: [{ handles: [42] }] };
          sock.write(encodeMessage(JSON.stringify(ev), mode));
        }
      }
    });
  });
  await new Promise<void>((r) => server.listen(port, '127.0.0.1', r));
  const addr = server.address() as net.AddressInfo;
  return {
    port: addr.port,
    calls,
    close: () =>
      new Promise<void>((r) => {
        for (const s of sockets) s.destroy();
        server.close(() => r());
      }),
  };
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const port = Number(process.argv[2] ?? 1400);
  const mode = (process.argv[3] ?? 'tcp') as PixeraMode;
  const m = await startMock(mode, port);
  console.error(`Mock Pixera listening on 127.0.0.1:${m.port} (${mode})`);
}
