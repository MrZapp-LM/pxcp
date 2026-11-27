/**
 * Declarative description of the Pixera API surface exposed as MCP tools.
 *
 * Each ToolGroup maps one Pixera namespace (its free functions) or one Pixera
 * class (its methods) to ONE MCP tool. The tool takes an `action` (the short
 * Pixera function/method name), an optional `handle` (required for class
 * methods) and a `params` object.
 *
 * Type strings are copied verbatim from api/pixera_api.json, e.g.
 *   'int' | 'uint' | 'double' | 'float' | 'bool' | 'string' | 'handle'
 *   'int[]' | 'double[]' | 'string[]' | 'handle[]' | ...
 *   'optional<double>' | 'optional<bool>' | ...
 *   'timelineParamValue'
 * Return types may additionally be 'null' or a struct name such as 'ScreenPosValues'.
 */

export type PxType = string;

export interface ParamSpec {
  /** Pixera type string, verbatim from pixera_api.json (e.g. 'optional<double>'). */
  type: PxType;
  /** Short hint for the model: units, valid range, enum meaning, path format... */
  desc?: string;
}

export interface ActionSpec {
  /** One concise sentence: what this call does. Shown in the tool description. */
  description: string;
  /**
   * Parameters in the SAME ORDER as pixera_api.json. For class methods do NOT
   * include the implicit `handle` parameter - the registry adds it.
   * Omit (or use {}) when the function takes no parameters.
   */
  params?: Record<string, PxType | ParamSpec>;
  /** Return type verbatim from pixera_api.json; join multiple with ','. Use 'null' for no return. */
  returns: PxType;
}

export interface ToolGroup {
  /**
   * Fully qualified Pixera scope:
   *   namespace functions -> 'Pixera.Timelines'
   *   class methods       -> 'Pixera.Timelines.Timeline'
   * The MCP tool name is derived from it (see toolNameForScope).
   */
  scope: string;
  /** true if `scope` is a class (every action needs a `handle`). */
  isClass: boolean;
  /** Short human-readable title, e.g. 'Pixera Timeline (object)'. */
  title: string;
  /**
   * 1-4 sentences: what this namespace/object is, and for classes HOW TO OBTAIN
   * A HANDLE (which tool + action returns one).
   */
  description: string;
  /** Keyed by the short Pixera function/method name, e.g. 'getZoomFactor'. */
  actions: Record<string, ActionSpec>;
}

/** 'Pixera.LiveSystems.MultiUserMember' -> 'pixera_livesystems_multi_user_member' */
export function toolNameForScope(scope: string): string {
  const parts = scope.replace(/^Pixera\./, '').split('.');
  const snake = (s: string) => s.replace(/([a-z0-9])([A-Z])/g, '$1_$2').toLowerCase();
  // Namespace segments are lower-cased as-is; the class segment gets snake_case.
  return 'pixera_' + parts.map((p, i) => (i === 0 ? p.toLowerCase() : snake(p))).join('_');
}

export function normalizeParam(p: PxType | ParamSpec): ParamSpec {
  return typeof p === 'string' ? { type: p } : p;
}
