/**
 * Print the exact API definition of one or more scopes (or a whole area) in a
 * compact form, to copy names/types/order from when writing tool modules.
 *
 *   npx tsx scripts/dump-scope.ts Pixera.Timelines.Layer
 *   npx tsx scripts/dump-scope.ts --area screens
 */
import { loadApi } from '../src/apidef.js';
import { AREA_SCOPES } from '../src/tools/area-scopes.js';

const argv = process.argv.slice(2);
const scopes: string[] = [];
for (let i = 0; i < argv.length; i++) {
  if (argv[i] === '--area') scopes.push(...(AREA_SCOPES[argv[++i]]?.scopes ?? []));
  else scopes.push(argv[i]);
}
const api = loadApi();
for (const s of scopes) {
  const entries = api.filter((e) => e.scope === s);
  console.log(`\n=== ${s}  (${entries.length} ${entries[0]?.isClass ? 'methods, class => needs handle' : 'functions'})`);
  for (const e of entries) {
    const ps = e.params.map((p) => `${p.name}: '${p.type}'`).join(', ');
    console.log(`${e.name}  params {${ps}}  returns '${e.returns}'`);
    if (e.documentation) console.log('    // ' + e.documentation.replace(/\n/g, '\n    // '));
  }
}
