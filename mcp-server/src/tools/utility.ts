import type { ToolGroup } from '../types.js';

/**
 * TEMPLATE MODULE - Pixera.Utility
 *
 * Every area module exports `groups: ToolGroup[]`, one ToolGroup per Pixera
 * namespace (free functions) or class (methods). Rules:
 *  - action keys = exact Pixera function names, in the order of pixera_api.json
 *  - params = exact names + type strings from pixera_api.json, same order;
 *    class methods never list the implicit `handle`
 *  - returns = exact return type string from pixera_api.json ('null' if none)
 *  - description = one short, useful sentence (from the docs, improved where vague)
 *  - add `desc` to params whose meaning/units/allowed values are not obvious
 */
export const groups: ToolGroup[] = [
  {
    scope: 'Pixera.Utility',
    isClass: false,
    title: 'Pixera utility',
    description:
      'General utilities: API revision and feature checks, debug log output, time, file access, ' +
      'state monitoring (subscribe/poll) and running JavaScript inside Pixera.',
    actions: {
      getApiRevision: {
        description: 'API revision of the running Pixera (even = release, odd = beta).',
        returns: 'int',
      },
      getHasFunction: {
        description: 'True if the running Pixera knows the given function or class method.',
        params: {
          functionName: { type: 'string', desc: "Fully qualified name, e.g. 'Pixera.Screens.Screen.setPosition'" },
        },
        returns: 'bool',
      },
      outputDebug: {
        description: 'Writes a message to the Pixera log and echoes it back.',
        params: { message: 'string' },
        returns: 'string',
      },
      getLicenseJson: {
        description: 'License information of the Pixera system as a JSON string.',
        returns: 'string',
      },
      getCurrentTime: {
        description: 'Pixera system time in milliseconds since 1970-01-01 UTC.',
        returns: 'double',
      },
      getCurrentTimeAsString: {
        description: 'Pixera system time as ISO-8601 string in local timezone.',
        returns: 'string',
      },
      noop: {
        description: 'Does nothing; useful to confirm all earlier calls were processed.',
        returns: 'null',
      },
      requestCallback: {
        description: 'Experimental; only relevant for JavaScript running inside Pixera.',
        params: { functionName: 'string' },
        returns: 'null',
      },
      readFileString: {
        description: 'Reads a text file on the Pixera machine and returns its content.',
        params: { path: { type: 'string', desc: 'Absolute path on the Pixera machine' } },
        returns: 'string',
      },
      writeFileString: {
        description: 'Writes text to a file on the Pixera machine (overwrites).',
        params: {
          path: { type: 'string', desc: 'Absolute path on the Pixera machine' },
          fileStr: { type: 'string', desc: 'File content' },
        },
        returns: 'null',
      },
      getAccessRecipe: {
        description: 'Returns an access recipe (API call chain) for an object handle path.',
        params: { hdlPath: 'string' },
        returns: 'string',
      },
      pollMonitoring: {
        description:
          'Returns (and clears) all monitoring changes since the last poll, grouped by subject ' +
          '(clipAdded/Changed/Removed, cueAdded/Changed/Removed/Applied, timelineAdded/Removed, ' +
          'timelineTransport, timelinePositions, timelineCountdowns).',
        returns: 'string',
      },
      unsubscribeMonitoringSubject: {
        description: 'Stops reporting a monitoring subject on this connection.',
        params: { subject: { type: 'string', desc: "Subject name, e.g. 'timelinePositions'" } },
        returns: 'bool',
      },
      subscribeMonitoringSubject: {
        description: 'Re-enables reporting of a monitoring subject on this connection.',
        params: { subject: { type: 'string', desc: "Subject name, e.g. 'cueApplied'" } },
        returns: 'bool',
      },
      setMonitoringEventMode: {
        description:
          'Push monitoring events immediately instead of on poll; read them with pixera_connection take_events.',
        params: {
          mode: {
            type: 'string',
            desc: "'none' (default, poll only) | 'all' (push everything) | 'onlyDiscrete' (push discrete changes, poll continuous values)",
          },
        },
        returns: 'bool',
      },
      monitoringEvent: {
        description: 'Control-internal callback for monitoring events; not useful from outside.',
        params: { eventDescription: 'string' },
        returns: 'null',
      },
      setShowContextInReplies: {
        description: 'If true, replies include a "context" object with the method and handle of the request.',
        params: { doShow: 'bool' },
        returns: 'bool',
      },
      setMonitoringHasDelimiter: {
        description: 'Whether pushed monitoring events on this connection end with the 0xPX delimiter.',
        params: { hasDelimiter: 'bool' },
        returns: 'bool',
      },
      runJsScript: {
        description: 'Loads JavaScript code inside Pixera and runs one function from it; returns its result.',
        params: {
          jsFunction: { type: 'string', desc: 'Name of the function in jsCode to execute' },
          jsCode: { type: 'string', desc: 'JavaScript source using the Pixera object API' },
        },
        returns: 'string',
      },
      dynamicRebuildFromJsonDescription: {
        description: 'Rebuilds a device dynamically from a JSON description.',
        params: { deviceName: 'string', jsonDescription: 'string', folder: 'string' },
        returns: 'null',
      },
      resetSelectiveRenderingFrameCounters: {
        description: 'Resets the frame counters used by selective rendering.',
        returns: 'null',
      },
    },
  },
  {
    scope: 'Pixera.Unreal.Utility',
    isClass: false,
    title: 'Pixera Unreal utility',
    description: 'Unreal Engine integration helpers.',
    actions: {
      getSupportedUnrealPluginVersion: {
        description: 'Version of the Pixera Unreal plugin supported by this Pixera build.',
        returns: 'int',
      },
    },
  },
];
