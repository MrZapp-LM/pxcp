/**
 * Verifies that the hand-written tool modules match api/pixera_api.json exactly.
 *
 *   npx tsx scripts/check-coverage.ts                 # all areas + global ownership checks
 *   npx tsx scripts/check-coverage.ts --area screens  # one area only
 *
 * Exit code 0 = everything matches. Every problem is printed as one line.
 */
import { loadApi, type ApiEntry } from '../src/apidef.js';
import { isKnownType } from '../src/pxtypes.js';
import { normalizeParam, toolNameForScope, type ToolGroup } from '../src/types.js';
import { AREA_SCOPES } from '../src/tools/area-scopes.js';
import { areasFromArgv, loadAreaGroups } from './lib.js';

const api = loadApi();
const byScope = new Map<string, ApiEntry[]>();
for (const e of api) {
  if (!byScope.has(e.scope)) byScope.set(e.scope, []);
  byScope.get(e.scope)!.push(e);
}

const errors: string[] = [];
const err = (where: string, msg: string) => errors.push(`${where}: ${msg}`);

function checkGroup(area: string, g: ToolGroup) {
  const where = `[${area}] ${g.scope}`;
  const expected = byScope.get(g.scope);
  if (!expected) return err(where, `scope does not exist in pixera_api.json`);
  if (!AREA_SCOPES[area].scopes.includes(g.scope)) err(where, `scope is not owned by area '${area}' (see area-scopes.ts)`);
  const isClass = expected[0].isClass;
  if (g.isClass !== isClass) err(where, `isClass must be ${isClass}`);
  if (!g.title?.trim()) err(where, 'title is empty');
  if (!g.description?.trim() || g.description.trim().length < 20) err(where, 'description missing or too short');
  const name = toolNameForScope(g.scope);
  if (!/^[a-z0-9_]{1,64}$/.test(name)) err(where, `derived tool name '${name}' is invalid`);

  const actual = Object.keys(g.actions ?? {});
  const want = expected.map((e) => e.name);
  for (const n of want) if (!actual.includes(n)) err(where, `missing action '${n}'`);
  for (const n of actual) if (!want.includes(n)) err(where, `unknown action '${n}' (not in pixera_api.json)`);
  const commonActual = actual.filter((n) => want.includes(n));
  const commonWant = want.filter((n) => actual.includes(n));
  if (commonActual.join() !== commonWant.join()) err(where, `actions are not in pixera_api.json order`);

  for (const e of expected) {
    const spec = g.actions?.[e.name];
    if (!spec) continue;
    const aw = `${where}.${e.name}`;
    if (!spec.description?.trim()) err(aw, 'description is empty');
    else if (spec.description.trim().toLowerCase() === e.name.toLowerCase()) err(aw, 'description just repeats the name');
    if (spec.returns !== e.returns) err(aw, `returns '${spec.returns}' but API says '${e.returns}'`);
    const ps = Object.entries(spec.params ?? {}).map(([n, p]) => ({ name: n, ...normalizeParam(p) }));
    if (ps.some((p) => p.name === 'handle') && isClass) err(aw, `do not list the implicit 'handle' param for class methods`);
    const gotSig = ps.map((p) => `${p.type} ${p.name}`).join(', ');
    const wantSig = e.params.map((p) => `${p.type} ${p.name}`).join(', ');
    if (gotSig !== wantSig) err(aw, `params (${gotSig}) != API (${wantSig})`);
    for (const p of ps) {
      if (!isKnownType(p.type)) err(aw, `param '${p.name}' has unsupported type '${p.type}'`);
      if (p.desc !== undefined && !p.desc.trim()) err(aw, `param '${p.name}' has an empty desc`);
    }
  }
}

const areas = areasFromArgv();
const allGroups: ToolGroup[] = [];
let actionCount = 0;
for (const area of areas) {
  let groups: ToolGroup[];
  try {
    groups = await loadAreaGroups(area);
  } catch (e: any) {
    err(`[${area}]`, `failed to load ${AREA_SCOPES[area].file}: ${e?.message ?? e}`);
    continue;
  }
  const seen = new Set<string>();
  for (const g of groups) {
    if (seen.has(g.scope)) err(`[${area}] ${g.scope}`, 'scope defined twice');
    seen.add(g.scope);
    checkGroup(area, g);
    actionCount += Object.keys(g.actions ?? {}).length;
  }
  for (const s of AREA_SCOPES[area].scopes) if (!seen.has(s)) err(`[${area}] ${s}`, 'scope not implemented (no ToolGroup)');
  allGroups.push(...groups);
}

const fullRun = areas.length === Object.keys(AREA_SCOPES).length;
if (fullRun) {
  const owned = new Set(Object.values(AREA_SCOPES).flatMap((a) => a.scopes));
  for (const s of byScope.keys()) if (!owned.has(s)) err('[global]', `scope ${s} is not owned by any area`);
  const names = new Map<string, string>();
  for (const g of allGroups) {
    const n = toolNameForScope(g.scope);
    if (names.has(n)) err('[global]', `tool name ${n} used by ${names.get(n)} and ${g.scope}`);
    names.set(n, g.scope);
  }
}

const expectedCount = areas.flatMap((a) => AREA_SCOPES[a].scopes).reduce((n, s) => n + (byScope.get(s)?.length ?? 0), 0);
if (errors.length) {
  console.log(errors.join('\n'));
  console.log(`\nFAIL: ${errors.length} problem(s). Actions implemented: ${actionCount}/${expectedCount} (areas: ${areas.join(', ')})`);
  process.exit(1);
}
console.log(`OK: ${actionCount}/${expectedCount} actions match pixera_api.json (areas: ${areas.join(', ')})`);
