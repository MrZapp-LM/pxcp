# pixera-mcp

A local [MCP](https://modelcontextprotocol.io) server that controls an **AV Stumpfl Pixera** media server
through its native JSON-RPC API (revision 513). It runs anywhere Node.js 20+ runs: macOS, Windows and Linux.

## How the API is exposed

Pixera's API has 981 functions/methods. Exposing each as its own MCP tool would overwhelm most clients, so the
server groups them: **one MCP tool per Pixera namespace or class** (~50 tools). Each tool takes:

```jsonc
{ "action": "<Pixera function name>", "handle": 123456789 /* class tools only */, "params": { ... } }
```

The tool description lists every action with its signature, and parameters are validated before anything is sent.

| Tool | What it covers |
| --- | --- |
| `pixera_connection` | status / test / configure host-port-mode / disconnect / take_events (pushed monitoring events) |
| `pixera_search_api` | keyword search over the whole API: tells you which tool + action to use |
| `pixera_call` | raw JSON-RPC escape hatch: `{method: "Pixera.X.y", params}` |
| `pixera_timelines`, `pixera_timelines_timeline`, `pixera_timelines_layer`, `pixera_timelines_cue`, ... | one per namespace/class, e.g. `Pixera.Timelines.Layer` → `pixera_timelines_layer` |

Pixera is object oriented: namespace tools hand out numeric **handles**, and class tools act on them. For example:

1. `pixera_timelines` `{action: "getTimelineFromName", params: {name: "Show"}}` → `48151623`
2. `pixera_timelines_timeline` `{action: "play", handle: 48151623}`

## Pixera setup

In Pixera, open **Settings → API** and set an API access port to **JSON/TCP** (or **JSON/TCP (dl)**).
Restart Pixera after changing that tab.

## Install & build

```sh
cd mcp-server
npm install
npm run build        # -> dist/index.js (+ dist/pixera_api.json)
```

## Configuration (environment variables)

| Variable | Default | Meaning |
| --- | --- | --- |
| `PIXERA_HOST` | `127.0.0.1` | IP / hostname of the Pixera machine |
| `PIXERA_PORT` | `1400` | API port configured in Pixera |
| `PIXERA_MODE` | `tcp` | `tcp` = port type *JSON/TCP* (pxr1 header), `dl` = *JSON/TCP (dl)* (`0xPX` delimiter) |
| `PIXERA_TIMEOUT_MS` | `5000` | Per-request timeout |
| `PIXERA_AREAS` | *(all)* | Comma list to expose only some areas: `utility`, `timelines`, `timeline-items`, `resources`, `screens`, `system`. All tools together are ~30k tokens of tool descriptions; e.g. `timelines,timeline-items` keeps it to the show-control essentials. The connection/search/raw-call tools are always on. |

The connection can also be changed at runtime with the `pixera_connection` tool (`action: "configure"`).

## Register with an MCP client

**Claude Code** (from the repo root):

```sh
claude mcp add pixera -e PIXERA_HOST=192.168.1.20 -e PIXERA_PORT=1400 -- node /absolute/path/to/mcp-server/dist/index.js
```

**Claude Desktop**: edit `claude_desktop_config.json`
(macOS: `~/Library/Application Support/Claude/`, Windows: `%APPDATA%\Claude\`):

```json
{
  "mcpServers": {
    "pixera": {
      "command": "node",
      "args": ["/absolute/path/to/mcp-server/dist/index.js"],
      "env": { "PIXERA_HOST": "192.168.1.20", "PIXERA_PORT": "1400", "PIXERA_MODE": "tcp" }
    }
  }
}
```

On Windows use a path such as `"C:\\pixera\\mcp-server\\dist\\index.js"`.

## Development

```sh
npm run dev                          # run from source (tsx)
npm run mock -- 1400 tcp             # mock Pixera server that validates every call against pixera_api.json
npm run check                        # coverage: tool modules == pixera_api.json (names, types, order)
npm run smoke                        # calls EVERY action through a real MCP client against the mock (tcp + dl)
npm test                             # typecheck + check + smoke
npx tsx scripts/dump-scope.ts Pixera.Timelines.Layer   # print the exact API of a scope
```

Layout:

- `src/client.ts` — TCP JSON-RPC client (pxr1 header and 0xPX delimiter framing, id matching, monitoring events)
- `src/registry.ts` — turns a `ToolGroup` into one MCP tool with per-action validation
- `src/tools/*.ts` — the hand-written API definitions, one module per area (`area-scopes.ts` says which module owns which scope)
- `src/tools/core.ts` — connection, search and raw-call tools
- `test/mock-pixera.ts`, `scripts/*` — mock server, coverage checker, smoke test

When Pixera ships a new API revision, replace `../api/pixera_api.json` and run `npm run check`; it lists every
added, removed or changed function.
