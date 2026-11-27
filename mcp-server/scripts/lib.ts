import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { AREA_SCOPES } from '../src/tools/area-scopes.js';
import type { ToolGroup } from '../src/types.js';

export const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');

/** Parse `--area <name>` (repeatable / comma separated). Empty = all areas. */
export function areasFromArgv(argv = process.argv.slice(2)): string[] {
  const out: string[] = [];
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--area' && argv[i + 1]) out.push(...argv[++i].split(','));
    else if (argv[i].startsWith('--area=')) out.push(...argv[i].slice(7).split(','));
  }
  for (const a of out) {
    if (!AREA_SCOPES[a]) {
      console.error(`Unknown area '${a}'. Known: ${Object.keys(AREA_SCOPES).join(', ')}`);
      process.exit(2);
    }
  }
  return out.length ? out : Object.keys(AREA_SCOPES);
}

/** Import only the given area modules (so a broken file elsewhere does not interfere). */
export async function loadAreaGroups(area: string): Promise<ToolGroup[]> {
  const file = path.join(ROOT, AREA_SCOPES[area].file);
  const mod = await import(pathToFileURL(file).href);
  if (!Array.isArray(mod.groups)) throw new Error(`${AREA_SCOPES[area].file} must export 'groups: ToolGroup[]'`);
  return mod.groups as ToolGroup[];
}
