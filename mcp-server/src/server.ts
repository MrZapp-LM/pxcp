import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { PixeraClient, type PixeraConfig } from './client.js';
import { registerGroup } from './registry.js';
import { registerCoreTools } from './tools/core.js';
import { ALL_GROUPS } from './tools/areas.js';
import type { ToolGroup } from './types.js';

export const SERVER_INSTRUCTIONS = `Controls an AV Stumpfl Pixera media server through its JSON-RPC API.
Pixera is object oriented: namespace tools (e.g. pixera_timelines) return numeric handles; object tools
(e.g. pixera_timelines_timeline, pixera_timelines_layer) take {action, handle, params}.
Typical flow: get a handle by name or index, then act on it. Use pixera_search_api to find which tool
and action exposes a feature, and pixera_connection to check or change the connection.`;

export function createServer(cfg: PixeraConfig, groups: ToolGroup[] = ALL_GROUPS) {
  const client = new PixeraClient(cfg);
  const server = new McpServer(
    { name: 'pixera-mcp', version: '0.1.0' },
    { instructions: SERVER_INSTRUCTIONS },
  );
  registerCoreTools(server, client);
  for (const g of groups) registerGroup(server, client, g);
  return { server, client };
}
