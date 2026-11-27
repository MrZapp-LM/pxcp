import type { ToolGroup } from '../types.js';

// Area module - system: Pixera.Network (+Conveyor), Pixera.Session, Pixera.Settings.*,
// Pixera.Calibration, Pixera.WebViews, Pixera.Ui (+ComboBox, Control, PreviewCameras,
// PreviewCamera), Pixera.Direct (+Projector, Screen, Param, Camera, Perspective).
// Template: src/tools/utility.ts.
export const groups: ToolGroup[] = [
  {
    scope: 'Pixera.Network',
    isClass: false,
    title: 'Pixera network',
    description:
      'Network conveyors of the Pixera system. Get a Conveyor handle via pixera_network action getConveyor; ' +
      'use it with pixera_network_conveyor.',
    actions: {
      getConveyor: {
        description: 'Returns the handle of the network conveyor with the given name.',
        params: { conveyorName: 'string' },
        returns: 'handle',
      },
    },
  },
  {
    scope: 'Pixera.Network.Conveyor',
    isClass: true,
    title: 'Pixera network conveyor (object)',
    description:
      'A network conveyor: send a string and activate or deactivate it. ' +
      'Get a handle via pixera_network action getConveyor.',
    actions: {
      sendString: {
        description: 'Sends a string over the conveyor.',
        params: { str: 'string' },
        returns: 'null',
      },
      setIsActive: {
        description: 'Activates or deactivates the conveyor.',
        params: { isActive: 'bool' },
        returns: 'null',
      },
      getIsActive: {
        description: 'Returns whether the conveyor is active.',
        returns: 'bool',
      },
    },
  },
  {
    scope: 'Pixera.Session',
    isClass: false,
    title: 'Pixera session',
    description:
      'Session and project control: load, save, rename and close projects, shut down the system, ' +
      'live and remote system state (start, stop, restart, wake), video stream state and output identification.',
    actions: {
      closeApp: {
        description: 'Closes the Pixera application, optionally saving the project first.',
        params: { saveProject: 'bool' },
        returns: 'null',
      },
      loadProject: {
        description: 'Loads the project at the given path.',
        params: { path: { type: 'string', desc: 'Path of the project file on the Pixera machine' } },
        returns: 'null',
      },
      saveProject: {
        description: 'Saves the current project.',
        returns: 'null',
      },
      saveProjectAs: {
        description: 'Saves the current project under the given path.',
        params: { path: { type: 'string', desc: 'Path of the project file on the Pixera machine' } },
        returns: 'null',
      },
      getProjectName: {
        description: 'Returns the name of the current project.',
        returns: 'string',
      },
      setProjectName: {
        description: 'Sets the name of the current project.',
        params: { name: 'string' },
        returns: 'null',
      },
      getProjectDirectory: {
        description: 'Returns the directory of the current project.',
        returns: 'string',
      },
      getControlMultiUserSessionName: {
        description: 'Returns the name of the multi-user session this Pixera Control belongs to.',
        returns: 'string',
      },
      multiUserPushProject: {
        description: 'Pushes the project to the other multi-user members.',
        params: { apEntityThisHandle: 'handle' },
        returns: 'null',
      },
      multiUserPullProject: {
        description: 'Pulls the resource folder from the multi-user member with the given IP address.',
        params: {
          apEntityThisHandle: 'handle',
          sourceIp: { type: 'string', desc: 'IP address of the source multi-user member' },
        },
        returns: 'null',
      },
      shutdownSystem: {
        description: 'Shuts down the local machine, optionally powering off or rebooting it.',
        params: {
          mode: { type: 'optional<int>', desc: '1 = shut down (default), 2 = shut down and power off (if supported), 3 = shut down and reboot' },
        },
        returns: 'null',
      },
      getLiveSystemIps: {
        description: 'Returns the IP addresses of all live systems.',
        returns: 'string[]',
      },
      getLiveSystemState: {
        description: 'Returns the state of the live system with the given IP address.',
        params: { ip: 'string' },
        returns: 'string',
      },
      liveSystemStateChange: {
        description: 'Notifies Pixera Control that the state of a live system changed (called by Pixera itself).',
        params: { ip: 'string', state: 'string' },
        returns: 'null',
      },
      shutdownLiveSystem: {
        description: 'Shuts down the live system with the given IP address, optionally powering off or rebooting it.',
        params: {
          ip: 'string',
          mode: { type: 'optional<int>', desc: '1 = shut down (default), 2 = shut down and power off (if supported), 3 = shut down and reboot' },
        },
        returns: 'null',
      },
      wakeLiveSystem: {
        description: 'Wakes the live system that last had the given IP address, using its last reported MAC address.',
        params: { ip: 'string' },
        returns: 'string',
      },
      getLiveSystemMacAddress: {
        description: 'Returns the last MAC address reported for the live system with the given IP address.',
        params: { ip: 'string' },
        returns: 'string',
      },
      startLiveSystem: {
        description: 'Starts the live system with the given IP address.',
        params: { ip: 'string' },
        returns: 'null',
      },
      startLiveSystems: {
        description: 'Starts all live systems in the mapping/live sub-tab.',
        returns: 'null',
      },
      stopLiveSystem: {
        description: 'Stops the live system with the given IP address.',
        params: { ip: 'string' },
        returns: 'null',
      },
      stopLiveSystems: {
        description: 'Stops all live systems in the mapping/live sub-tab.',
        returns: 'null',
      },
      restartLiveSystem: {
        description: 'Restarts the live system with the given IP address.',
        params: { ip: 'string' },
        returns: 'null',
      },
      restartLiveSystems: {
        description: 'Restarts all live systems in the mapping/live sub-tab.',
        returns: 'null',
      },
      remoteSystemStateChange: {
        description: 'Notifies Pixera that the state of a remote system changed (run by remote heartbeat tracking).',
        params: { ip: 'string', state: 'string' },
        returns: 'null',
      },
      getRemoteSystemIps: {
        description: 'Returns the IP addresses of all remote systems.',
        returns: 'string[]',
      },
      getRemoteSystemState: {
        description: 'Returns the state of the remote system with the given IP address.',
        params: { ip: 'string' },
        returns: 'string',
      },
      setVideoStreamActiveState: {
        description: 'Activates or deactivates a video stream of a device on the given system.',
        params: { ip: 'string', device: 'string', isActive: 'bool' },
        returns: 'null',
      },
      getVideoStreamActiveState: {
        description: 'Returns whether a video stream of a device on the given system is active.',
        params: { ip: 'string', device: 'string' },
        returns: 'bool',
      },
      getDefaultClipDurationsAsJsonString: {
        description: 'Returns the default clip durations as a JSON string.',
        returns: 'string',
      },
      toggleOutputIdentification: {
        description: 'Toggles the output identification overlay.',
        returns: 'null',
      },
      toggleOnScreenStats: {
        description: 'Toggles the on-screen statistics.',
        returns: 'null',
      },
      setAllAssignedOutputs: {
        description: 'Activates or deactivates all assigned outputs.',
        params: { active: 'bool' },
        returns: 'null',
      },
    },
  },
  {
    scope: 'Pixera.Settings.SettingsGeneral',
    isClass: false,
    title: 'Pixera general settings',
    description:
      'General Pixera settings: whether node values are in pixels or scale is shown as size, ' +
      'and the default duration and delay used when fading to a time or cue.',
    actions: {
      getShowDimsInPixels: {
        description: 'Returns whether node transformation and scale values (Node::setValues) are in pixels.',
        returns: 'bool',
      },
      getShowScaleAsSize: {
        description: 'Returns whether nodes use size instead of scale.',
        returns: 'bool',
      },
      setFadeToTimeDuration: {
        description: 'Sets the default duration of a fade to a time or a cue.',
        params: { timeInMilliseconds: { type: 'int', desc: 'Duration in milliseconds' } },
        returns: 'null',
      },
      getFadeToTimeDuration: {
        description: 'Returns the default duration of a fade to a time or a cue, in milliseconds.',
        returns: 'int',
      },
      setFadeToTimeDelay: {
        description: 'Sets the default delay after which a fade to a time or a cue starts.',
        params: { timeInMilliseconds: { type: 'int', desc: 'Delay in milliseconds' } },
        returns: 'null',
      },
      getFadeToTimeDelay: {
        description: 'Returns the default delay before a fade to a time or a cue starts, in milliseconds.',
        returns: 'int',
      },
    },
  },
  {
    scope: 'Pixera.Settings.SettingsTranscoding',
    isClass: false,
    title: 'Pixera transcoding settings',
    description:
      'Transcoding presets. Each preset is a JSON string (name, container, codec, resolution, fps, compression, crop).',
    actions: {
      getTranscodingPresets: {
        description: 'Returns all transcoding presets as JSON strings.',
        returns: 'string[]',
      },
      addOrChangeTranscodingPreset: {
        description: 'Changes the transcoding preset with the same name to the given setup, or creates it if it does not exist.',
        params: { preset: { type: 'string', desc: 'Preset as a JSON string, as returned by getTranscodingPresets' } },
        returns: 'null',
      },
    },
  },
  {
    scope: 'Pixera.Settings.SettingsResourceDistribution',
    isClass: false,
    title: 'Pixera resource distribution settings',
    description: 'Automatic distribution rule for newly added resources across live systems.',
    actions: {
      setAutoDistributionRule: {
        description: 'Sets the automatic distribution rule for newly added resources.',
        params: { rule: { type: 'int', desc: '0 = none, 1 = on import, 2 = on use' } },
        returns: 'null',
      },
      getAutoDistributionRule: {
        description: 'Returns the automatic distribution rule for newly added resources.',
        returns: 'int',
      },
    },
  },
  {
    scope: 'Pixera.Calibration',
    isClass: false,
    title: 'Pixera calibration',
    description: 'Projector calibration with externally measured marker positions.',
    actions: {
      setMarkerPositions: {
        description: 'Sets the world-space marker positions for projector calibration from external data.',
        params: {
          positions: { type: 'double[]', desc: 'Flat list of world-space marker coordinates: x1,y1,z1,x2,y2,z2,...' },
          markerIds: { type: 'int[]', desc: 'Unique integer id per marker, in the same order as the positions' },
        },
        returns: 'null',
      },
    },
  },
  {
    scope: 'Pixera.WebViews',
    isClass: false,
    title: 'Pixera web views',
    description:
      'Web view control of the device and function UI: load a device UI, activate functions, read and set function ' +
      'body state, and set tags.',
    actions: {
      loadDeviceUi: {
        description: 'Loads the UI of the device with the given path.',
        params: { devicePath: 'string' },
        returns: 'null',
      },
      activatePreviousFunc: {
        description: 'Activates the previous function.',
        returns: 'null',
      },
      activateNextFunc: {
        description: 'Activates the next function.',
        returns: 'null',
      },
      getLastActivatedFunc: {
        description: 'Returns the path of the last activated function.',
        returns: 'string',
      },
      deviceActivated: {
        description: 'Notifies the web view that a device was activated.',
        params: {
          devicePath: 'string',
          withSelection: { type: 'bool', desc: 'Whether the activation carries a selection' },
        },
        returns: 'null',
      },
      funcActivated: {
        description: 'Notifies the web view that a function was activated.',
        params: {
          funcPath: 'string',
          withSelection: { type: 'bool', desc: 'Whether the activation carries a selection' },
        },
        returns: 'null',
      },
      setFuncBodyState: {
        description: 'Sets the body state of the function with the given path.',
        params: { funcPath: 'string', state: 'string' },
        returns: 'null',
      },
      getFuncBodyState: {
        description: 'Returns the body state of the function with the given path.',
        params: { funcPath: 'string' },
        returns: 'string',
      },
      setTag: {
        description: 'Sets the text of the tag with the given name.',
        params: { tag: 'string', text: 'string' },
        returns: 'null',
      },
      setEditorIsUsingBlocks: {
        description: 'Switches the editor between block mode and text mode.',
        params: { useBlocks: 'bool' },
        returns: 'null',
      },
    },
  },
  {
    scope: 'Pixera.Ui',
    isClass: false,
    title: 'Pixera UI',
    description:
      'Pixera user interface: lock/unlock, app mode, display test pattern, output freeze, content and workspace rendering, ' +
      'heatmap and named external clocks. Preview cameras: pixera_ui_preview_cameras. ' +
      'Combo boxes: get a handle via action getComboBoxWithId, then use pixera_ui_combo_box.',
    actions: {
      lockUi: {
        description: 'Locks the user interface with the given password.',
        params: { password: 'string' },
        returns: 'null',
      },
      unlockUi: {
        description: 'Unlocks the user interface with the given password.',
        params: { password: 'string' },
        returns: 'null',
      },
      toggleLockUi: {
        description: 'Toggles the lock state of the user interface, using the given password.',
        params: { password: 'string' },
        returns: 'null',
      },
      getComboBoxWithId: {
        description: 'Returns the handle of the UI combo box with the given id.',
        params: { id: 'double' },
        returns: 'handle',
      },
      setAppMode: {
        description: 'Sets the current app mode.',
        params: {
          mode: {
            type: 'int',
            desc: '1 = Screens, 2 = Mapping, 3 = Compositing, 4 = Compositing Inside, 5 = Settings, 6 = Mapping Screens Feedarea, 7 = Control',
          },
        },
        returns: 'null',
      },
      getAppMode: {
        description: 'Returns the current app mode (see setAppMode for the values).',
        returns: 'int',
      },
      getDisplayTestpattern: {
        description: 'Returns whether the display test pattern is shown.',
        returns: 'bool',
      },
      setDisplayTestpattern: {
        description: 'Shows or hides the display test pattern.',
        params: { display: 'bool' },
        returns: 'null',
      },
      toggleOutputFreeze: {
        description: 'Toggles the freeze state of the output displays (frozen outputs do not update their content).',
        returns: 'null',
      },
      getPreviewCameraAsJsonString: {
        description: 'Deprecated, use pixera_ui_preview_cameras action getPreviewCameraAsJsonString. Returns the state of the current preview camera as JSON.',
        returns: 'string',
      },
      setPreviewCameraAsJsonString: {
        description: 'Deprecated, use pixera_ui_preview_cameras action setPreviewCameraAsJsonString. Sets the state of the current preview camera from JSON.',
        params: {
          cameraFrustrumStateString: {
            type: 'string',
            desc: 'JSON with Eye (world position), LookAt (world point), vecUp (up vector) and fov (radians)',
          },
        },
        returns: 'null',
      },
      setDisableContentRendering: {
        description: 'Disables or enables content rendering in the workspace (outputs are not affected).',
        params: { state: 'bool' },
        returns: 'null',
      },
      getIsContentRenderingDisabled: {
        description: 'Returns whether content rendering in the workspace is disabled.',
        returns: 'bool',
      },
      setDisableWorkspaceRendering: {
        description: 'Disables or enables rendering of the workspace.',
        params: { state: 'bool' },
        returns: 'null',
      },
      getIsWorkspaceRenderingDisabled: {
        description: 'Returns whether rendering of the workspace is disabled.',
        returns: 'bool',
      },
      setShowHeatmap: {
        description: 'Shows or hides the lux heatmap rendering.',
        params: { doShow: 'bool' },
        returns: 'null',
      },
      getShowHeatmap: {
        description: 'Returns whether the lux heatmap rendering is enabled.',
        returns: 'bool',
      },
      setClockSeconds: {
        description: 'Creates or updates a named external clock, with its time given in seconds.',
        params: {
          name: 'string',
          timeSeconds: { type: 'double', desc: 'Current clock time in seconds' },
          fps: { type: 'double', desc: 'Frame rate of the clock' },
          isRunning: { type: 'optional<bool>', desc: 'If true, the UI extrapolates the time forward between API pushes' },
          isCountdown: { type: 'optional<bool>', desc: 'If true, the clock counts down' },
        },
        returns: 'null',
      },
      setClockFrames: {
        description: 'Creates or updates a named external clock, with its time given in frames.',
        params: {
          name: 'string',
          timeFrames: { type: 'int', desc: 'Current clock time in frames' },
          fps: { type: 'double', desc: 'Frame rate of the clock' },
          isRunning: { type: 'optional<bool>', desc: 'If true, the UI extrapolates the time forward between API pushes' },
          isCountdown: { type: 'optional<bool>', desc: 'If true, the clock counts down' },
        },
        returns: 'null',
      },
      removeClock: {
        description: 'Removes the named external clock.',
        params: { name: 'string' },
        returns: 'null',
      },
      removeAllClocks: {
        description: 'Removes all external clocks.',
        returns: 'null',
      },
      getClockNames: {
        description: 'Returns the names of all external clocks.',
        returns: 'string[]',
      },
    },
  },
  {
    scope: 'Pixera.Ui.ComboBox',
    isClass: true,
    title: 'Pixera UI combo box (object)',
    description:
      'A combo box in the user interface: clear and fill it with items (each with an int id), and read or set the selected id. ' +
      'Get a handle via pixera_ui action getComboBoxWithId.',
    actions: {
      clear: {
        description: 'Removes all items from the combo box.',
        returns: 'null',
      },
      addItem: {
        description: 'Adds an item with the given text and id to the combo box.',
        params: { item: 'string', id: 'int' },
        returns: 'null',
      },
      setSelectedId: {
        description: 'Selects the item with the given id.',
        params: { id: 'int' },
        returns: 'null',
      },
      getSelectedId: {
        description: 'Returns the id of the selected item.',
        returns: 'int',
      },
    },
  },
  {
    scope: 'Pixera.Ui.Control',
    isClass: false,
    title: 'Pixera control pages',
    description: 'Control pages of the current project: list them, read the active one and switch to another.',
    actions: {
      setControlPage: {
        description: 'Makes the control page with the given name the active one.',
        params: { pageName: 'string' },
        returns: 'null',
      },
      getControlPages: {
        description: 'Returns the names of all control pages in the current project.',
        returns: 'string[]',
      },
      getCurrentControlPage: {
        description: 'Returns the name of the active control page.',
        returns: 'string',
      },
    },
  },
  {
    scope: 'Pixera.Ui.PreviewCameras',
    isClass: false,
    title: 'Pixera preview cameras',
    description:
      'Preview cameras of the current venue: list them, select the one used for preview rendering, and read or set its state. ' +
      'Get a PreviewCamera handle via action getPreviewCameraWithName, getPreviewCameraWithIndex or getPreviewCameras, then use pixera_ui_preview_cameras_preview_camera.',
    actions: {
      getPreviewCameraWithName: {
        description: 'Returns the handle of the preview camera with the given name (as shown in the inspector).',
        params: { name: 'string' },
        returns: 'handle',
      },
      getPreviewCameraWithIndex: {
        description: 'Returns the handle of the preview camera at the given zero-based index.',
        params: { index: { type: 'int', desc: 'Zero-based index' } },
        returns: 'handle',
      },
      getPreviewCameras: {
        description: 'Returns handles to all available preview cameras.',
        returns: 'handle[]',
      },
      selectPreviewCameraByIndex: {
        description: 'Selects the preview camera used for preview rendering by its index.',
        params: { index: { type: 'int', desc: 'Zero-based index' } },
        returns: 'null',
      },
      selectPreviewCameraByName: {
        description: 'Selects the preview camera used for preview rendering by its name.',
        params: { name: 'string' },
        returns: 'null',
      },
      getPreviewCameraNames: {
        description: 'Returns the names of all preview cameras in the current venue.',
        returns: 'string[]',
      },
      getPreviewCameraAsJsonString: {
        description: 'Returns the state of the current preview camera as JSON (Eye, LookAt, vecUp, fov in radians).',
        returns: 'string',
      },
      setPreviewCameraAsJsonString: {
        description: 'Sets the state of the current preview camera from JSON (Eye, LookAt, vecUp, fov in radians).',
        params: {
          setPreviewCameraAsJsonString: {
            type: 'string',
            desc: 'JSON with Eye (world position), LookAt (world point), vecUp (up vector) and fov (radians)',
          },
        },
        returns: 'null',
      },
    },
  },
  {
    scope: 'Pixera.Ui.PreviewCameras.PreviewCamera',
    isClass: true,
    title: 'Pixera preview camera (object)',
    description:
      'A preview camera: read and set whether its NDI output stream is active. ' +
      'Get a handle via pixera_ui_preview_cameras action getPreviewCameraWithName, getPreviewCameraWithIndex or getPreviewCameras.',
    actions: {
      getNdiOutputStreamIsActive: {
        description: 'Returns whether the NDI output stream of the preview camera is active.',
        returns: 'bool',
      },
      setNdiOutputStreamIsActive: {
        description: 'Activates or deactivates the NDI output stream of the preview camera.',
        params: { isActive: 'bool' },
        returns: 'bool',
      },
      getInst: {
        description: 'Returns the handle of the preview camera with the given instance path.',
        params: { instancePath: 'string' },
        returns: 'handle',
      },
    },
  },
  {
    scope: 'Pixera.Direct',
    isClass: false,
    title: 'Pixera Direct API',
    description:
      'Direct API for low-latency control of registered entities. Register entities with actions registerProjector, ' +
      'registerScreen, registerParam, registerCamera and registerPerspective (they return handles); then use ' +
      'pixera_direct_projector, pixera_direct_screen, pixera_direct_param, pixera_direct_camera or pixera_direct_perspective.',
    actions: {
      setRegistered: {
        description: 'Sets all entities registered in the current thread; previously registered entities not in the list are removed.',
        params: {
          hdls: 'handle[]',
          expectedFrequency: 'int',
          dampingMs: { type: 'int', desc: 'Damping time in milliseconds' },
          usageHints: {
            type: 'string[]',
            desc: "Empty, or one per handle: 'screen' | 'perspective' | 'parameter' | 'studioCamera'",
          },
        },
        returns: 'null',
      },
      reloadRegistered: {
        description: 'Updates the representation of all registered entities.',
        returns: 'null',
      },
      registerProjector: {
        description: 'Registers a projector for use with the Direct API and returns its handle.',
        params: {
          name: 'string',
          expectedFrequency: 'int',
          dampingMs: { type: 'int', desc: 'Damping time in milliseconds' },
        },
        returns: 'handle',
      },
      registerScreen: {
        description: 'Registers a screen for use with the Direct API and returns its handle.',
        params: {
          name: 'string',
          expectedFrequency: 'int',
          dampingMs: { type: 'int', desc: 'Damping time in milliseconds' },
        },
        returns: 'handle',
      },
      registerParam: {
        description: 'Registers a parameter for use with the Direct API and returns its handle.',
        params: {
          instancePath: {
            type: 'string',
            desc: "Name hierarchy in the timeline tree, e.g. 'Timeline 1.Position.x'. The layer must have been displayed at least once.",
          },
        },
        returns: 'handle',
      },
      registerCamera: {
        description: 'Registers a camera (by screen group name) for use with the Direct API and returns its handle.',
        params: { cameraName: 'string', expectedFrequency: 'int' },
        returns: 'handle',
      },
      registerPerspective: {
        description: 'Registers a perspective (by screen name) for use with the Direct API and returns its handle.',
        params: { screenName: 'string', expectedFrequency: 'int' },
        returns: 'handle',
      },
    },
  },
  {
    scope: 'Pixera.Direct.Projector',
    isClass: true,
    title: 'Pixera Direct projector (object)',
    description:
      'A registered projector: set its position and rotation. Get a handle via pixera_direct action registerProjector.',
    actions: {
      setPosition: {
        description: 'Sets the projector position (only the given axes are changed).',
        params: {
          xPos: { type: 'optional<double>', desc: 'Position in meters' },
          yPos: { type: 'optional<double>', desc: 'Position in meters' },
          zPos: { type: 'optional<double>', desc: 'Position in meters' },
        },
        returns: 'null',
      },
      setRotation: {
        description: 'Sets the projector rotation (only the given axes are changed).',
        params: {
          xRot: { type: 'optional<double>', desc: 'Rotation in degrees' },
          yRot: { type: 'optional<double>', desc: 'Rotation in degrees' },
          zRot: { type: 'optional<double>', desc: 'Rotation in degrees' },
        },
        returns: 'null',
      },
      setPosRot: {
        description: 'Sets position and rotation in one call (only the given values are changed).',
        params: {
          xPos: { type: 'optional<double>', desc: 'Position in meters' },
          yPos: { type: 'optional<double>', desc: 'Position in meters' },
          zPos: { type: 'optional<double>', desc: 'Position in meters' },
          xRot: { type: 'optional<double>', desc: 'Rotation in degrees' },
          yRot: { type: 'optional<double>', desc: 'Rotation in degrees' },
          zRot: { type: 'optional<double>', desc: 'Rotation in degrees' },
        },
        returns: 'null',
      },
    },
  },
  {
    scope: 'Pixera.Direct.Screen',
    isClass: true,
    title: 'Pixera Direct screen (object)',
    description:
      'A registered screen: set its position, rotation and scale, optionally with the perspective position and damping. ' +
      'Get a handle via pixera_direct action registerScreen.',
    actions: {
      setPosition: {
        description: 'Sets the screen position (only the given axes are changed).',
        params: {
          xPos: { type: 'optional<double>', desc: 'Position in meters' },
          yPos: { type: 'optional<double>', desc: 'Position in meters' },
          zPos: { type: 'optional<double>', desc: 'Position in meters' },
        },
        returns: 'null',
      },
      setRotation: {
        description: 'Sets the screen rotation (only the given axes are changed).',
        params: {
          xRot: { type: 'optional<double>', desc: 'Rotation in degrees' },
          yRot: { type: 'optional<double>', desc: 'Rotation in degrees' },
          zRot: { type: 'optional<double>', desc: 'Rotation in degrees' },
        },
        returns: 'null',
      },
      setPosRot: {
        description: 'Sets position and rotation in one call (only the given values are changed).',
        params: {
          xPos: { type: 'optional<double>', desc: 'Position in meters' },
          yPos: { type: 'optional<double>', desc: 'Position in meters' },
          zPos: { type: 'optional<double>', desc: 'Position in meters' },
          xRot: { type: 'optional<double>', desc: 'Rotation in degrees' },
          yRot: { type: 'optional<double>', desc: 'Rotation in degrees' },
          zRot: { type: 'optional<double>', desc: 'Rotation in degrees' },
        },
        returns: 'null',
      },
      setPosRotAndPerspectivePos: {
        description: 'Sets position, rotation and the perspective position of the first screen group in one call.',
        params: {
          xPos: { type: 'optional<double>', desc: 'Position in meters' },
          yPos: { type: 'optional<double>', desc: 'Position in meters' },
          zPos: { type: 'optional<double>', desc: 'Position in meters' },
          xRot: { type: 'optional<double>', desc: 'Rotation in degrees' },
          yRot: { type: 'optional<double>', desc: 'Rotation in degrees' },
          zRot: { type: 'optional<double>', desc: 'Rotation in degrees' },
          perspXPos: { type: 'optional<double>', desc: 'Perspective position in meters' },
          perspYPos: { type: 'optional<double>', desc: 'Perspective position in meters' },
          perspZPos: { type: 'optional<double>', desc: 'Perspective position in meters' },
        },
        returns: 'null',
      },
      setPosRotScale: {
        description: 'Sets position, rotation and scale in one call (only the given values are changed).',
        params: {
          xPos: { type: 'optional<double>', desc: 'Position in meters' },
          yPos: { type: 'optional<double>', desc: 'Position in meters' },
          zPos: { type: 'optional<double>', desc: 'Position in meters' },
          xRot: { type: 'optional<double>', desc: 'Rotation in degrees' },
          yRot: { type: 'optional<double>', desc: 'Rotation in degrees' },
          zRot: { type: 'optional<double>', desc: 'Rotation in degrees' },
          xScale: 'optional<double>',
          yScale: 'optional<double>',
          zScale: 'optional<double>',
        },
        returns: 'null',
      },
      setPosWithPerspectiveFollowAndDamping: {
        description: 'Sets the screen position with perspective-follow override and damping times.',
        params: {
          xPos: { type: 'optional<double>', desc: 'Position in meters' },
          yPos: { type: 'optional<double>', desc: 'Position in meters' },
          zPos: { type: 'optional<double>', desc: 'Position in meters' },
          perspectiveFollowOverride: {
            type: 'optional<int>',
            desc: '0 = use screen group setting, 1 = perspective does not follow the screen, 2 = perspective follows the screen',
          },
          dampingScreenMs: { type: 'optional<int>', desc: 'Damping time of the screen transformation in milliseconds' },
          dampingPerspectiveMs: { type: 'optional<int>', desc: 'Damping time of the perspective transformation in milliseconds' },
        },
        returns: 'null',
      },
      enableLogging: {
        description: 'Enables timing logs for the screen; every 10 seconds message counts and min/max intervals go to the Pixera log.',
        params: { enable: 'bool' },
        returns: 'null',
      },
    },
  },
  {
    scope: 'Pixera.Direct.Param',
    isClass: true,
    title: 'Pixera Direct parameter (object)',
    description:
      'A registered timeline parameter: set its value directly. Get a handle via pixera_direct action registerParam.',
    actions: {
      setValue: {
        description:
          'Sets the parameter value directly; GUI conversions and offsets (layer offsets, resource scaling) are bypassed.',
        params: { value: 'double' },
        returns: 'null',
      },
      enableLogging: {
        description: 'Enables timing logs for the parameter; every 10 seconds message counts and min/max intervals go to the Pixera log.',
        params: { enable: 'bool' },
        returns: 'null',
      },
    },
  },
  {
    scope: 'Pixera.Direct.Camera',
    isClass: true,
    title: 'Pixera Direct camera (object)',
    description:
      'A registered camera: set its position, rotation (euler or quaternion), field of view and lens properties. ' +
      'Get a handle via pixera_direct action registerCamera.',
    actions: {
      setPosition: {
        description: 'Sets the camera position.',
        params: {
          xPos: { type: 'double', desc: 'Position in meters' },
          yPos: { type: 'double', desc: 'Position in meters' },
          zPos: { type: 'double', desc: 'Position in meters' },
        },
        returns: 'null',
      },
      setRotation: {
        description: 'Sets the camera rotation as euler angles.',
        params: {
          xRot: { type: 'double', desc: 'Rotation in degrees' },
          yRot: { type: 'double', desc: 'Rotation in degrees' },
          zRot: { type: 'double', desc: 'Rotation in degrees' },
        },
        returns: 'null',
      },
      setRotationQuat: {
        description: 'Sets the camera rotation as a quaternion.',
        params: {
          xQuat: 'double',
          yQuat: 'double',
          zQuat: 'double',
          wQuat: 'double',
        },
        returns: 'null',
      },
      setTransformation: {
        description: 'Sets position, euler rotation, field of view and aspect ratio of the camera.',
        params: {
          xPos: { type: 'double', desc: 'Position in meters' },
          yPos: { type: 'double', desc: 'Position in meters' },
          zPos: { type: 'double', desc: 'Position in meters' },
          xRot: { type: 'double', desc: 'Rotation in degrees' },
          yRot: { type: 'double', desc: 'Rotation in degrees' },
          zRot: { type: 'double', desc: 'Rotation in degrees' },
          fov: { type: 'double', desc: 'Field of view in degrees' },
          aspectRatio: 'double',
        },
        returns: 'null',
      },
      setTransformationQuat: {
        description: 'Sets position, quaternion rotation, field of view and aspect ratio of the camera.',
        params: {
          xPos: { type: 'double', desc: 'Position in meters' },
          yPos: { type: 'double', desc: 'Position in meters' },
          zPos: { type: 'double', desc: 'Position in meters' },
          xQuat: 'double',
          yQuat: 'double',
          zQuat: 'double',
          wQuat: 'double',
          fov: { type: 'double', desc: 'Field of view in degrees' },
          aspectRatio: 'double',
        },
        returns: 'null',
      },
      setTransformationAndLensProps: {
        description: 'Sets position, euler rotation, field of view, aspect ratio and lens properties of the camera.',
        params: {
          xPos: { type: 'double', desc: 'Position in meters' },
          yPos: { type: 'double', desc: 'Position in meters' },
          zPos: { type: 'double', desc: 'Position in meters' },
          xRot: { type: 'double', desc: 'Rotation in degrees' },
          yRot: { type: 'double', desc: 'Rotation in degrees' },
          zRot: { type: 'double', desc: 'Rotation in degrees' },
          fov: { type: 'double', desc: 'Field of view in degrees' },
          aspectRatio: 'double',
          nearClip: 'double',
          farClip: 'double',
          aperture: 'double',
          focus: 'double',
          iris: 'double',
          k1: 'double',
          k2: 'double',
          centerX: { type: 'double', desc: 'Millimeters' },
          centerY: { type: 'double', desc: 'Millimeters' },
          panelWidth: { type: 'double', desc: 'Millimeters' },
        },
        returns: 'null',
      },
      setTransformationAndLensPropsQuat: {
        description: 'Sets position, quaternion rotation, field of view, aspect ratio and lens properties of the camera.',
        params: {
          xPos: { type: 'double', desc: 'Position in meters' },
          yPos: { type: 'double', desc: 'Position in meters' },
          zPos: { type: 'double', desc: 'Position in meters' },
          xQuat: 'double',
          yQuat: 'double',
          zQuat: 'double',
          wQuat: 'double',
          fov: { type: 'double', desc: 'Field of view in degrees' },
          aspectRatio: 'double',
          nearClip: 'double',
          farClip: 'double',
          aperture: 'double',
          focus: 'double',
          iris: 'double',
          k1: 'double',
          k2: 'double',
          centerX: { type: 'double', desc: 'Millimeters' },
          centerY: { type: 'double', desc: 'Millimeters' },
          panelWidth: { type: 'double', desc: 'Millimeters' },
        },
        returns: 'null',
      },
      setTransformationAndLensPropsExt: {
        description: 'Sets position, euler rotation, field of view, aspect ratio and extended lens properties of the camera.',
        params: {
          xPos: { type: 'double', desc: 'Position in meters' },
          yPos: { type: 'double', desc: 'Position in meters' },
          zPos: { type: 'double', desc: 'Position in meters' },
          xRot: { type: 'double', desc: 'Rotation in degrees' },
          yRot: { type: 'double', desc: 'Rotation in degrees' },
          zRot: { type: 'double', desc: 'Rotation in degrees' },
          fov: { type: 'double', desc: 'Field of view in degrees' },
          aspectRatio: 'double',
          nearClip: 'double',
          farClip: 'double',
          aperture: 'double',
          focus: 'double',
          focalDistance: 'double',
          zoom: 'double',
          iris: 'double',
          k1: 'double',
          k2: 'double',
          k3: 'double',
          p1: 'double',
          p2: 'double',
          centerX: { type: 'double', desc: 'Millimeters' },
          centerY: { type: 'double', desc: 'Millimeters' },
          panelWidth: { type: 'double', desc: 'Millimeters' },
          overscan: 'double',
          focalLength: 'optional<double>',
          focalLengthDistorted: 'optional<double>',
        },
        returns: 'null',
      },
      setTransformationAndLensPropsExtQuat: {
        description: 'Sets position, quaternion rotation, field of view, aspect ratio and extended lens properties of the camera.',
        params: {
          xPos: { type: 'double', desc: 'Position in meters' },
          yPos: { type: 'double', desc: 'Position in meters' },
          zPos: { type: 'double', desc: 'Position in meters' },
          xQuat: 'double',
          yQuat: 'double',
          zQuat: 'double',
          wQuat: 'double',
          fov: { type: 'double', desc: 'Field of view in degrees' },
          aspectRatio: 'double',
          nearClip: 'double',
          farClip: 'double',
          aperture: 'double',
          focus: 'double',
          focalDistance: 'double',
          zoom: 'double',
          iris: 'double',
          k1: 'double',
          k2: 'double',
          k3: 'double',
          p1: 'double',
          p2: 'double',
          centerX: { type: 'double', desc: 'Millimeters' },
          centerY: { type: 'double', desc: 'Millimeters' },
          panelWidth: { type: 'double', desc: 'Millimeters' },
          overscan: 'double',
          focalLength: 'optional<double>',
          focalLengthDistorted: 'optional<double>',
        },
        returns: 'null',
      },
    },
  },
  {
    scope: 'Pixera.Direct.Perspective',
    isClass: true,
    title: 'Pixera Direct perspective (object)',
    description:
      'A registered perspective: set its transformation, lens properties or generalized position. ' +
      'Get a handle via pixera_direct action registerPerspective.',
    actions: {
      setTransformation: {
        description: 'Sets position, euler rotation, field of view and aspect ratio of the perspective.',
        params: {
          xPos: { type: 'double', desc: 'Position in meters' },
          yPos: { type: 'double', desc: 'Position in meters' },
          zPos: { type: 'double', desc: 'Position in meters' },
          xRot: { type: 'double', desc: 'Rotation in degrees' },
          yRot: { type: 'double', desc: 'Rotation in degrees' },
          zRot: { type: 'double', desc: 'Rotation in degrees' },
          fov: { type: 'double', desc: 'Field of view in degrees' },
          aspectRatio: 'double',
        },
        returns: 'null',
      },
      setTransformationAndLensProps: {
        description: 'Sets position, euler rotation, field of view, aspect ratio and lens properties of the perspective.',
        params: {
          xPos: { type: 'double', desc: 'Position in meters' },
          yPos: { type: 'double', desc: 'Position in meters' },
          zPos: { type: 'double', desc: 'Position in meters' },
          xRot: { type: 'double', desc: 'Rotation in degrees' },
          yRot: { type: 'double', desc: 'Rotation in degrees' },
          zRot: { type: 'double', desc: 'Rotation in degrees' },
          fov: { type: 'double', desc: 'Field of view in degrees' },
          aspectRatio: 'double',
          nearClip: 'double',
          farClip: 'double',
          aperture: 'double',
          focus: 'double',
          iris: 'double',
          k1: 'double',
          k2: 'double',
          centerX: { type: 'double', desc: 'Millimeters' },
          centerY: { type: 'double', desc: 'Millimeters' },
          panelWidth: { type: 'double', desc: 'Millimeters' },
        },
        returns: 'null',
      },
      setGeneralizedPerspectivePosition: {
        description: 'Sets the generalized position of the perspective (only the given axes are changed).',
        params: {
          xPos: { type: 'optional<double>', desc: 'Position in meters' },
          yPos: { type: 'optional<double>', desc: 'Position in meters' },
          zPos: { type: 'optional<double>', desc: 'Position in meters' },
        },
        returns: 'null',
      },
    },
  },
];
