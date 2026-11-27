import type { ToolGroup } from '../types.js';

// Area module - timelines: Pixera.Timelines (namespace), Pixera.Timelines.Timeline
// and Pixera.Timelines.Layer (classes). Template: src/tools/utility.ts.
export const groups: ToolGroup[] = [
  {
    scope: 'Pixera.Timelines',
    isClass: false,
    title: 'Pixera timelines (library)',
    description:
      'Timeline library of the Compositing tab: list, look up and create timelines. ' +
      'Get a Timeline handle via pixera_timelines action getTimelineFromName (or getTimelineAtIndex / getTimelines); ' +
      'use it with pixera_timelines_timeline.',
    actions: {
      getTimelineAtIndex: {
        description: 'Returns the handle of the timeline at the given zero-based index in the timeline library.',
        params: { index: { type: 'int', desc: 'Zero-based index in the timeline library' } },
        returns: 'handle',
      },
      getTimelineFromName: {
        description: 'Returns the handle of the timeline with the given name (as shown in the timeline library).',
        params: { name: 'string' },
        returns: 'handle',
      },
      getTimelines: {
        description: 'Returns handles to all timelines.',
        returns: 'handle[]',
      },
      getTimelineNames: {
        description: 'Returns the names of all timelines.',
        returns: 'string[]',
      },
      getTimelinesSelected: {
        description: 'Returns handles to all selected timelines.',
        returns: 'handle[]',
      },
      createTimeline: {
        description: 'Creates a new timeline and returns its handle.',
        returns: 'handle',
      },
      disablePreviewSolo: {
        description: 'Disables preview solo mode for all timelines.',
        returns: 'null',
      },
      getNodeFromId: {
        description: 'Returns the handle of the node with the given id, after checking that the node exists.',
        params: { id: 'double' },
        returns: 'handle',
      },
      getInstancePath: {
        description: 'Returns the instance path of the given handle.',
        params: { apEntityThisHandle: 'handle' },
        returns: 'string',
      },
    },
  },
  {
    scope: 'Pixera.Timelines.Timeline',
    isClass: true,
    title: 'Pixera timeline (object)',
    description:
      'A timeline: transport (play/pause/stop), current time, cues, layers, opacity, speed, preview edit, hot regions and locking. ' +
      'Get a handle via pixera_timelines action getTimelineFromName (or getTimelineAtIndex / getTimelines / getTimelinesSelected). ' +
      'Layers of a timeline are handled with pixera_timelines_layer.',
    actions: {
      ref: {
        description: 'Returns the self-reference handle of this timeline (Pixera Control internal).',
        returns: 'handle',
      },
      removeThis: {
        description: 'Removes the timeline.',
        returns: 'null',
      },
      duplicateThis: {
        description: 'Duplicates the timeline and returns the handle of the copy.',
        params: { withoutClipsCues: { type: 'optional<bool>', desc: 'If true, the copy has no clips and cues (default false)' } },
        returns: 'handle',
      },
      selectThis: {
        description: 'Selects the timeline.',
        returns: 'null',
      },
      getZoomFactor: {
        description: 'Returns the zoom factor of the timeline.',
        returns: 'double',
      },
      setZoomFactor: {
        description: 'Sets the zoom factor of the timeline.',
        params: { zoomFactor: 'double' },
        returns: 'null',
      },
      getVerticalScrollOffset: {
        description: 'Returns the vertical scroll offset of the timeline.',
        returns: 'int',
      },
      setVerticalScrollOffset: {
        description: 'Sets the vertical scroll offset of the timeline.',
        params: { offset: 'int' },
        returns: 'null',
      },
      getHorizontalScrollOffset: {
        description: 'Returns the horizontal scroll offset of the timeline.',
        returns: 'int',
      },
      setHorizontalScrollOffset: {
        description: 'Sets the horizontal scroll offset of the timeline.',
        params: { offset: 'int' },
        returns: 'null',
      },
      moveInRenderOrder: {
        description: 'Moves the timeline one step up or down in the render order.',
        params: { moveDown: 'bool' },
        returns: 'null',
      },
      setRenderOrder: {
        description: 'Sets the render order index of the timeline.',
        params: { index: 'int' },
        returns: 'null',
      },
      getRenderOrder: {
        description: 'Returns the render order index of the timeline.',
        returns: 'int',
      },
      getLayers: {
        description: 'Returns handles to all layers of the timeline.',
        returns: 'handle[]',
      },
      getLayerFromName: {
        description: 'Returns the handle of the layer with the given name.',
        params: { name: 'string' },
        returns: 'handle',
      },
      getLayerNames: {
        description: 'Returns the names of all layers of the timeline.',
        returns: 'string[]',
      },
      getLayersSelected: {
        description: 'Returns handles to all selected layers of the timeline.',
        returns: 'handle[]',
      },
      selectLayerByIndex: {
        description: 'Selects the layer at the given zero-based index.',
        params: { index: { type: 'int', desc: 'Zero-based index in the order shown in the timeline UI' } },
        returns: 'null',
      },
      selectLayerByNames: {
        description: 'Selects the layers with the given names.',
        params: { layerNames: 'string[]' },
        returns: 'null',
      },
      getLayerAtIndex: {
        description: 'Returns the handle of the layer at the given zero-based index (order as shown in the timeline UI).',
        params: { index: { type: 'int', desc: 'Zero-based index in the order shown in the timeline UI' } },
        returns: 'handle',
      },
      createLayer: {
        description: 'Creates a layer and returns its handle.',
        returns: 'handle',
      },
      createCueLayer: {
        description: 'Creates a cue layer and returns its handle.',
        returns: 'handle',
      },
      createCompositingLayer: {
        description: 'Creates a compositing layer with a clip at time 0 for the given resource and returns its handle.',
        params: {
          resourceId: { type: 'double', desc: 'Id of the resource, from pixera_resources_resource getId (not the handle itself)' },
          sourceSpecifier: {
            type: 'string',
            desc: 'Source within the resource, meaning depends on resource type (e.g. Notch layer name); empty string if not needed',
          },
          sourceStreamIndex: { type: 'optional<int>', desc: 'Source stream index, only for resources with multiple streams' },
        },
        returns: 'handle',
      },
      createClipsFromJsonString: {
        description: 'Batch-creates clips on multiple layers from a JSON description.',
        params: { jsonString: 'string' },
        returns: 'string',
      },
      removeClipsFromJsonString: {
        description: 'Batch-removes clips described in a JSON string, as efficiently as possible.',
        params: { jsonString: 'string' },
        returns: 'null',
      },
      getCueInfosAsJsonString: {
        description: 'Returns the cue information of the timeline as a JSON string.',
        returns: 'string',
      },
      getCues: {
        description: 'Returns handles to all cues in chronological order.',
        returns: 'handle[]',
      },
      getCuesForLayerByName: {
        description: 'Returns handles to all cues of the cue layer with the given name, in chronological order.',
        params: { layerName: 'string' },
        returns: 'handle[]',
      },
      getCuesSelected: {
        description: 'Returns handles to all selected cues.',
        returns: 'handle[]',
      },
      getCueNames: {
        description: 'Returns the names of all cues.',
        returns: 'string[]',
      },
      getCueAtIndex: {
        description: 'Returns the handle of the cue at the given zero-based index (chronological order).',
        params: { index: { type: 'int', desc: 'Zero-based index, chronological order' } },
        returns: 'handle',
      },
      getCueFromName: {
        description: 'Returns the handle of the cue with the given name (first match if names repeat).',
        params: { name: 'string' },
        returns: 'handle',
      },
      getCueFromNumber: {
        description: 'DEPRECATED - use getCueFromNumberComponents. Returns the handle of the cue with the given number (first match).',
        params: { number: 'int' },
        returns: 'handle',
      },
      getCueFromNumberComponents: {
        description: 'Returns the handle of the cue with the given number components Main.Sub.Detail (first match).',
        params: {
          main: { type: 'int', desc: 'First number block of the cue' },
          sub: { type: 'int', desc: 'Second number block of the cue' },
          detail: { type: 'int', desc: 'Third number block of the cue' },
        },
        returns: 'handle',
      },
      applyCueWithName: {
        description: 'Jumps to and executes the cue with the given name.',
        params: {
          name: 'string',
          blendDuration: { type: 'optional<double>', desc: 'Blend duration in seconds' },
        },
        returns: 'null',
      },
      applyCueWithNumber: {
        description: 'DEPRECATED - use applyCueWithNumberComponents. Jumps to and executes the cue with the given number.',
        params: {
          number: 'int',
          blendDuration: { type: 'optional<double>', desc: 'Blend duration in seconds' },
        },
        returns: 'null',
      },
      applyCueWithNumberComponents: {
        description: 'Jumps to and executes the cue with the given number components Main.Sub.Detail.',
        params: {
          main: { type: 'int', desc: 'First number block of the cue' },
          sub: { type: 'int', desc: 'Second number block of the cue' },
          detail: { type: 'int', desc: 'Third number block of the cue' },
          blendDuration: { type: 'optional<double>', desc: 'Blend duration in seconds' },
        },
        returns: 'null',
      },
      applyCueWithNumberString: {
        description: "Jumps to and executes the cue with the given number string, e.g. '1.2.3'.",
        params: {
          numberStr: { type: 'string', desc: "Cue number as 'Main.Sub.Detail', e.g. '1.2.3'" },
          blendDuration: { type: 'optional<double>', desc: 'Blend duration in seconds' },
        },
        returns: 'null',
      },
      createCue: {
        description: 'Creates a cue and returns its handle.',
        params: {
          name: 'string',
          timeInFrames: { type: 'double', desc: 'Time on the timeline in frames' },
          operation: { type: 'int', desc: '1 = Play, 2 = Pause, 3 = Stop, 4 = Jump, 5 = Trigger' },
          cueLayerHandle: { type: 'handle', desc: 'Cue layer to create the cue on; pass 0 for the main cue layer' },
        },
        returns: 'handle',
      },
      removeCues: {
        description: 'Removes all cues of the timeline.',
        returns: 'null',
      },
      createPauseCueBeforeSelectedClips: {
        description: 'Creates a pause cue before the selected clips.',
        params: { cueLayerHandle: { type: 'handle', desc: 'Cue layer; 0 uses the main cue layer' } },
        returns: 'null',
      },
      play: {
        description: 'Starts the timeline at the current time.',
        returns: 'null',
      },
      pause: {
        description: 'Pauses the timeline at the current time.',
        returns: 'null',
      },
      stop: {
        description: 'Stops the timeline.',
        returns: 'null',
      },
      toggleTransport: {
        description: 'Toggles the transport mode between play and pause.',
        returns: 'null',
      },
      store: {
        description: 'Stores all dominant values as events at the current time.',
        returns: 'null',
      },
      storeAtClipStart: {
        description: 'Stores all dominant values at the start of each selected clip, clearing existing events first.',
        returns: 'null',
      },
      updateOrCreatePreviousEvent: {
        description: 'Updates the last event before the current position instead of creating a new one (adds one if none exists).',
        returns: 'null',
      },
      reset: {
        description: 'Resets all dominant values of the timeline.',
        returns: 'null',
      },
      getAttributes: {
        description: 'Returns the attributes of the timeline (TimelineAttributes struct).',
        returns: 'TimelineAttributes',
      },
      setCurrentFrame: {
        description: 'DEPRECATED - use setCurrentTime. Sets the current time in frames.',
        params: { time: { type: 'int', desc: 'Time in frames' } },
        returns: 'bool',
      },
      setCurrentTime: {
        description: 'Sets the current time of the timeline.',
        params: { time: { type: 'int', desc: 'Time in frames (use getFps to convert to seconds)' } },
        returns: 'null',
      },
      getCurrentTime: {
        description: 'Returns the current time of the timeline.',
        returns: 'int',
      },
      scrubCurrentTime: {
        description: 'Scrubs the current time up or down by the given number of frames.',
        params: { frames: { type: 'int', desc: 'Frames to move; negative values scrub backwards' } },
        returns: 'null',
      },
      CurrentTime: {
        description: 'Returns the current time and, if doSet is true, sets it to time first.',
        params: {
          time: { type: 'int', desc: 'Time in frames' },
          doSet: { type: 'bool', desc: 'If true, set the timeline time to time before returning' },
        },
        returns: 'int',
      },
      getCurrentHMSF: {
        description: 'Returns the current time as an hours:minutes:seconds:frames string.',
        returns: 'string',
      },
      setTransportMode: {
        description: 'Sets the transport mode of the timeline.',
        params: { mode: { type: 'int', desc: '1 = Play, 2 = Pause, 3 = Stop' } },
        returns: 'bool',
      },
      getTransportMode: {
        description: 'Returns the transport mode of the timeline.',
        returns: 'int',
      },
      setTimecodeInput: {
        description: 'DEPRECATED - use setTimecodeInput under Compound. Sets timecode input for MIDI and Art-Net timecode.',
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
      getFps: {
        description: 'Returns the frames per second of the timeline (time base).',
        returns: 'double',
      },
      getName: {
        description: 'Returns the name of the timeline.',
        returns: 'string',
      },
      setName: {
        description: 'Renames the timeline.',
        params: { name: 'string' },
        returns: 'null',
      },
      moveToNextCue: {
        description: 'Moves to the next cue on the timeline.',
        returns: 'null',
      },
      moveToNextCueIgnoreProperties: {
        description: 'Moves to the next cue on the timeline, ignoring cue properties.',
        returns: 'null',
      },
      getCueNext: {
        description: 'Returns the handle of the next cue on the timeline.',
        returns: 'handle',
      },
      moveToPreviousCue: {
        description: 'Moves to the previous cue on the timeline.',
        returns: 'null',
      },
      moveToPreviousCueIgnoreProperties: {
        description: 'Moves to the previous cue on the timeline, ignoring cue properties.',
        returns: 'null',
      },
      getCuePrevious: {
        description: 'Returns the handle of the previous cue on the timeline.',
        returns: 'handle',
      },
      ignoreNextCue: {
        description: 'Toggles whether the next scheduled cue is ignored when reached (all cues at the same timestamp).',
        returns: 'null',
      },
      ignoreNextCueWithOperation: {
        description: 'Toggles whether the next scheduled cue with the given operation is ignored when reached.',
        params: { cueOperation: { type: 'int', desc: '1 = Play, 2 = Pause, 3 = Stop, 4 = Jump, 5 = Trigger' } },
        returns: 'null',
      },
      blendToTime: {
        description: 'Fades from the current time to goalTime over blendDuration.',
        params: {
          goalTime: { type: 'double', desc: 'Target time in frames' },
          blendDuration: { type: 'double', desc: 'Blend duration (documented unit not stated; see Pixera docs)' },
          preloadDelayInMilliseconds: { type: 'optional<int>', desc: 'Preload delay in ms; system default if omitted' },
        },
        returns: 'null',
      },
      blendToTimeWithTransportMode: {
        description: 'Fades from the current time to goalTime and sets the transport mode at goal time to play or pause.',
        params: {
          goalTime: { type: 'double', desc: 'Target time in frames' },
          blendDuration: { type: 'double', desc: 'Blend duration (documented unit not stated; see Pixera docs)' },
          transportMode: { type: 'int', desc: 'Transport mode at goal time: 1 = Play, 2 = Pause' },
          preloadDelayInMilliseconds: { type: 'optional<int>', desc: 'Preload delay in ms; system default if omitted' },
        },
        returns: 'null',
      },
      setBlendToTimeMode: {
        description: 'Sets the blend-to-time mode.',
        params: { mode: { type: 'int', desc: '1 = Cross fade, 2 = Dip to transparent' } },
        returns: 'bool',
      },
      setSpeedFactor: {
        description: 'Sets the speed factor of the timeline (must be > 0); prefer per-layer transport parameters.',
        params: { factor: 'double' },
        returns: 'null',
      },
      getSpeedFactor: {
        description: 'Returns the speed factor of the timeline.',
        returns: 'double',
      },
      setOpacity: {
        description: 'Sets the opacity of the timeline.',
        params: { value: { type: 'double', desc: 'Opacity, 0.0 to 1.0' } },
        returns: 'null',
      },
      getOpacity: {
        description: 'Returns the opacity of the timeline.',
        returns: 'double',
      },
      startOpacityAnimation: {
        description: 'Starts an opacity fade in (to 1) or out (to 0) from the current opacity.',
        params: {
          fadeIn: 'bool',
          fullFadeDuration: { type: 'double', desc: 'Duration of a full 0-to-1 fade in frames; a partial fade is shorter proportionally' },
        },
        returns: 'null',
      },
      setSmpteMode: {
        description: 'Sets the SMPTE timecode mode.',
        params: { mode: { type: 'int', desc: '0 = None, 1 = Receive, 2 = Send' } },
        returns: 'null',
      },
      getSmpteMode: {
        description: 'Returns the SMPTE timecode mode.',
        returns: 'int',
      },
      storeRecordedValues: {
        description: 'Stores the recorded dominant values using the current settings.',
        returns: 'null',
      },
      setSmpteInputBehaviour: {
        description: 'Sets how the timeline reacts to SMPTE timecode input.',
        params: { mode: { type: 'int', desc: '1 = Continue, 2 = Pause, 3 = Stop' } },
        returns: 'null',
      },
      getSmpteInputBehaviour: {
        description: 'Returns the SMPTE timecode input behaviour.',
        returns: 'int',
      },
      setSmpteOffset: {
        description: 'Sets the SMPTE timecode offset.',
        params: { time: 'double' },
        returns: 'null',
      },
      getSmpteOffset: {
        description: 'Returns the SMPTE timecode offset.',
        returns: 'double',
      },
      resetRecordedValues: {
        description: 'Clears the recorded dominant values and resets the reference time.',
        returns: 'null',
      },
      getTimelineInfosAsJsonString: {
        description: 'Returns timeline information as JSON: name, fps, opacity, index, SMPTE and transport mode, current time, previous/current/next cue.',
        returns: 'string',
      },
      startPreviewEdit: {
        description: 'Starts preview editing and sets the preview nowpointer to goalTime.',
        params: { goalTime: { type: 'double', desc: 'Preview nowpointer time in frames' } },
        returns: 'null',
      },
      endPreviewEdit: {
        description: 'Ends preview editing.',
        params: {
          moveToPreview: { type: 'bool', desc: 'If true, normal playback moves to the preview nowpointer' },
          blendDurationInMs: {
            type: 'optional<int>',
            desc: 'Blend duration; the parameter name says ms but the docs say frames. If omitted, the settings value is used',
          },
        },
        returns: 'null',
      },
      setCurrentPreviewEditTime: {
        description: 'Sets the time of the preview edit nowpointer (no effect when preview editing is not running).',
        params: { time: { type: 'int', desc: 'Time in frames' } },
        returns: 'null',
      },
      setCurrentPreviewEditTimeToCueTime: {
        description: 'Moves the preview edit nowpointer to the time of the cue with the given number.',
        params: { cueNumber: 'int' },
        returns: 'null',
      },
      getCurrentPreviewEditTime: {
        description: 'Returns the time of the preview edit nowpointer in frames (0 if preview editing is not running).',
        returns: 'int',
      },
      setPreviewEditTransportMode: {
        description: 'Sets the transport mode of the preview edit nowpointer (no effect when preview editing is not running).',
        params: { mode: { type: 'int', desc: '1 = Play, 2 = Pause, 3 = Stop' } },
        returns: 'bool',
      },
      getPreviewEditTransportMode: {
        description: 'Returns the transport mode of the preview edit nowpointer (0 if not preview editing or on error).',
        returns: 'int',
      },
      setRenderOnTopAtPlay: {
        description: 'Sets the render-on-top-at-play mode of the timeline.',
        params: { mode: { type: 'int', desc: '1 = On, 2 = Off, 3 = Exclude (not occluded if topmost)' } },
        returns: 'null',
      },
      getRenderOnTopAtPlay: {
        description: 'Returns the render-on-top-at-play mode of the timeline.',
        returns: 'int',
      },
      setPreviewSolo: {
        description: 'Enables or disables preview solo: when enabled, only this timeline is included in preview.',
        params: { enable: 'bool' },
        returns: 'null',
      },
      getPreviewSolo: {
        description: 'Returns true if this timeline is in preview solo mode.',
        returns: 'bool',
      },
      addHotRegion: {
        description: 'Adds a hot region to the timeline.',
        params: {
          hotRegionName: 'string',
          startTime: { type: 'double', desc: 'Start time of the region' },
          duration: { type: 'double', desc: 'Duration of the region' },
          smpteTime: { type: 'optional<double>', desc: 'Optional SMPTE time' },
        },
        returns: 'null',
      },
      removeHotRegion: {
        description: 'Removes the hot region with the given name.',
        params: { hotRegionName: 'string' },
        returns: 'null',
      },
      setHotRegionProperties: {
        description: 'Changes start time, duration and/or SMPTE time of a hot region; omitted values stay unchanged.',
        params: {
          hotRegionName: 'string',
          newStartTime: 'optional<double>',
          newDuration: 'optional<double>',
          newSmpteTime: 'optional<double>',
        },
        returns: 'null',
      },
      setHotRegionIsMuted: {
        description: 'Mutes or unmutes a hot region.',
        params: { hotRegionName: 'string', isMuted: 'bool' },
        returns: 'null',
      },
      getHotRegionIsMuted: {
        description: 'Returns whether a hot region is muted.',
        params: { hotRegionName: 'string' },
        returns: 'bool',
      },
      multiUserPush: {
        description: 'Pushes this timeline to the other multi-user members.',
        returns: 'null',
      },
      multiUserPull: {
        description: 'Pulls this timeline from the multi-user member with the given source IP address.',
        params: { sourceIp: 'string' },
        returns: 'null',
      },
      getInst: {
        description: 'Returns the handle for the given instance path.',
        params: { instancePath: 'string' },
        returns: 'handle',
      },
      getHandleFromInstancePath: {
        description: 'Returns the handle for the given instance path.',
        params: { instancePath: 'string' },
        returns: 'handle',
      },
      getInstancePath: {
        description: 'Returns the instance path of this timeline.',
        returns: 'string',
      },
      setTimelineLocked: {
        description: 'Locks or unlocks the timeline; locking also locks its layers and groups.',
        params: { locked: 'bool' },
        returns: 'null',
      },
      getIsTimelineLocked: {
        description: 'Returns whether the timeline is locked.',
        returns: 'bool',
      },
    },
  },
  {
    scope: 'Pixera.Timelines.Layer',
    isClass: true,
    title: 'Pixera timeline layer (object)',
    description:
      'A layer of a timeline: clips, dominant values (opacity, volume, color, transport, playback speed), resource assignment, ' +
      'mute/lock, screen and origin settings, offsets and FX. ' +
      'Get a handle via pixera_timelines_timeline action getLayerAtIndex, getLayerFromName or createLayer (or getLayers / createCompositingLayer). ' +
      'Clips of a layer are handled via the clip handles returned by createClip / getClips.',
    actions: {
      ref: {
        description: 'Returns the self-reference handle of this layer (Pixera Control internal).',
        returns: 'handle',
      },
      removeThis: {
        description: 'Removes the layer.',
        returns: 'null',
      },
      getNodes: {
        description: 'Returns handles to the nodes directly below the layer.',
        returns: 'handle[]',
      },
      getParameters: {
        description: 'Returns handles to the parameters that are direct children of the layer.',
        returns: 'handle[]',
      },
      getNodeWithName: {
        description: "Returns the node directly below the layer with the given UI name (e.g. 'Position').",
        params: { name: 'string' },
        returns: 'handle',
      },
      getParamWithName: {
        description: "Returns the parameter that is a direct child of the layer with the given name (e.g. 'Transport').",
        params: { name: 'string' },
        returns: 'handle',
      },
      getSpatialParametersAtTime: {
        description: 'Returns position, rotation and scale (9 values) of the layer as set by the clip at the given time; empty if no clip.',
        params: { time: { type: 'double', desc: 'Time in frames' } },
        returns: 'double[]',
      },
      getTimeline: {
        description: 'Returns the handle of the parent timeline.',
        returns: 'handle',
      },
      setName: {
        description: 'Sets the name of the layer.',
        params: { name: 'string' },
        returns: 'null',
      },
      getName: {
        description: 'Returns the name of the layer.',
        returns: 'string',
      },
      resetLayer: {
        description: 'Resets all dominant parameters of the layer; output is then determined by default values, keys and clips.',
        returns: 'null',
      },
      getLayerJsonDescrip: {
        description: 'Returns a JSON string with the current state of the layer: parameter values and min/max, volume, opacity, media, transport and mute states.',
        returns: 'string',
      },
      setLayerJsonDescrip: {
        description: 'Sets all parameter values of the layer from a JSON description.',
        params: {
          descrip: { type: 'string', desc: 'JSON layer description (as returned by getLayerJsonDescrip)' },
          makeAllDominant: { type: 'bool', desc: 'If true, the values set become dominant' },
        },
        returns: 'null',
      },
      getJsonDescrip: {
        description: 'Returns the JSON description of the layer.',
        returns: 'string',
      },
      initFromJsonDescrip: {
        description: 'Initializes the layer from a JSON description.',
        params: { descrip: 'string' },
        returns: 'null',
      },
      resetColor: {
        description: 'Resets the layer color to its default value.',
        returns: 'null',
      },
      setColor: {
        description: 'Sets the layer color from red, green and blue values.',
        params: {
          red: { type: 'int', desc: '0..255' },
          green: { type: 'int', desc: '0..255' },
          blue: { type: 'int', desc: '0..255' },
        },
        returns: 'null',
      },
      getColor: {
        description: 'Returns the layer color as [red, green, blue] (0..255).',
        returns: 'int[]',
      },
      setOpacity: {
        description: 'Sets the opacity of the layer, optionally fading over fadeTimeMs.',
        params: {
          value: { type: 'double', desc: 'Opacity, 0.0 to 1.0' },
          fadeTimeMs: { type: 'optional<int>', desc: 'Fade time in milliseconds' },
        },
        returns: 'null',
      },
      getOpacity: {
        description: 'Returns the opacity of the layer.',
        returns: 'double',
      },
      resetOpacity: {
        description: 'Resets the dominant opacity of the layer.',
        returns: 'null',
      },
      setVolume: {
        description: 'Sets the volume of the layer, optionally fading over fadeTimeMs.',
        params: {
          value: { type: 'double', desc: 'Volume level' },
          fadeTimeMs: { type: 'optional<int>', desc: 'Fade time in milliseconds' },
        },
        returns: 'null',
      },
      getVolume: {
        description: 'Returns the volume of the layer.',
        returns: 'double',
      },
      resetVolume: {
        description: 'Resets the dominant volume of the layer.',
        returns: 'null',
      },
      muteLayer: {
        description: 'Mutes the layer.',
        returns: 'null',
      },
      unMuteLayer: {
        description: 'Un-mutes the layer.',
        returns: 'null',
      },
      getIsLayerMuted: {
        description: 'Returns whether the layer is muted.',
        returns: 'bool',
      },
      setLayerLocked: {
        description: 'Locks or unlocks the layer.',
        params: { locked: 'bool' },
        returns: 'null',
      },
      getIsLayerLocked: {
        description: 'Returns whether the layer is locked.',
        returns: 'bool',
      },
      muteAudio: {
        description: 'Mutes the audio of the layer.',
        returns: 'null',
      },
      unMuteAudio: {
        description: 'Un-mutes the audio of the layer.',
        returns: 'null',
      },
      getIsAudioMuted: {
        description: 'Returns whether the audio of the layer is muted.',
        returns: 'bool',
      },
      getDmxMuteState: {
        description: 'Returns the DMX mute state as a bitmask over the layer FX (0 = none, 8388607 = all).',
        returns: 'int',
      },
      setDmxMuteState: {
        description: 'Sets the DMX mute state as a bitmask over the layer FX.',
        params: {
          muteState: {
            type: 'uint',
            desc: 'Bitmask: Transport 1, Opacity 2, Position 4, Rotation 8, Scale 16, FxStart 32, FxEnd 4194304, FxAll 8388576, All 8388607, None 0',
          },
        },
        returns: 'null',
      },
      toggleExplicitMute: {
        description: 'Toggles the explicit mute state for the given FX bitmask flag.',
        params: { flag: { type: 'uint', desc: 'FX bitmask flag, see setDmxMuteState' } },
        returns: 'null',
      },
      setTransport: {
        description: 'Sets the mode and loop state of the layer transport parameter.',
        params: { mode: 'int', loop: 'bool' },
        returns: 'null',
      },
      getTransportMode: {
        description: 'Returns the mode of the layer transport parameter.',
        returns: 'int',
      },
      resetTransportMode: {
        description: 'Resets the dominant state of the layer transport parameter.',
        returns: 'null',
      },
      getTransportLoop: {
        description: 'Returns whether the layer transport parameter loops.',
        returns: 'bool',
      },
      setTransportPingPong: {
        description: 'Sets the ping-pong state of the layer transport parameter.',
        params: { doPingPong: 'bool' },
        returns: 'null',
      },
      getTransportPingPong: {
        description: 'Returns the ping-pong state of the layer transport parameter.',
        returns: 'bool',
      },
      setPlaybackSpeed: {
        description: 'Sets the playback speed of the layer.',
        params: { speed: 'double' },
        returns: 'null',
      },
      getPlaybackSpeed: {
        description: 'Returns the playback speed of the layer.',
        returns: 'double',
      },
      assignResource: {
        description: 'Assigns a resource to the layer as a dominant value, independent of its clips.',
        params: { id: { type: 'double', desc: 'Resource id from the resource getId (not the handle itself)' } },
        returns: 'null',
      },
      assignResourceWithFade: {
        description: 'Assigns a resource to the layer as a dominant value, fading over fadeDuration.',
        params: {
          id: { type: 'double', desc: 'Resource id from the resource getId (not the handle itself)' },
          fadeDuration: { type: 'double', desc: 'Fade duration in seconds; 0 = no fade' },
        },
        returns: 'null',
      },
      getAssignedResource: {
        description: 'Returns the handle of the resource currently assigned to the layer.',
        returns: 'handle',
      },
      resetAssignedResource: {
        description: 'Resets the dominant resource of the layer; output is then determined by its clips.',
        returns: 'null',
      },
      getAssignedModelResource: {
        description: 'Returns the handle of the model resource assigned to the layer.',
        returns: 'handle',
      },
      resetAssignedModelResource: {
        description: 'Resets the model resource assigned to the layer.',
        returns: 'null',
      },
      getFxNames: {
        description: 'Returns the names of the FX assigned to the layer.',
        returns: 'string[]',
      },
      setFadeDurationDominantResourceChange: {
        description: 'Sets the fade duration applied when the dominant resource of the layer changes.',
        params: { value: { type: 'double', desc: 'Duration in seconds' } },
        returns: 'null',
      },
      getFadeDurationDominantResourceChange: {
        description: 'Returns the fade duration applied when the dominant resource of the layer changes.',
        returns: 'double',
      },
      createClip: {
        description: 'Creates a clip at the current time and returns its handle.',
        returns: 'handle',
      },
      createClipAtTime: {
        description: 'Creates a clip at the given time and returns its handle.',
        params: { timeInFrames: { type: 'double', desc: 'Time in frames' } },
        returns: 'handle',
      },
      controlClipBorder: {
        description: "Controls the entry border of a clip on this layer (see Pixera docs for 'isEnter', 'isIncremental' and 'entryTime').",
        params: {
          clip: 'handle',
          isEnter: 'bool',
          isIncremental: 'bool',
          entryTime: 'double',
        },
        returns: 'null',
      },
      getClipAtIndex: {
        description: 'Returns the handle of the clip at the given zero-based index.',
        params: { index: { type: 'int', desc: 'Zero-based index' } },
        returns: 'handle',
      },
      getClips: {
        description: 'Returns handles to all clips of the layer.',
        returns: 'handle[]',
      },
      getClipCurrent: {
        description: 'Returns the handle of the current clip, optionally offset from it.',
        params: { offset: { type: 'optional<int>', desc: 'Offset relative to the current clip' } },
        returns: 'handle',
      },
      getClipsSelected: {
        description: 'Returns handles to all selected clips of the layer.',
        returns: 'handle[]',
      },
      removeClips: {
        description: 'Removes all clips of the layer.',
        returns: 'null',
      },
      setHomeScreenFromScreenName: {
        description: 'Sets the screen with the given name as the home screen of the layer.',
        params: { screenName: 'string' },
        returns: 'null',
      },
      getHomeScreenName: {
        description: 'Returns the name of the home screen of the layer.',
        returns: 'string',
      },
      setScaleUnitMode: {
        description: 'Sets how the layer is scaled to its home screen.',
        params: {
          mode: { type: 'int', desc: '1 = Fill Home Screen, 2 = Fit Home Screen, 3 = Stretch to Home Screen, 4 = Resource Resolution, 5 = Used 3D Object (1:1)' },
        },
        returns: 'null',
      },
      getScaleUnitMode: {
        description: 'Returns how the layer is scaled to its home screen.',
        returns: 'int',
      },
      setRenderOnlyOnHomeScreen: {
        description: 'Sets whether the layer is rendered only on its home screen.',
        params: { onlyOnHomeScreen: 'bool' },
        returns: 'null',
      },
      getRenderOnlyOnHomeScreen: {
        description: 'Returns whether the layer is rendered only on its home screen.',
        returns: 'bool',
      },
      setOrigin: {
        description: 'Sets the origin of the layer.',
        params: { origin: { type: 'int', desc: '1 = Home Screen, 2 = Absolute, 3 = Perspective Position' } },
        returns: 'null',
      },
      getOrigin: {
        description: 'Returns the origin of the layer.',
        returns: 'int',
      },
      setScreenGroupPresence: {
        description: 'Sets the screen groups the layer is present on, by handle.',
        params: { screenGroups: 'handle[]' },
        returns: 'null',
      },
      getScreenGroupPresence: {
        description: 'Returns handles to the screen groups the layer is present on.',
        returns: 'handle[]',
      },
      setScreenGroupPresenceByName: {
        description: 'Sets the screen groups the layer is present on, by name.',
        params: { screenGroupNames: 'string[]' },
        returns: 'null',
      },
      getScreenGroupPresenceNames: {
        description: 'Returns the names of the screen groups the layer is present on.',
        returns: 'string[]',
      },
      set2dOrientedTransformation: {
        description: "Sets the '2d Oriented Transformation' property of the layer.",
        params: { use2dOriented: 'bool' },
        returns: 'null',
      },
      get2dOrientedTransformation: {
        description: "Returns the '2d Oriented Transformation' property of the layer.",
        returns: 'bool',
      },
      setBlendMode: {
        description: 'Sets the blend mode of the layer by name.',
        params: { blendMode: 'string' },
        returns: 'null',
      },
      getBlendMode: {
        description: 'Returns the blend mode of the layer.',
        returns: 'string',
      },
      addEffectById: {
        description: 'Adds an effect to the layer by resource id.',
        params: { id: { type: 'double', desc: 'Resource id of the effect (from the resource getId)' } },
        returns: 'null',
      },
      setPreloadPermanently: {
        description: 'DEPRECATED since API revision 509 - set preload per clip. Applies the setting to all clips of the layer.',
        params: { doPreloadPermanently: 'bool' },
        returns: 'null',
      },
      getPreloadPermanently: {
        description: 'DEPRECATED since API revision 509 - returns true if any clip has preload permanently set for at least one service.',
        returns: 'bool',
      },
      setRestrictToServiceWithIps: {
        description: 'Restricts the layer to the services with the given IP addresses (or lifts the restriction).',
        params: { doRestrict: 'bool', ipAdresses: 'string[]' },
        returns: 'null',
      },
      getRestrictToService: {
        description: 'Returns whether the layer is restricted to specific services.',
        returns: 'bool',
      },
      getRestrictedServiceIps: {
        description: 'Returns the IP addresses of the services the layer is restricted to.',
        returns: 'string[]',
      },
      getOffsets: {
        description: 'Returns the layer offsets.',
        returns: 'double[]',
      },
      setOffsets: {
        description: 'Sets the layer offsets; omitted values stay unchanged.',
        params: {
          x: 'optional<double>',
          y: 'optional<double>',
          z: 'optional<double>',
          xr: 'optional<double>',
          yr: 'optional<double>',
          zr: 'optional<double>',
          xScale: 'optional<double>',
          yScale: 'optional<double>',
          zScale: 'optional<double>',
        },
        returns: 'null',
      },
      setCurrentValuesToOffset: {
        description: 'Copies the current dominant or clip value of position, rotation or scale into the offset.',
        params: {
          typeIndex: { type: 'int', desc: '0 = position, 1 = rotation, 2 = scale' },
          resetDominant: { type: 'optional<bool>', desc: 'Reset the dominant value afterwards (default false)' },
          removeKeyframesClips: { type: 'optional<bool>', desc: 'Remove keyframes/clips afterwards (default false)' },
        },
        returns: 'null',
      },
      setRenderOrder: {
        description: 'Sets the render order index of the layer within its timeline.',
        params: { index: { type: 'int', desc: '0 = top; -1 = send to last' } },
        returns: 'null',
      },
      getRenderOrder: {
        description: 'Returns the render order index of the layer (0 = top).',
        returns: 'int',
      },
      getInst: {
        description: 'Returns the handle for the given instance path.',
        params: { instancePath: 'string' },
        returns: 'handle',
      },
      getHandleFromInstancePath: {
        description: 'Returns the handle for the given instance path.',
        params: { instancePath: 'string' },
        returns: 'handle',
      },
      getInstancePath: {
        description: 'Returns the instance path of this layer.',
        returns: 'string',
      },
      executeJavaScriptOnCurrentWebResource: {
        description: 'Executes JavaScript on the current web resource of the layer.',
        params: { script: 'string' },
        returns: 'null',
      },
    },
  },
];
