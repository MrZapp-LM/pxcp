import type { ToolGroup } from '../types.js';
import { groups as utility } from './utility.js';
import { groups as timelines } from './timelines.js';
import { groups as timelineItems } from './timeline-items.js';
import { groups as resources } from './resources.js';
import { groups as screens } from './screens.js';
import { groups as system } from './system.js';
export { AREA_SCOPES } from './area-scopes.js';

export const AREA_GROUPS: Record<string, ToolGroup[]> = {
  'utility': utility,
  'timelines': timelines,
  'timeline-items': timelineItems,
  'resources': resources,
  'screens': screens,
  'system': system,
};

export const ALL_GROUPS: ToolGroup[] = Object.values(AREA_GROUPS).flat();
