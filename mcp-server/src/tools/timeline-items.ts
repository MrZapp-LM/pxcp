import type { ToolGroup } from '../types.js';

// Area module - Pixera.Timelines.Clip / Node / Param / Cue (classes) and Pixera.Compound (namespace).
// Source of truth: api/pixera_api.json (see scripts/dump-scope.ts). Keep names, param order and types verbatim.
export const groups: ToolGroup[] = [
  {
    scope: 'Pixera.Timelines.Clip',
    isClass: true,
    title: 'Pixera Timeline Clip (object)',
    description:
      'A clip placed on a layer of a timeline: its time, duration, in/out points, play mode, speed, ' +
      'assigned resource and key events. Get a handle via pixera_timelines_layer action getClips or getClipAtIndex ' +
      '(or createClip / createClipAtTime).',
    actions: {
      getId: {
        description: 'Returns an id based on the handle, for APIs that cannot take handles as parameters.',
        returns: 'double',
      },
      removeThis: {
        description: 'Removes the clip from its layer.',
        returns: 'null',
      },
      getTimeline: {
        description: 'Returns a handle to the timeline the clip is in.',
        returns: 'handle',
      },
      getLayer: {
        description: 'Returns a handle to the layer the clip is on.',
        returns: 'handle',
      },
      setTime: {
        description: 'Sets the start time of the clip on the timeline.',
        params: { time: 'double' },
        returns: 'null',
      },
      getTime: {
        description: 'Returns the start time of the clip on the timeline.',
        returns: 'double',
      },
      setDuration: {
        description: 'Sets the duration of the clip.',
        params: { duration: 'double' },
        returns: 'null',
      },
      getDuration: {
        description: 'Returns the duration of the clip.',
        returns: 'double',
      },
      setLabel: {
        description: 'Sets the label of the clip.',
        params: { label: 'string' },
        returns: 'null',
      },
      getLabel: {
        description: 'Returns the label of the clip.',
        returns: 'string',
      },
      getPlayMode: {
        description: 'Returns the play mode of the clip.',
        returns: 'int',
      },
      setPlayMode: {
        description: 'Sets the play mode of the clip.',
        params: {
          playMode: {
            type: 'int',
            desc: '1 Lock to time | 2 Play once | 3 Loop | 4 Pause at endpoint | 5 Lock to time no loop | 6 Play once ping pong | 7 Loop ping pong',
          },
        },
        returns: 'null',
      },
      getSpeed: {
        description: 'Returns the playback speed of the clip.',
        returns: 'double',
      },
      setSpeed: {
        description: 'Sets the playback speed of the clip.',
        params: { speed: 'double' },
        returns: 'null',
      },
      getBlendFrames: {
        description: 'Returns whether frame blending is on for the clip.',
        returns: 'bool',
      },
      setBlendFrames: {
        description: 'Switches frame blending on or off for the clip.',
        params: { doFrameblending: 'bool' },
        returns: 'null',
      },
      getInpoint: {
        description: 'Returns the in point of the clip.',
        returns: 'double',
      },
      setInpoint: {
        description: 'Sets the in point of the clip.',
        params: { inpoint: 'double' },
        returns: 'null',
      },
      getOutpoint: {
        description: 'Returns the out point of the clip.',
        returns: 'double',
      },
      setOutpoint: {
        description: 'Sets the out point of the clip.',
        // Note: the API parameter is named 'inpoint' for setOutpoint (verbatim from pixera_api.json).
        params: { inpoint: { type: 'double', desc: 'Out point value (the API parameter name is "inpoint")' } },
        returns: 'null',
      },
      assignResource: {
        description: 'Assigns a resource to the clip.',
        params: {
          resId: {
            type: 'double',
            desc: 'Resource id, i.e. Resource.getId() of the resource (not a handle)',
          },
          setToResourceDuration: {
            type: 'optional<bool>',
            desc: 'If true (default) the clip duration is set to the resource duration',
          },
        },
        returns: 'null',
      },
      getAssignedResource: {
        description: 'Returns a handle to the resource assigned to the clip.',
        returns: 'handle',
      },
      getAssignedResourceName: {
        description: 'Returns the name of the resource assigned to the clip, or an empty string if none.',
        returns: 'string',
      },
      setToResourceDuration: {
        description: 'Sets the clip duration to the duration of its assigned resource.',
        returns: 'null',
      },
      setText: {
        description: 'Sets the text of a text clip.',
        params: { text: 'string' },
        returns: 'null',
      },
      getText: {
        description: 'Returns the text of a text clip.',
        returns: 'string',
      },
      createEvent: {
        description: 'Creates a key with a value at a time in a clip parameter.',
        params: {
          namePath: { type: 'string', desc: "Parameter path as shown in the timeline UI, e.g. 'Position/x'" },
          time: 'double',
          value: 'double',
        },
        returns: 'null',
      },
      createEventInPixelSpace: {
        description: 'Creates a key with a value at a time in a clip parameter, using pixel-space values.',
        params: {
          namePath: { type: 'string', desc: "Parameter path as shown in the timeline UI, e.g. 'Position/x'" },
          time: 'double',
          value: 'double',
        },
        returns: 'null',
      },
      removeEvent: {
        description: 'Removes the key at a time from a clip parameter.',
        params: {
          namePath: { type: 'string', desc: "Parameter path as shown in the timeline UI, e.g. 'Position/x'" },
          time: 'double',
        },
        returns: 'null',
      },
      createPauseCueBeforeClip: {
        description: 'Creates a pause cue directly before the clip and returns its handle (0 if not created).',
        params: {
          cueLayerHandle: {
            type: 'handle',
            desc: 'Optional cue layer; if omitted the main cue layer is used',
          },
        },
        returns: 'handle',
      },
      setColorTransformPath: {
        description: 'Sets the color correction look-up table file path (deprecated; use setColorTransformLutResource).',
        params: { colorTransformPath: 'string' },
        returns: 'null',
      },
      setColorTransformLutResource: {
        description: 'Sets the color LUT resource used to color-correct the clip.',
        params: { resourcePath: 'string' },
        returns: 'null',
      },
      getColorTransformPath: {
        description: 'Returns the color look-up table file path (deprecated).',
        returns: 'string',
      },
      getColorTransformLutResource: {
        description: 'Returns a handle to the color LUT resource used to color-correct the clip.',
        returns: 'handle',
      },
      clearColorTransformPath: {
        description: 'Clears the color look-up table file path and the color LUT resource.',
        returns: 'null',
      },
      getKeyframesAsJsonString: {
        description: 'Returns all keyframes of the clip (time and value) as a JSON string.',
        returns: 'string',
      },
      setClipLocked: {
        description: 'Locks or unlocks the clip.',
        params: { locked: 'bool' },
        returns: 'null',
      },
      getIsClipLocked: {
        description: 'Returns whether the clip is locked.',
        returns: 'bool',
      },
      setPreloadPermanently: {
        description: "Sets the 'preload permanently' status of the clip on all services (only if the layer supports it).",
        params: { doPreloadPermanently: 'bool' },
        returns: 'null',
      },
      getPreloadPermanently: {
        description: "Returns the 'preload permanently' status of the clip.",
        returns: 'bool',
      },
    },
  },
  {
    scope: 'Pixera.Timelines.Node',
    isClass: true,
    title: 'Pixera Timeline Node (object)',
    description:
      'A node of a layer parameter tree (a folder such as "Position" or a parameter), used to read, set, ' +
      'store, reset and mute its child parameter values. Get a handle via pixera_timelines_layer action getNodes ' +
      'or getNodeWithName, or pixera_timelines action getNodeFromId.',
    actions: {
      getParameters: {
        description: 'Returns handles to the child parameters of the node.',
        returns: 'handle[]',
      },
      getName: {
        description: 'Returns the name of the node.',
        returns: 'string',
      },
      getParamWithName: {
        description: "Returns a handle to the child parameter with the given name (e.g. 'x' under 'Position').",
        params: { name: 'string' },
        returns: 'handle',
      },
      setValues: {
        description: 'Sets the values of the child parameters in the order shown in the timeline (e.g. x, y, z).',
        params: { values: 'double[]' },
        returns: 'null',
      },
      getValues: {
        description: 'Returns the values of the child parameters in the order shown in the timeline.',
        returns: 'double[]',
      },
      resetValues: {
        description: 'Resets the dominant values of the child parameters in the timeline.',
        returns: 'null',
      },
      storeValues: {
        description: 'Stores all node values as keyframes in the timeline.',
        returns: 'null',
      },
      storeValuesAtClipStart: {
        description: 'Stores all dominant node values at the start of each selected clip, clearing existing keys first.',
        returns: 'null',
      },
      updateOrCreatePreviousEventValue: {
        description: 'Updates the last keyframe of each dominant parameter before the nowpointer instead of creating a new one.',
        returns: 'null',
      },
      mute: {
        description: 'Mutes the node.',
        returns: 'null',
      },
      unMute: {
        description: 'Unmutes the node.',
        returns: 'null',
      },
      toggleMute: {
        description: 'Toggles the mute state of the node.',
        returns: 'null',
      },
      getIsMuted: {
        description: 'Returns whether the node is muted.',
        returns: 'bool',
      },
      getTimeline: {
        description: 'Returns a handle to the timeline that holds the node.',
        returns: 'handle',
      },
      getInst: {
        description: 'Returns the handle for an instance path.',
        params: { instancePath: 'string' },
        returns: 'handle',
      },
      getHandleFromInstancePath: {
        description: 'Returns the handle for an instance path.',
        params: { instancePath: 'string' },
        returns: 'handle',
      },
      getInstancePath: {
        description: 'Returns the instance path of the node.',
        returns: 'string',
      },
    },
  },
  {
    scope: 'Pixera.Timelines.Param',
    isClass: true,
    title: 'Pixera Timeline Parameter (object)',
    description:
      'A timeline parameter (e.g. Opacity, Transport) of a layer: read and set its value, min/max, ' +
      'dominant value, keys, transport attributes and mute state. Get a handle via pixera_timelines_layer action ' +
      'getParameters or getParamWithName, or from a node via pixera_timelines_node action getParamWithName.',
    actions: {
      getName: {
        description: 'Returns the name of the parameter.',
        returns: 'string',
      },
      getIsChannel: {
        description: 'Returns whether the parameter is a channel.',
        returns: 'bool',
      },
      setValue: {
        description: 'Sets the value of the parameter, optionally with a fade.',
        params: {
          value: { type: 'timelineParamValue', desc: 'Number (double) or string, depending on the parameter' },
          fadeTimeMs: { type: 'optional<int>', desc: 'Fade time in milliseconds' },
        },
        returns: 'null',
      },
      setValueRelativ: {
        description: 'Changes the value of the parameter relative to its current value, optionally with a fade.',
        params: {
          value: 'double',
          fadeTimeMs: { type: 'optional<int>', desc: 'Fade time in milliseconds' },
        },
        returns: 'null',
      },
      getValue: {
        description: 'Returns the value of the parameter (double or string).',
        returns: 'timelineParamValue',
      },
      getValueMax: {
        description: 'Returns the maximum value of the parameter (0 if it has none, e.g. string parameters).',
        returns: 'double',
      },
      getValueMin: {
        description: 'Returns the minimum value of the parameter (0 if it has none, e.g. string parameters).',
        returns: 'double',
      },
      resetValue: {
        description: 'Resets the dominant value of the parameter in the timeline.',
        returns: 'null',
      },
      storeValue: {
        description: 'Stores the dominant value of the parameter as a keyframe in the timeline.',
        returns: 'null',
      },
      storeValueAndRemoveOther: {
        description: 'Stores the parameter value in the timeline and removes all other keys.',
        returns: 'null',
      },
      storeValueAtClipStart: {
        description: 'Stores the dominant value at the start of each selected clip, clearing existing keys first.',
        returns: 'null',
      },
      updateOrCreatePreviousEventValue: {
        description: 'Updates the last keyframe before the nowpointer instead of creating a new one.',
        returns: 'null',
      },
      setTransportAttributes: {
        description: 'Sets the transport state; only effective for the "Transport" parameter of a layer.',
        params: {
          mode: { type: 'int', desc: 'Transport mode: 1 Play | 2 Pause | 3 Stop' },
          speed: 'double',
          loop: 'bool',
          inpoint: { type: 'int', desc: 'In point in frames; zero is ignored at pause' },
          outpoint: { type: 'int', desc: 'Out point in frames; zero is always ignored' },
        },
        returns: 'null',
      },
      getAttributes: {
        description: 'Returns the attributes of the current transport state.',
        returns: 'TransportAttributes',
      },
      mute: {
        description: 'Mutes the parameter.',
        returns: 'null',
      },
      unMute: {
        description: 'Unmutes the parameter.',
        returns: 'null',
      },
      toggleMute: {
        description: 'Toggles the mute state of the parameter.',
        returns: 'null',
      },
      getIsMuted: {
        description: 'Returns whether the parameter is muted.',
        returns: 'bool',
      },
      getInst: {
        description: 'Returns the handle for an instance path.',
        params: { instancePath: 'string' },
        returns: 'handle',
      },
      getHandleFromInstancePath: {
        description: 'Returns the handle for an instance path.',
        params: { instancePath: 'string' },
        returns: 'handle',
      },
      getInstancePath: {
        description: 'Returns the instance path of the parameter.',
        returns: 'string',
      },
    },
  },
  {
    scope: 'Pixera.Timelines.Cue',
    isClass: true,
    title: 'Pixera Timeline Cue (object)',
    description:
      'A cue on a timeline: apply/jump to it, its name, number, time, operation (play/pause/stop/jump), ' +
      'fade and wait settings, timeline it triggers, activity, countdown and color. Get a handle via pixera_timelines_timeline ' +
      'action getCues, getCueFromName, getCueFromNumber or getCueAtIndex.',
    actions: {
      removeThis: {
        description: 'Removes the cue from its timeline.',
        returns: 'null',
      },
      apply: {
        description: 'Jumps to and executes the cue, optionally with a blend duration.',
        params: {
          blendDuration: { type: 'optional<double>', desc: 'Blend duration in seconds' },
        },
        returns: 'null',
      },
      blendToThis: {
        description: 'Blends to and executes the cue (deprecated; use apply).',
        params: { blendDuration: { type: 'double', desc: 'Blend duration in seconds' } },
        returns: 'null',
      },
      getAttributes: {
        description: 'Returns the attributes of the cue (CueAttributes struct).',
        returns: 'CueAttributes',
      },
      getTimeline: {
        description: 'Returns a handle to the timeline the cue is in.',
        returns: 'handle',
      },
      getIndex: {
        description: 'Returns the time-ordered index of the cue in its timeline (-1 if not found).',
        returns: 'int',
      },
      getName: {
        description: 'Returns the name of the cue.',
        returns: 'string',
      },
      setName: {
        description: 'Sets the name of the cue.',
        params: { name: 'string' },
        returns: 'bool',
      },
      getNote: {
        description: 'Returns the note (info text) of the cue.',
        returns: 'string',
      },
      setNote: {
        description: 'Sets the note (info text) of the cue.',
        params: { note: 'string' },
        returns: 'bool',
      },
      getOperation: {
        description: 'Returns the operation of the cue.',
        returns: 'int',
      },
      setOperation: {
        description: 'Sets the operation of the cue.',
        params: {
          operation: { type: 'int', desc: '1 Play | 2 Pause | 3 Stop | 4 Jump' },
        },
        returns: 'bool',
      },
      getJumpMode: {
        description: 'Returns the jump mode of the cue (only relevant when operation is Jump).',
        returns: 'int',
      },
      setJumpMode: {
        description: 'Sets the jump mode of the cue (only relevant when operation is Jump).',
        params: {
          jumpMode: { type: 'int', desc: '0 None | 1 To time | 2 To cue' },
        },
        returns: 'bool',
      },
      getJumpGoalTime: {
        description: 'Returns the jump goal time of the cue in frames.',
        returns: 'double',
      },
      setJumpGoalTime: {
        description: 'Sets the time in frames the timeline jumps to when the cue is reached (jump-to-time mode).',
        params: { time: 'double' },
        returns: 'bool',
      },
      getJumpGoalLabel: {
        description: 'Returns the name of the cue the timeline jumps to when this cue is reached.',
        returns: 'string',
      },
      getJumpGoalCue: {
        description: 'Returns a handle to the cue the timeline jumps to when this cue is reached.',
        returns: 'handle',
      },
      setJumpGoalLabel: {
        description: 'Sets the name of the cue the timeline jumps to when this cue is reached (jump-to-cue mode).',
        params: { jumpGoalLabel: 'string' },
        returns: 'bool',
      },
      getNumber: {
        description: 'Returns the main number of the cue (deprecated; use getNumberComponents).',
        returns: 'int',
      },
      getNumberComponents: {
        description: 'Returns the cue number as components [main, sub, detail].',
        returns: 'int[]',
      },
      setNumber: {
        description: 'Sets the main number of the cue (deprecated; use setNumberWithComponents).',
        params: { number: 'int' },
        returns: 'null',
      },
      setNumberWithComponents: {
        description: 'Sets the cue number from its main, sub and detail components.',
        params: {
          main: 'int',
          sub: 'int',
          detail: 'int',
        },
        returns: 'null',
      },
      setNumberWithString: {
        description: "Sets the cue number from a string in the format 'Main.Sub.Detail'.",
        params: { numberStr: 'string' },
        returns: 'null',
      },
      getWaitDuration: {
        description: 'Returns the wait duration of the cue in frames (wait before the cue is applied).',
        returns: 'double',
      },
      setWaitDuration: {
        description: 'Sets the wait duration of the cue in frames (wait before the cue is applied).',
        params: { time: 'double' },
        returns: 'bool',
      },
      getBlendDuration: {
        description: 'Returns the blend duration between this cue and its jump target, in frames.',
        returns: 'double',
      },
      setBlendDuration: {
        description: 'Sets the blend duration of a jump cue, in frames.',
        params: { timeInFrames: 'double' },
        returns: 'bool',
      },
      getFadeToThisDurationOverride: {
        description: 'Returns the fade-to-this-cue duration override in ms (-1 = use general settings).',
        returns: 'int',
      },
      setFadeToThisDurationOverride: {
        description: 'Sets the fade-to-this-cue duration override in ms (negative = use general settings).',
        params: { durationInMs: { type: 'int', desc: 'Duration in milliseconds; < 0 uses the general default' } },
        returns: 'bool',
      },
      getFadeToThisDelayOverride: {
        description: 'Returns the fade-to-this-cue delay override in ms (-1 = use general settings).',
        returns: 'int',
      },
      setFadeToThisDelayOverride: {
        description: 'Sets the fade-to-this-cue delay override in ms (negative = use general settings).',
        params: { delayInMs: { type: 'int', desc: 'Delay in milliseconds; < 0 uses the general default' } },
        returns: 'bool',
      },
      getTime: {
        description: 'Returns the time of the cue in frames.',
        returns: 'double',
      },
      setTime: {
        description: 'Sets the time of the cue in frames.',
        params: { time: { type: 'double', desc: 'Time in frames' } },
        returns: 'bool',
      },
      getTimelineToTriggerName: {
        description: 'Returns the name of the timeline triggered by this cue (empty if none).',
        returns: 'string',
      },
      setTimelineToTrigger: {
        description: 'Sets the timeline triggered by this cue; an empty name clears the trigger.',
        params: { nameTimeline: 'string' },
        returns: 'bool',
      },
      getTimelineToTriggerMode: {
        description: 'Returns the time mode of the triggered timeline (0 if none).',
        returns: 'int',
      },
      setTimelineToTriggerTimeMode: {
        description: 'Sets the time mode of the triggered timeline.',
        params: {
          mode: { type: 'int', desc: '1 Current Time | 2 Time | 3 Cue' },
        },
        returns: 'bool',
      },
      getTimelineTriggerMode: {
        description: 'Returns the playback mode applied to the triggered timeline (0 if none).',
        returns: 'int',
      },
      setTimelineTriggerMode: {
        description: 'Sets the playback mode applied to the triggered timeline.',
        params: {
          mode: { type: 'int', desc: '1 Play | 2 Pause | 3 Stop' },
        },
        returns: 'bool',
      },
      getTimelineTriggerApplyTime: {
        description: 'Returns the time applied to the triggered timeline in frames (-1 if none).',
        returns: 'double',
      },
      setTimelineTriggerApplyTime: {
        description: 'Sets the time applied to the triggered timeline (sets time mode to Time); a negative value resets it.',
        params: { time: { type: 'double', desc: 'Time in frames; < 0 resets to Current Time' } },
        returns: 'bool',
      },
      setTimelineTriggerApplyCue: {
        description: 'Sets the cue applied on the triggered timeline (sets time mode to Cue).',
        params: { goalCueLabel: 'string' },
        returns: 'bool',
      },
      isActive: {
        description: 'Returns whether the cue will be applied when the nowpointer passes it.',
        returns: 'bool',
      },
      setActivity: {
        description: 'Sets the activity state of the cue.',
        params: {
          idState: { type: 'int', desc: '1 Active | 2 Ignore | 3 Ignore Once' },
        },
        returns: 'null',
      },
      getCountdown: {
        description: 'Returns the countdown to this cue in frames (0 if already passed).',
        returns: 'double',
      },
      getCountdownHMSF: {
        description: 'Returns the countdown to this cue as an hours:minutes:seconds:frames string.',
        returns: 'string',
      },
      setCommand: {
        description: 'Sets the network command (conveyor and command string) executed by the cue.',
        params: {
          conveyorName: {
            type: 'string',
            desc: "Must be an entry of the 'API Output' dropdown in the cue inspector",
          },
          commandData: 'string',
        },
        returns: 'null',
      },
      resetColor: {
        description: 'Resets the cue color to its default.',
        returns: 'null',
      },
      setColor: {
        description: 'Sets the cue color.',
        params: {
          red: { type: 'int', desc: '0..255' },
          green: { type: 'int', desc: '0..255' },
          blue: { type: 'int', desc: '0..255' },
        },
        returns: 'null',
      },
      getColor: {
        description: 'Returns the cue color as [red, green, blue] (0..255).',
        returns: 'int[]',
      },
      getInst: {
        description: 'Returns the handle for an instance path.',
        params: { instancePath: 'string' },
        returns: 'handle',
      },
      getHandleFromInstancePath: {
        description: 'Returns the handle for an instance path.',
        params: { instancePath: 'string' },
        returns: 'handle',
      },
      getInstancePath: {
        description: 'Returns the instance path of the cue.',
        returns: 'string',
      },
    },
  },
  {
    scope: 'Pixera.Compound',
    isClass: false,
    title: 'Pixera compound helpers',
    description:
      'Convenience functions that address timelines, layers, cues and parameters by name, index or path ' +
      '(e.g. "Timeline 1.Layer 1.Opacity") instead of handles: transport, opacity, cue application, clips, ' +
      'resources, time/countdown, timecode and SMPTE.',
    actions: {
      setTransportModeOnTimelineAtIndex: {
        description: 'Sets the transport mode of the timeline at a zero-based library index.',
        params: {
          index: { type: 'int', desc: 'Zero-based index in the timeline library of the Compositing tab' },
          mode: { type: 'int', desc: '1 Play | 2 Pause | 3 Stop' },
        },
        returns: 'bool',
      },
      setTransportModeOnTimeline: {
        description: 'Sets the transport mode of the timeline with the given name.',
        params: {
          timelineName: 'string',
          mode: { type: 'int', desc: '1 Play | 2 Pause | 3 Stop' },
        },
        returns: 'null',
      },
      toggleTransport: {
        description: 'Toggles the named timeline between Play and Pause.',
        params: { timelineName: 'string' },
        returns: 'null',
      },
      getTransportModeOnTimeline: {
        description: 'Returns the transport mode of the named timeline (1 Play | 2 Pause | 3 Stop).',
        params: { timelineName: 'string' },
        returns: 'int',
      },
      startFirstTimeline: {
        description: 'Sets the first timeline in the library to Play.',
        returns: 'null',
      },
      pauseFirstTimeline: {
        description: 'Sets the first timeline in the library to Pause.',
        returns: 'null',
      },
      stopFirstTimeline: {
        description: 'Sets the first timeline in the library to Stop.',
        returns: 'null',
      },
      setOpacityOnTimeline: {
        description: 'Sets the opacity of the named timeline.',
        params: {
          timelineName: 'string',
          opacity: { type: 'double', desc: '0.0..1.0' },
        },
        returns: 'null',
      },
      getOpacityOnTimeline: {
        description: 'Returns the opacity of the named timeline.',
        params: { timelineName: 'string' },
        returns: 'double',
      },
      setPosValue: {
        description: 'Sets the x position of the first layer of the first timeline (demo/testing only).',
        params: { val: 'double' },
        returns: 'null',
      },
      setPosValueXY: {
        description: 'Sets the x/y position of the first layer of the first timeline (demo/testing only).',
        params: { valX: 'double', valY: 'double' },
        returns: 'null',
      },
      setParamValue: {
        description: 'Sets the current value of a parameter identified by its path.',
        params: {
          path: { type: 'string', desc: "Period-separated path, e.g. 'Timeline 1.Layer 1.Opacity'" },
          value: 'double',
        },
        returns: 'null',
      },
      applyCueAtIndexOnTimelineAtIndex: {
        description: 'Jumps to and executes the cue at a zero-based cue index in a timeline at a zero-based library index.',
        params: {
          cueIndex: { type: 'int', desc: 'Zero-based cue index' },
          timelineIndex: { type: 'int', desc: 'Zero-based index in the timeline library' },
          blendDuration: { type: 'optional<double>', desc: 'Blend duration in seconds' },
        },
        returns: 'null',
      },
      applyCueNumberOnTimelineAtIndex: {
        description: 'Jumps to and executes the cue with the given number in a timeline at a zero-based library index.',
        params: {
          cueNumber: 'int',
          timelineIndex: { type: 'int', desc: 'Zero-based index in the timeline library' },
          blendDuration: { type: 'optional<double>', desc: 'Blend duration in seconds' },
        },
        returns: 'null',
      },
      applyCueNumberOnTimeline: {
        description: 'Jumps to and executes the cue with the given number in the named timeline.',
        params: {
          timelineName: 'string',
          cueNumber: 'int',
          blendDuration: { type: 'optional<double>', desc: 'Blend duration in seconds' },
        },
        returns: 'null',
      },
      applyCueOnTimeline: {
        description: 'Jumps to and executes the cue with the given name in the named timeline.',
        params: {
          timelineName: 'string',
          cueName: 'string',
          blendDuration: { type: 'optional<double>', desc: 'Blend duration in seconds' },
        },
        returns: 'null',
      },
      addResourceToFolder: {
        description: 'Adds a file to the resource folder with the given name path and returns the resource handle.',
        params: {
          namePath: { type: 'string', desc: "Folder path, e.g. 'Media/Folder'" },
          filePath: { type: 'string', desc: 'Absolute path of the file on the Pixera machine' },
        },
        returns: 'handle',
      },
      assignResourceToLayer: {
        description: 'Assigns a resource to a layer.',
        params: {
          resourcePath: { type: 'string', desc: "Resource path separated by forward slashes, e.g. 'Media/Folder/video.mov'" },
          layerPath: { type: 'string', desc: "Layer path separated by periods, e.g. 'Timeline 1.Layer 1'" },
        },
        returns: 'null',
      },
      refreshResource: {
        description: 'Reloads a resource from its file on disk.',
        params: {
          resourcePath: { type: 'string', desc: "Resource path separated by forward slashes, e.g. 'Media/Folder/video.mov'" },
        },
        returns: 'null',
      },
      setTransportModeOnLayer: {
        description: 'Sets the transport mode of a layer.',
        params: {
          layerPath: { type: 'string', desc: "Layer path separated by periods, e.g. 'Timeline 1.Layer 1'" },
          mode: { type: 'int', desc: '1 Play | 2 Pause | 3 Stop' },
          loop: 'bool',
        },
        returns: 'null',
      },
      getTransportModeOnLayer: {
        description: 'Returns the transport mode of a layer (1 Play | 2 Pause | 3 Stop).',
        params: {
          layerPath: { type: 'string', desc: "Layer path separated by periods, e.g. 'Timeline 1.Layer 1'" },
        },
        returns: 'int',
      },
      getResourceAssignedToLayer: {
        description: 'Returns the path of the resource currently assigned to a layer.',
        params: {
          layerPath: { type: 'string', desc: "Layer path separated by periods, e.g. 'Timeline 1.Layer 1'" },
        },
        returns: 'string',
      },
      assignResourceToClipAtTimeByDmxId: {
        description: 'Assigns the resource with the given DMX folder/file ids to the clip at a time on a layer.',
        params: {
          layerPath: { type: 'string', desc: "Layer path separated by periods, e.g. 'Timeline 1.Layer 1'" },
          dmxFolderId: 'int',
          dmxFileId: 'int',
          time: { type: 'double', desc: 'Time in frames' },
        },
        returns: 'null',
      },
      assignResourceToClipAtHMSFStringByDmxId: {
        description: 'Assigns the resource with the given DMX folder/file ids to the clip at an HMSF time on a layer.',
        params: {
          layerPath: { type: 'string', desc: "Layer path separated by periods, e.g. 'Timeline 1.Layer 1'" },
          dmxFolderId: 'int',
          dmxFileId: 'int',
          hmsf: { type: 'string', desc: 'Time as hours:minutes:seconds:frames string' },
        },
        returns: 'null',
      },
      assignResourceToClipAtHMSFByDmxId: {
        description: 'Assigns the resource with the given DMX folder/file ids to the clip at an h/m/s/f time on a layer.',
        params: {
          layerPath: { type: 'string', desc: "Layer path separated by periods, e.g. 'Timeline 1.Layer 1'" },
          dmxFolderId: 'int',
          dmxFileId: 'int',
          h: 'int',
          m: 'int',
          s: 'int',
          f: 'int',
        },
        returns: 'null',
      },
      setCurrentTimeOfTimeline: {
        description: 'Sets the current time of the named timeline in frames.',
        params: {
          name: 'string',
          time: { type: 'int', desc: 'New time in frames (use getFpsOfTimeline to convert)' },
        },
        returns: 'null',
      },
      setCurrentTimeOfTimelineInSeconds: {
        description: 'Sets the current time of the named timeline in seconds.',
        params: {
          name: 'string',
          time: { type: 'double', desc: 'New time in seconds' },
        },
        returns: 'null',
      },
      setCurrentTimeAndTransportModeOfTimelineInSeconds: {
        description: 'Sets the current time (seconds) and the transport mode of the named timeline.',
        params: {
          name: 'string',
          time: { type: 'double', desc: 'New time in seconds' },
          mode: { type: 'int', desc: '1 Play | 2 Pause | 3 Stop' },
        },
        returns: 'null',
      },
      getFpsOfTimeline: {
        description: 'Returns the frames per second of the named timeline.',
        params: { name: 'string' },
        returns: 'double',
      },
      getCurrentTimeOfTimeline: {
        description: 'Returns the current time of the named timeline in frames.',
        params: { name: 'string' },
        returns: 'int',
      },
      getCurrentTimeOfTimelineInSeconds: {
        description: 'Returns the current time of the named timeline in seconds.',
        params: { name: 'string' },
        returns: 'double',
      },
      getCurrentHMSFOfTimeline: {
        description: 'Returns the current time of the named timeline as an hours:minutes:seconds:frames string.',
        params: { name: 'string' },
        returns: 'string',
      },
      getCurrentCountdownOfTimeline: {
        description: 'Returns the countdown to the next countdown-relevant cue of the named timeline, in frames.',
        params: { name: 'string' },
        returns: 'int',
      },
      getCurrentCountdownHMSFOfTimeline: {
        description: 'Returns the countdown to the next countdown-relevant cue as an hours:minutes:seconds:frames string.',
        params: { name: 'string' },
        returns: 'string',
      },
      blockUiTimelineUpdates: {
        description: 'Blocks or unblocks timeline UI updates; use only around bulk edits and always unblock afterwards.',
        params: {
          doBlock: { type: 'bool', desc: 'true = start blocking, false = unblock' },
          terminationDurationInMs: {
            type: 'optional<int>',
            desc: 'Automatic unblock after this many ms (default 10000)',
          },
        },
        returns: 'null',
      },
      startOpacityAnimationOfTimeline: {
        description: 'Starts a fade-in or fade-out opacity animation on the named timeline.',
        params: {
          name: 'string',
          fadeIn: { type: 'bool', desc: 'true = fade in, false = fade out' },
          fullFadeDuration: { type: 'double', desc: 'Duration of a full fade in seconds' },
        },
        returns: 'null',
      },
      createClipOnLayerAtTimeWithResource: {
        description: 'Creates a clip at a time on a layer and assigns a resource to it.',
        params: {
          layerPath: { type: 'string', desc: "Layer path separated by periods, e.g. 'Timeline 1.Layer 1'" },
          time: { type: 'double', desc: 'Time in frames' },
          resourcePath: { type: 'string', desc: "Resource path separated by forward slashes, e.g. 'Media/Folder/video.mov'" },
        },
        returns: 'null',
      },
      removeClipOnLayerWithIndex: {
        description: 'Removes the clip at a zero-based index on a layer.',
        params: {
          layerPath: { type: 'string', desc: "Layer path separated by periods, e.g. 'Timeline 1.Layer 1'" },
          clipIndex: { type: 'int', desc: 'Zero-based clip index' },
        },
        returns: 'null',
      },
      removeAllClipsOnLayer: {
        description: 'Removes all clips on a layer.',
        params: {
          layerPath: { type: 'string', desc: "Layer path separated by periods, e.g. 'Timeline 1.Layer 1'" },
        },
        returns: 'null',
      },
      getClipDurationInSecondsWithIndex: {
        description: 'Returns the duration in seconds of the clip at a zero-based index on a layer.',
        params: {
          layerPath: { type: 'string', desc: "Layer path separated by periods, e.g. 'Timeline 1.Layer 1'" },
          clipIndex: { type: 'int', desc: 'Zero-based clip index' },
        },
        returns: 'double',
      },
      getClipDurationInFramesWithIndex: {
        description: 'Returns the duration in frames of the clip at a zero-based index on a layer.',
        params: {
          layerPath: { type: 'string', desc: "Layer path separated by periods, e.g. 'Timeline 1.Layer 1'" },
          clipIndex: { type: 'int', desc: 'Zero-based clip index' },
        },
        returns: 'int',
      },
      getClipTimeInSecondsWithIndex: {
        description: 'Returns the start time in seconds of the clip at a zero-based index on a layer.',
        params: {
          layerPath: { type: 'string', desc: "Layer path separated by periods, e.g. 'Timeline 1.Layer 1'" },
          clipIndex: { type: 'int', desc: 'Zero-based clip index' },
        },
        returns: 'double',
      },
      getClipEndTimeInSecondsWithIndex: {
        description: 'Returns the end time in seconds of the clip at a zero-based index on a layer.',
        params: {
          layerPath: { type: 'string', desc: "Layer path separated by periods, e.g. 'Timeline 1.Layer 1'" },
          clipIndex: { type: 'int', desc: 'Zero-based clip index' },
        },
        returns: 'double',
      },
      getResourceDurationInSeconds: {
        description: 'Returns the duration in seconds of a resource.',
        params: {
          resourcePath: { type: 'string', desc: "Resource path separated by forward slashes, e.g. 'Media/Folder/video.mov'" },
        },
        returns: 'double',
      },
      getParamValue: {
        description: 'Returns the current value of a parameter identified by its path.',
        params: {
          path: { type: 'string', desc: "Period-separated path, e.g. 'Timeline 1.Layer 1.Opacity'" },
        },
        returns: 'double',
      },
      setTimecodeInput: {
        description: 'Sets the timecode input for MIDI or Art-Net timecode (requires timecode device type API).',
        params: {
          hour: 'int',
          minute: 'int',
          second: 'int',
          frame: 'int',
          elapsedTime: 'double',
          running: 'bool',
          freshMode: 'int',
          stateToken: 'int',
          format: 'int',
        },
        returns: 'double',
      },
      takeOverAllClients: {
        description: 'Takes over all clients.',
        returns: 'null',
      },
      setPauseSmpteInput: {
        description: 'Pauses or unpauses all incoming SMPTE inputs.',
        params: { doPause: 'bool' },
        returns: 'null',
      },
      setGlobalSMPTEOffset: {
        description: 'Sets a global SMPTE timecode offset, added on top of any per-sequence SMPTE offset.',
        params: { time: 'double' },
        returns: 'null',
      },
      getGlobalSMPTEOffset: {
        description: 'Returns the global SMPTE timecode offset.',
        returns: 'double',
      },
      setAllowControlProtocolOutputs: {
        description: 'Allows or blocks control protocol outputs.',
        params: { allow: 'bool' },
        returns: 'null',
      },
    },
  },
];
