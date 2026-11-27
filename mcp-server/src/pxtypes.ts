import { z, type ZodTypeAny } from 'zod';
import { normalizeParam, type ActionSpec, type PxType } from './types.js';

const SCALARS: Record<string, () => ZodTypeAny> = {
  int: () => z.number().int(),
  uint: () => z.number().int().nonnegative(),
  uchar: () => z.number().int().min(0).max(255),
  double: () => z.number(),
  float: () => z.number(),
  bool: () => z.boolean(),
  boolean: () => z.boolean(),
  string: () => z.string(),
  // Pixera handles are 64-bit ints that only use 53 bits -> safe JS numbers.
  handle: () => z.number().int().nonnegative(),
  // Param.setValue accepts numbers, strings or booleans depending on the param.
  timelineParamValue: () => z.union([z.number(), z.string(), z.boolean()]),
};

export function isKnownType(t: PxType): boolean {
  try {
    zodForType(t);
    return true;
  } catch {
    return false;
  }
}

/** Build a zod schema for a Pixera type string such as 'optional<double>' or 'handle[]'. */
export function zodForType(t: PxType): ZodTypeAny {
  const s = t.trim();
  const opt = /^optional<(.+)>$/.exec(s);
  if (opt) return zodForType(opt[1]).optional();
  if (s.endsWith('[]')) return z.array(zodForType(s.slice(0, -2)));
  const f = SCALARS[s];
  if (!f) throw new Error(`Unknown Pixera parameter type '${t}'`);
  return f();
}

/** Strict zod object schema for an action's params (the implicit handle excluded). */
export function paramsSchema(spec: ActionSpec) {
  const shape: Record<string, ZodTypeAny> = {};
  for (const [name, p] of Object.entries(spec.params ?? {})) {
    shape[name] = zodForType(normalizeParam(p).type);
  }
  return z.object(shape).strict();
}

/** Compact signature, e.g. `setOpacity(value: double, fade?: double) -> null`. */
export function signature(action: string, spec: ActionSpec): string {
  const ps = Object.entries(spec.params ?? {}).map(([n, p]) => {
    const { type } = normalizeParam(p);
    const opt = /^optional<(.+)>$/.exec(type);
    return opt ? `${n}?: ${opt[1]}` : `${n}: ${type}`;
  });
  return `${action}(${ps.join(', ')}) -> ${spec.returns}`;
}
