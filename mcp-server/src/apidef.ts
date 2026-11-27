import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

/** Flattened entry of api/pixera_api.json. */
export interface ApiEntry {
  /** e.g. 'Pixera.Timelines.Timeline.getZoomFactor' */
  method: string;
  /** e.g. 'Pixera.Timelines.Timeline' */
  scope: string;
  name: string;
  isClass: boolean;
  params: { name: string; type: string }[];
  returns: string;
  documentation: string;
}

interface RawFn {
  name: string;
  documentation?: string;
  params?: { name: string; type: string }[];
  returnValues?: { name: string; type: string }[];
}
interface RawNs {
  name: string;
  functions?: RawFn[];
  classes?: { name: string; methods?: RawFn[] }[];
  namespaces?: RawNs[];
}

const here = path.dirname(fileURLToPath(import.meta.url));
const CANDIDATES = [
  process.env.PIXERA_API_JSON,
  path.join(here, 'pixera_api.json'), // dist/ (copied at build)
  path.join(here, '..', '..', 'api', 'pixera_api.json'), // repo layout: mcp-server/{src,dist,scripts}/ -> api/
].filter(Boolean) as string[];

let cache: ApiEntry[] | null = null;

export function apiJsonPath(): string {
  const p = CANDIDATES.find((c) => fs.existsSync(c));
  if (!p) throw new Error(`pixera_api.json not found (looked in: ${CANDIDATES.join(', ')})`);
  return p;
}

export function loadApi(): ApiEntry[] {
  if (cache) return cache;
  const text = fs.readFileSync(apiJsonPath(), 'utf8').replace(/^﻿/, '');
  const root = JSON.parse(text) as { namespaces: RawNs[] };
  const out: ApiEntry[] = [];
  const add = (scope: string, isClass: boolean, f: RawFn) =>
    out.push({
      method: `${scope}.${f.name}`,
      scope,
      name: f.name,
      isClass,
      params: f.params ?? [],
      returns: (f.returnValues ?? []).map((r) => r.type).join(',') || 'null',
      documentation: (f.documentation ?? '').replace(/\r/g, '').trim(),
    });
  const walk = (ns: RawNs, prefix: string) => {
    const scope = `${prefix}.${ns.name}`;
    for (const f of ns.functions ?? []) add(scope, false, f);
    for (const c of ns.classes ?? []) for (const m of c.methods ?? []) add(`${scope}.${c.name}`, true, m);
    for (const sub of ns.namespaces ?? []) walk(sub, scope);
  };
  for (const ns of root.namespaces) walk(ns, 'Pixera');
  cache = out;
  return out;
}
