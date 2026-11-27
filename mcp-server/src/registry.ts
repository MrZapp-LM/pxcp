import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import type { PixeraClient } from './client.js';
import { paramsSchema, signature } from './pxtypes.js';
import { normalizeParam, toolNameForScope, type ToolGroup } from './types.js';

export function jsonResult(value: unknown): CallToolResult {
  return { content: [{ type: 'text', text: JSON.stringify(value ?? null, null, 2) }] };
}

export function errorResult(message: string): CallToolResult {
  return { content: [{ type: 'text', text: message }], isError: true };
}

/** Full tool description: group overview + one compact line per action. */
export function describeGroup(g: ToolGroup): string {
  const lines = Object.entries(g.actions).map(
    ([name, spec]) => `- ${signature(name, spec)}${spec.description ? ' — ' + spec.description : ''}`,
  );
  const how = g.isClass
    ? 'Call with {action, handle, params}. `handle` is the numeric object handle.'
    : 'Call with {action, params}.';
  return `${g.description}\n${how} Omit params when the action has none.\n\nActions:\n${lines.join('\n')}`;
}

/** Per-action parameter hints (only those with a desc) for error messages. */
function paramHelp(g: ToolGroup, action: string): string {
  const spec = g.actions[action];
  const ps = Object.entries(spec.params ?? {}).map(([n, p]) => {
    const { type, desc } = normalizeParam(p);
    return `  ${n}: ${type}${desc ? ' — ' + desc : ''}`;
  });
  return `${signature(action, spec)}${ps.length ? '\n' + ps.join('\n') : ''}`;
}

export function registerGroup(server: McpServer, client: PixeraClient, g: ToolGroup) {
  const actionNames = Object.keys(g.actions);
  if (actionNames.length === 0) return; // area not implemented yet
  const name = toolNameForScope(g.scope);
  const validators = new Map(actionNames.map((a) => [a, paramsSchema(g.actions[a])]));

  const shape = {
    action: z.enum(actionNames as [string, ...string[]]).describe('Which Pixera call to make'),
    ...(g.isClass
      ? { handle: z.number().int().describe(`Handle of the ${g.scope.split('.').pop()} object`) }
      : {}),
    params: z
      .record(z.any())
      .optional()
      .describe('Named parameters for the action, exactly as in its signature'),
  };

  server.registerTool(
    name,
    { title: g.title, description: describeGroup(g), inputSchema: shape },
    async (args: Record<string, any>): Promise<CallToolResult> => {
      const action: string = args.action;
      const parsed = validators.get(action)!.safeParse(args.params ?? {});
      if (!parsed.success) {
        const issues = parsed.error.issues.map((i) => `${i.path.join('.') || '(params)'}: ${i.message}`);
        return errorResult(`Invalid params for ${action}:\n${issues.join('\n')}\n\nExpected:\n${paramHelp(g, action)}`);
      }
      const params: Record<string, unknown> = g.isClass ? { handle: args.handle, ...parsed.data } : parsed.data;
      const method = `${g.scope}.${action}`;
      try {
        const result = await client.call(method, params);
        return jsonResult(result);
      } catch (e: any) {
        return errorResult(`${method} failed: ${e?.message ?? String(e)}`);
      }
    },
  );
}
