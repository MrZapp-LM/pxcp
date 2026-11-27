import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { PixeraClient } from '../client.js';
import { loadApi } from '../apidef.js';
import { errorResult, jsonResult } from '../registry.js';
import { toolNameForScope } from '../types.js';

/** Generic tools: connection management, API search, raw JSON-RPC call. */
export function registerCoreTools(server: McpServer, client: PixeraClient) {
  server.registerTool(
    'pixera_connection',
    {
      title: 'Pixera connection',
      description:
        'Inspect or change the connection to Pixera.\n' +
        '- status: current host/port/mode and whether connected\n' +
        '- test: connect and return the API revision (Pixera.Utility.getApiRevision)\n' +
        "- configure: set host/port/mode/timeoutMs. mode 'tcp' = Pixera API port type 'JSON/TCP', 'dl' = 'JSON/TCP (dl)'\n" +
        '- disconnect: close the socket (it reconnects on the next call)\n' +
        "- take_events: return and clear buffered monitoring events (only filled when Pixera.Utility.setMonitoringEventMode is 'all' or 'onlyDiscrete')",
      inputSchema: {
        action: z.enum(['status', 'test', 'configure', 'disconnect', 'take_events']),
        host: z.string().optional(),
        port: z.number().int().min(1).max(65535).optional(),
        mode: z.enum(['tcp', 'dl']).optional(),
        timeoutMs: z.number().int().min(100).optional(),
      },
    },
    async ({ action, host, port, mode, timeoutMs }) => {
      try {
        switch (action) {
          case 'status':
            return jsonResult(client.status());
          case 'test': {
            const revision = await client.call('Pixera.Utility.getApiRevision');
            return jsonResult({ ok: true, apiRevision: revision, ...client.status() });
          }
          case 'configure': {
            const patch = Object.fromEntries(
              Object.entries({ host, port, mode, timeoutMs }).filter(([, v]) => v !== undefined),
            );
            client.reconfigure(patch);
            return jsonResult(client.status());
          }
          case 'disconnect':
            client.disconnect();
            return jsonResult(client.status());
          case 'take_events':
            return jsonResult(client.takeEvents());
        }
      } catch (e: any) {
        return errorResult(e?.message ?? String(e));
      }
    },
  );

  server.registerTool(
    'pixera_search_api',
    {
      title: 'Search the Pixera API',
      description:
        'Find Pixera API functions by keyword (matches name, namespace/class and documentation). ' +
        'Returns the full signature, documentation and which MCP tool + action calls it. ' +
        "Use it when you don't know which tool exposes a feature.",
      inputSchema: {
        query: z.string().min(1).describe("Space separated keywords, e.g. 'cue apply' or 'Layer opacity'"),
        limit: z.number().int().min(1).max(100).optional().describe('Max results (default 20)'),
      },
    },
    async ({ query, limit }) => {
      const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
      const scored = loadApi()
        .map((e) => {
          const hay = `${e.method} ${e.documentation}`.toLowerCase();
          const nameHay = e.method.toLowerCase();
          let score = 0;
          for (const t of terms) {
            if (!hay.includes(t)) return null;
            score += nameHay.includes(t) ? 3 : 1;
          }
          if (e.name.toLowerCase() === terms.join('')) score += 10;
          return { e, score };
        })
        .filter((x): x is { e: ReturnType<typeof loadApi>[number]; score: number } => !!x)
        .sort((a, b) => b.score - a.score || a.e.method.length - b.e.method.length)
        .slice(0, limit ?? 20);
      return jsonResult(
        scored.map(({ e }) => ({
          method: e.method,
          signature: `${e.returns} ${e.name}(${e.params.map((p) => `${p.type} ${p.name}`).join(', ')})`,
          tool: toolNameForScope(e.scope),
          action: e.name,
          needsHandle: e.isClass,
          documentation: e.documentation || undefined,
        })),
      );
    },
  );

  server.registerTool(
    'pixera_call',
    {
      title: 'Raw Pixera JSON-RPC call',
      description:
        "Escape hatch: call any Pixera API method by its fully qualified name, e.g. 'Pixera.Timelines.getTimelines'. " +
        'For class methods include "handle" in params. Prefer the dedicated pixera_* tools, which validate parameters.',
      inputSchema: {
        method: z.string().regex(/^Pixera\./, "must start with 'Pixera.'"),
        params: z.record(z.any()).optional(),
      },
    },
    async ({ method, params }) => {
      try {
        return jsonResult(await client.call(method, params));
      } catch (e: any) {
        return errorResult(`${method} failed: ${e?.message ?? String(e)}`);
      }
    },
  );
}
