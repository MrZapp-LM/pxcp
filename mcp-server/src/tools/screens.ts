import type { ToolGroup } from '../types.js';

// Area module: Pixera.Screens + Pixera.LiveSystems (see src/tools/areas.ts for the scope list),
// style follows src/tools/utility.ts. Units: positions and sizes in meters, rotations in degrees.
export const groups: ToolGroup[] = [
  {
    scope: 'Pixera.Screens',
    isClass: false,
    title: 'Pixera screens (namespace)',
    description:
      'Screens tab of the venue: lists, adds and exports screens, studio cameras, screen groups and ' +
      'transformation nodes. Get Screen handles via getScreens or getScreenWithName, camera handles via ' +
      'getStudioCameras, screen group handles via getScreenGroups and transformation node handles via ' +
      'getTransformationNodes; use the matching pixera_screens_* tool for their methods.',
    actions: {
      getScreenWithName: {
        description: 'Returns the handle of the screen with the given name.',
        params: { name: { type: 'string', desc: 'Screen name as shown in the inspector' } },
        returns: 'handle',
      },
      setNamedScreenPosition: {
        description: 'Sets the position of the screen with the given name (test-only, likely to be removed; prefer getScreenWithName + Screen.setPosition).',
        params: {
          name: { type: 'string', desc: 'Screen name as shown in the inspector' },
          xPos: { type: 'optional<double>', desc: 'Meters' },
          yPos: { type: 'optional<double>', desc: 'Meters' },
          zPos: { type: 'optional<double>', desc: 'Meters' },
        },
        returns: 'null',
      },
      getScreens: {
        description: 'Returns handles to all screens currently used in the Screens tab.',
        returns: 'handle[]',
      },
      getScreenNames: {
        description: 'Returns the names of all screens currently used in the Screens tab.',
        returns: 'string[]',
      },
      getFirstTimelineWithHomeScreen: {
        description: 'Returns the handle of the first timeline whose home screen is the screen with the given name.',
        params: { screenName: { type: 'string', desc: 'Screen name as shown in the inspector' } },
        returns: 'handle',
      },
      getStudioCameras: {
        description: 'Returns handles to all studio cameras currently used in the Screens tab.',
        returns: 'handle[]',
      },
      getScreenGroups: {
        description: 'Returns handles to all screen groups currently available.',
        returns: 'handle[]',
      },
      getScreenGroupNames: {
        description: 'Returns the names of all screen groups currently available.',
        returns: 'string[]',
      },
      getTransformationNodes: {
        description: 'Returns handles to all transformation nodes currently available.',
        returns: 'handle[]',
      },
      addScreen: {
        description: 'Adds a screen from a screen library template to the venue and returns its handle.',
        params: {
          libraryPath: {
            type: 'string',
            desc: "Template path in the screen library, separated by '/' or '.', e.g. 'Screens/Generic/Generic Box'; empty or unknown path creates a generic flat screen",
          },
          name: { type: 'optional<string>', desc: 'Name as shown in the inspector' },
          xPos: { type: 'optional<double>', desc: 'Meters, default 0' },
          yPos: { type: 'optional<double>', desc: 'Meters, default 0' },
          zPos: { type: 'optional<double>', desc: 'Meters, default 0' },
          preserveMeshes: {
            type: 'optional<bool>',
            desc: 'Only for library screens referencing a 3D file (custom folders); keep mesh structure. Default false',
          },
        },
        returns: 'handle',
      },
      addScreenFromFile: {
        description: 'Adds a screen created from a 3D object file (fbx, obj, gltf, ...) to the venue and returns its handle.',
        params: {
          filePath: { type: 'string', desc: 'Path to the 3D object file on the Pixera machine' },
          isActiveScreen: { type: 'bool', desc: 'true = LED object, false = projection screen' },
          name: { type: 'optional<string>', desc: 'Name as shown in the inspector; defaults to the file name' },
          xPos: { type: 'optional<double>', desc: 'Meters, default 0' },
          yPos: { type: 'optional<double>', desc: 'Meters, default 0' },
          zPos: { type: 'optional<double>', desc: 'Meters, default 0' },
          preserveMeshes: {
            type: 'optional<bool>',
            desc: 'true = one screen per mesh of the file; false = meshes merged and pre-transformed. Default false',
          },
        },
        returns: 'handle',
      },
      addScreenToLibraryFromFile: {
        description: 'Adds a screen from a 3D object file to the custom folder of the screen library (not to the venue).',
        params: {
          filePath: { type: 'string', desc: 'Path to the 3D object file on the Pixera machine' },
          isActiveScreen: {
            type: 'bool',
            desc: "true = custom folder of 'LED Panels', false = custom folder of 'Screens'",
          },
        },
        returns: 'handle',
      },
      exportVenueTo3dFile: {
        description: 'Exports the venue screens and projectors into one glTF 2.0 file (.gltf or binary .glb) and returns whether it was written.',
        params: {
          filePath: { type: 'string', desc: "Target path; '.gltf' gives text plus .bin, any other extension gives binary .glb" },
          withScreens: { type: 'optional<bool>', desc: 'Export screens. Default true' },
          withProjectors: { type: 'optional<bool>', desc: 'Export projectors. Default true' },
          onlyVisible: { type: 'optional<bool>', desc: 'Skip objects hidden in the workspace. Default false' },
          exportProjectorFrustums: { type: 'optional<bool>', desc: 'Export projector frustums. Default true' },
        },
        returns: 'bool',
      },
    },
  },
  {
    scope: 'Pixera.Screens.Screen',
    isClass: true,
    title: 'Pixera screen (object)',
    description:
      'A screen in the venue (LED or projection surface) with position, rotation, size, perspective, ' +
      'calibration, warping, color correction and output assignment. Get a handle via pixera_screens ' +
      'action getScreens or getScreenWithName (or addScreen / addScreenFromFile).',
    actions: {
      getId: {
        description: 'Returns a numeric id based on the handle, for APIs that cannot take handles as parameters.',
        returns: 'double',
      },
      getName: {
        description: 'Returns the screen name as shown in the inspector.',
        returns: 'string',
      },
      setPosition: {
        description: 'Sets the position of the screen.',
        params: {
          xPos: { type: 'optional<double>', desc: 'Meters' },
          yPos: { type: 'optional<double>', desc: 'Meters' },
          zPos: { type: 'optional<double>', desc: 'Meters' },
        },
        returns: 'bool',
      },
      getPosition: {
        description: 'Returns the position of the screen in meters.',
        returns: 'ScreenPosValues',
      },
      setRotation: {
        description: 'Sets the rotation of the screen.',
        params: {
          xRot: { type: 'optional<double>', desc: 'Degrees' },
          yRot: { type: 'optional<double>', desc: 'Degrees' },
          zRot: { type: 'optional<double>', desc: 'Degrees' },
        },
        returns: 'bool',
      },
      getRotation: {
        description: 'Returns the rotation of the screen in degrees.',
        returns: 'ScreenPosValues',
      },
      setScale: {
        description: 'Scales the screen proportionally.',
        params: {
          xScale: { type: 'optional<double>', desc: '1.0 leaves the size unchanged' },
          yScale: { type: 'optional<double>', desc: '1.0 leaves the size unchanged' },
          zScale: { type: 'optional<double>', desc: '1.0 leaves the size unchanged' },
        },
        returns: 'bool',
      },
      getScale: {
        description: 'Returns the scale of the screen.',
        returns: 'ScreenPosValues',
      },
      setSize: {
        description: 'Sets the physical size of the screen.',
        params: {
          xSize: { type: 'optional<double>', desc: 'Meters' },
          ySize: { type: 'optional<double>', desc: 'Meters' },
          zSize: { type: 'optional<double>', desc: 'Meters' },
        },
        returns: 'bool',
      },
      getSize: {
        description: 'Returns the physical size of the screen in meters.',
        returns: 'ScreenPosValues',
      },
      setContentResolution: {
        description: 'Sets the canvas resolution of the screen in pixels.',
        params: {
          width: { type: 'int', desc: 'Pixels' },
          height: { type: 'int', desc: 'Pixels' },
        },
        returns: 'bool',
      },
      getContentResolution: {
        description: 'Returns the canvas resolution of the screen in pixels as [width, height].',
        returns: 'int[]',
      },
      setPosRot: {
        description: 'Sets position and rotation in one call.',
        params: {
          xPos: { type: 'optional<double>', desc: 'Meters' },
          yPos: { type: 'optional<double>', desc: 'Meters' },
          zPos: { type: 'optional<double>', desc: 'Meters' },
          xRot: { type: 'optional<double>', desc: 'Degrees' },
          yRot: { type: 'optional<double>', desc: 'Degrees' },
          zRot: { type: 'optional<double>', desc: 'Degrees' },
        },
        returns: 'bool',
      },
      setPosRotAndPerspectivePos: {
        description: 'Sets position, rotation and perspective position of the first screen group in one call.',
        params: {
          xPos: { type: 'optional<double>', desc: 'Meters' },
          yPos: { type: 'optional<double>', desc: 'Meters' },
          zPos: { type: 'optional<double>', desc: 'Meters' },
          xRot: { type: 'optional<double>', desc: 'Degrees' },
          yRot: { type: 'optional<double>', desc: 'Degrees' },
          zRot: { type: 'optional<double>', desc: 'Degrees' },
          perspXPos: { type: 'optional<double>', desc: 'Meters' },
          perspYPos: { type: 'optional<double>', desc: 'Meters' },
          perspZPos: { type: 'optional<double>', desc: 'Meters' },
        },
        returns: 'bool',
      },
      setPosRotScale: {
        description: 'Sets position, rotation and scale in one call.',
        params: {
          xPos: { type: 'optional<double>', desc: 'Meters' },
          yPos: { type: 'optional<double>', desc: 'Meters' },
          zPos: { type: 'optional<double>', desc: 'Meters' },
          xRot: { type: 'optional<double>', desc: 'Degrees' },
          yRot: { type: 'optional<double>', desc: 'Degrees' },
          zRot: { type: 'optional<double>', desc: 'Degrees' },
          xScale: { type: 'optional<double>', desc: '1.0 leaves the size unchanged' },
          yScale: { type: 'optional<double>', desc: '1.0 leaves the size unchanged' },
          zScale: { type: 'optional<double>', desc: '1.0 leaves the size unchanged' },
        },
        returns: 'bool',
      },
      setPosWithPerspectiveFollowAndDamping: {
        description: 'Sets the position and optionally overrides perspective following and damping (DirectAPI).',
        params: {
          xPos: { type: 'optional<double>', desc: 'Meters' },
          yPos: { type: 'optional<double>', desc: 'Meters' },
          zPos: { type: 'optional<double>', desc: 'Meters' },
          dApiPerspectiveFollowOverride: {
            type: 'optional<int>',
            desc: '0 = screen group setting, 1 = perspective does not follow screen, 2 = perspective follows screen',
          },
          dApiDampingScreenMs: { type: 'optional<int>', desc: 'Screen transformation damping, milliseconds' },
          dApiDampingPerspectiveMs: { type: 'optional<int>', desc: 'Perspective transformation damping, milliseconds' },
        },
        returns: 'bool',
      },
      getPerspectives: {
        description: 'Returns handles to all perspectives available for the screen.',
        returns: 'handle[]',
      },
      getPerspectiveForScreenGroup: {
        description: 'Returns the perspective of the screen group with the given name.',
        params: { screenGroupName: { type: 'string', desc: 'Screen group name' } },
        returns: 'handle',
      },
      getPersepective: {
        description: 'Returns the perspective of the first screen group (name as in the API).',
        returns: 'handle',
      },
      snapPerspectiveCornersToScreen: {
        description: 'Snaps the perspective corners to the screen.',
        params: {
          mode: {
            type: 'int',
            desc: '0 = bounding box, 1 = UV coords, 2 = vertices, 3 = bounding box in view, 4 = vertices with projection',
          },
        },
        returns: 'null',
      },
      setPerspectivePosition: {
        description: 'Sets the position of the perspective.',
        params: {
          xPos: { type: 'optional<double>', desc: 'Meters' },
          yPos: { type: 'optional<double>', desc: 'Meters' },
          zPos: { type: 'optional<double>', desc: 'Meters' },
        },
        returns: 'bool',
      },
      setPerspectivePositionWithLookAt: {
        description: 'Sets the position of the perspective and moves the look-at point so the eye to look-at relation is kept.',
        params: {
          xPos: { type: 'optional<double>', desc: 'Meters' },
          yPos: { type: 'optional<double>', desc: 'Meters' },
          zPos: { type: 'optional<double>', desc: 'Meters' },
        },
        returns: 'bool',
      },
      getPerspectivePosition: {
        description: 'Returns the position of the perspective in meters.',
        returns: 'ScreenPosValues',
      },
      setPerspectiveRotation: {
        description: 'Sets the rotation of the perspective around its view axis.',
        params: {
          xRot: { type: 'optional<double>', desc: 'Degrees' },
          yRot: { type: 'optional<double>', desc: 'Degrees' },
          zRot: { type: 'optional<double>', desc: 'Degrees' },
        },
        returns: 'bool',
      },
      getPerspectiveRotation: {
        description: 'Returns the rotation of the perspective around its view axis in degrees.',
        returns: 'ScreenPosValues',
      },
      setCameraPosition: {
        description: 'Deprecated: use setPerspectivePosition instead.',
        params: {
          xPos: { type: 'optional<double>', desc: 'Meters' },
          yPos: { type: 'optional<double>', desc: 'Meters' },
          zPos: { type: 'optional<double>', desc: 'Meters' },
        },
        returns: 'bool',
      },
      setCameraPositionWithLookAt: {
        description: 'Deprecated: use setPerspectivePositionWithLookAt instead.',
        params: {
          xPos: { type: 'optional<double>', desc: 'Meters' },
          yPos: { type: 'optional<double>', desc: 'Meters' },
          zPos: { type: 'optional<double>', desc: 'Meters' },
        },
        returns: 'bool',
      },
      getCameraPosition: {
        description: 'Deprecated: use getPerspectivePosition instead.',
        returns: 'ScreenPosValues',
      },
      setCameraRotation: {
        description: 'Deprecated: use setPerspectiveRotation instead.',
        params: {
          xRot: { type: 'optional<double>', desc: 'Degrees' },
          yRot: { type: 'optional<double>', desc: 'Degrees' },
          zRot: { type: 'optional<double>', desc: 'Degrees' },
        },
        returns: 'bool',
      },
      getCameraRotation: {
        description: 'Deprecated: use getPerspectiveRotation instead.',
        returns: 'ScreenPosValues',
      },
      setContentSamplingFrustumBase: {
        description: 'Sets the frustum base of the perspective in content-space pixels, relative to another screen origin.',
        params: {
          x: { type: 'double', desc: 'Pixels; center of the frustum base in the content compositing X/Y plane' },
          y: { type: 'double', desc: 'Pixels; center of the frustum base in the content compositing X/Y plane' },
          width: { type: 'double', desc: 'Pixels' },
          height: { type: 'double', desc: 'Pixels' },
          rotation: { type: 'double', desc: 'Degrees, around the Z axis' },
          originScreenId: { type: 'double', desc: 'Id of the origin screen (see getId)' },
        },
        returns: 'null',
      },
      runCalibration: {
        description: 'Launches a calibration tool for the screen.',
        params: {
          mode: { type: 'string', desc: "'newCalib' (New Calibration dialog) or 'autoRecalib' (no user interaction); empty = default" },
          diff: { type: 'string', desc: "Tool variant, e.g. 'vioso'; empty = default" },
        },
        returns: 'null',
      },
      closeCalibration: {
        description: 'Closes a running calibration tool for the screen.',
        params: { diff: { type: 'string', desc: "Tool variant, e.g. 'vioso'; empty = default" } },
        returns: 'null',
      },
      editCalibration: {
        description: 'Relaunches a calibration tool for the screen for further editing.',
        params: { diff: { type: 'string', desc: "Tool variant, e.g. 'vioso'; empty = default" } },
        returns: 'null',
      },
      finishedCalibration: {
        description: 'Notifies whether the calibration is finished.',
        params: { finished: { type: 'bool', desc: 'true = finished, false = not finished' } },
        returns: 'bool',
      },
      distributeLoadedCalibrationAndReload: {
        description: "Distributes the loaded calibrations and reloads them (same as the 'Distribute Loaded Calibrations' button).",
        returns: 'null',
      },
      resetWarpFile: {
        description: 'Resets a warp that originated from a calibration tool.',
        params: { diff: { type: 'string', desc: 'Tool variant; empty = default' } },
        returns: 'null',
      },
      loadWarpFile: {
        description: 'Loads the warp file at the given path for the screen.',
        params: { filePath: { type: 'string', desc: 'Absolute path on the Pixera machine' } },
        returns: 'null',
      },
      loadWarpFileWithDiff: {
        description: 'Loads a warp file for the screen with an explicit format (e.g. MPCDI).',
        params: {
          filePath: { type: 'string', desc: 'Absolute path on the Pixera machine' },
          diff: { type: 'string', desc: "Format, e.g. 'mpcdi'" },
          scaleFactor: { type: 'optional<double>', desc: 'MPCDI only: scales the projector position of the SL profile. Default 1.0' },
        },
        returns: 'null',
      },
      addWarpFile: {
        description: 'Adds the warp file at the given path to those already loaded for the screen.',
        params: { filePath: { type: 'string', desc: 'Absolute path on the Pixera machine' } },
        returns: 'null',
      },
      addWarpFileWithDiff: {
        description: 'Adds a warp file for the screen with an explicit format (e.g. MPCDI).',
        params: {
          filePath: { type: 'string', desc: 'Absolute path on the Pixera machine' },
          diff: { type: 'string', desc: "Format, e.g. 'mpcdi'" },
          scaleFactor: { type: 'optional<double>', desc: 'MPCDI only: scales the projector position of the SL profile. Default 1.0' },
        },
        returns: 'null',
      },
      loadColorCalibration: {
        description: 'Loads a color calibration by name.',
        params: { calibrationName: 'string' },
        returns: 'null',
      },
      runColorCalibration: {
        description: 'Runs the color calibration for the screen.',
        returns: 'null',
      },
      setIsVisible: {
        description: 'Sets the screen visibility in the workspace.',
        params: { isVisible: 'bool' },
        returns: 'null',
      },
      getIsVisible: {
        description: 'Returns the screen visibility in the workspace.',
        returns: 'bool',
      },
      setIsProjectable: {
        description: 'Sets whether the screen can be used as a projection surface.',
        params: { isProjectable: 'bool' },
        returns: 'null',
      },
      getIsProjectable: {
        description: 'Returns whether the screen can be used as a projection surface.',
        returns: 'bool',
      },
      triggerRefreshMapping: {
        description: 'Triggers a manual update of the mappings between this screen and the projectors.',
        returns: 'null',
      },
      resetAllColorCorrections: {
        description: 'Resets all color corrections of the screen.',
        returns: 'null',
      },
      setColorCorrectionWithPath: {
        description: 'Sets one color correction value addressed by its path.',
        params: {
          path: {
            type: 'string',
            desc: "Parameter path, e.g. 'Realtime.Brightness'; full paths are listed by getColorCorrectionAsJsonString",
          },
          value: { type: 'float', desc: "Value; e.g. Realtime.Brightness 1.0 = default, >1.0 brighter, <1.0 darker" },
        },
        returns: 'null',
      },
      getColorCorrectionWithPath: {
        description: 'Returns one color correction value addressed by its path.',
        params: { path: { type: 'string', desc: "Parameter path, e.g. 'Realtime.Brightness'" } },
        returns: 'float',
      },
      setColorCorrectionAsJsonString: {
        description: 'Sets the complete color correction from a JSON string.',
        params: { colorCorrection: 'string' },
        returns: 'null',
      },
      getColorCorrectionAsJsonString: {
        description: 'Returns the complete color correction as a JSON string.',
        returns: 'string',
      },
      getOutput: {
        description: 'Returns handles to the outputs assigned to the screen (not streams).',
        returns: 'handle[]',
      },
      getOutputStreams: {
        description: 'Returns handles to the video streams assigned to the screen (not outputs).',
        returns: 'handle[]',
      },
      setOutputExt: {
        description: 'Assigns an Output or a video stream to the screen, optionally at an aggregate position.',
        params: {
          outputHandle: { type: 'handle', desc: 'Handle of an Output or a video stream' },
          aggregateIndexHor: { type: 'int', desc: 'Horizontal aggregate index; -1 for both indices = no position' },
          aggregateIndexVer: { type: 'int', desc: 'Vertical aggregate index; -1 for both indices = no position' },
          clearOthers: { type: 'bool', desc: 'true = clear other outputs when setting this one' },
        },
        returns: 'bool',
      },
      clearOutput: {
        description: 'Removes one assigned Output or video stream from the screen.',
        params: {
          outputHandle: { type: 'handle', desc: 'Handle of an Output or a video stream' },
          aggregateIndexHor: { type: 'int', desc: 'Horizontal aggregate index; -1 for both = no position' },
          aggregateIndexVer: { type: 'int', desc: 'Vertical aggregate index; -1 for both = no position' },
        },
        returns: 'bool',
      },
      clearOutputs: {
        description: 'Removes all assigned outputs from the screen.',
        returns: 'bool',
      },
      setBlackout: {
        description: 'Sets the active state of the screen blackout.',
        params: { isActive: 'bool' },
        returns: 'null',
      },
      getBlackout: {
        description: 'Returns the active state of the screen blackout.',
        returns: 'bool',
      },
      getInst: {
        description: 'Returns the handle of the child object at the given instance path.',
        params: { instancePath: 'string' },
        returns: 'handle',
      },
      getHandleFromInstancePath: {
        description: 'Returns the handle for the given instance path.',
        params: { instancePath: 'string' },
        returns: 'handle',
      },
      getInstancePath: {
        description: 'Returns the instance path of this object.',
        returns: 'string',
      },
    },
  },
  {
    scope: 'Pixera.Screens.StudioCamera',
    isClass: true,
    title: 'Pixera studio camera (object)',
    description:
      'A studio camera in the Screens tab with position, rotation, lens and tracking settings. Get a handle ' +
      'via pixera_screens action getStudioCameras.',
    actions: {
      getName: {
        description: 'Returns the name of the studio camera.',
        returns: 'string',
      },
      setPosition: {
        description: 'Sets the position of the studio camera.',
        params: {
          xPos: { type: 'optional<double>', desc: 'Meters' },
          yPos: { type: 'optional<double>', desc: 'Meters' },
          zPos: { type: 'optional<double>', desc: 'Meters' },
        },
        returns: 'null',
      },
      getPosition: {
        description: 'Returns the position of the studio camera in meters as [x, y, z].',
        returns: 'double[]',
      },
      setRotation: {
        description: 'Sets the euler rotation of the studio camera.',
        params: {
          xRot: { type: 'optional<double>', desc: 'Degrees' },
          yRot: { type: 'optional<double>', desc: 'Degrees' },
          zRot: { type: 'optional<double>', desc: 'Degrees' },
        },
        returns: 'null',
      },
      setRotationQuat: {
        description: 'Sets the rotation of the studio camera as a quaternion.',
        params: {
          xQuat: { type: 'optional<double>' },
          yQuat: { type: 'optional<double>' },
          zQuat: { type: 'optional<double>' },
          wQuat: { type: 'optional<double>' },
        },
        returns: 'null',
      },
      getRotation: {
        description: 'Returns the euler rotation of the studio camera in degrees as [x, y, z].',
        returns: 'double[]',
      },
      setTransformation: {
        description: 'Sets position, euler rotation, field of view and aspect ratio of the studio camera.',
        params: {
          xPos: { type: 'optional<double>', desc: 'Meters' },
          yPos: { type: 'optional<double>', desc: 'Meters' },
          zPos: { type: 'optional<double>', desc: 'Meters' },
          xRot: { type: 'optional<double>', desc: 'Degrees' },
          yRot: { type: 'optional<double>', desc: 'Degrees' },
          zRot: { type: 'optional<double>', desc: 'Degrees' },
          fov: { type: 'optional<double>', desc: 'Field of view, degrees' },
          aspectRatio: { type: 'optional<double>' },
        },
        returns: 'null',
      },
      setTransformationQuat: {
        description: 'Sets position, quaternion rotation, field of view and aspect ratio of the studio camera.',
        params: {
          xPos: { type: 'optional<double>', desc: 'Meters' },
          yPos: { type: 'optional<double>', desc: 'Meters' },
          zPos: { type: 'optional<double>', desc: 'Meters' },
          xQuat: { type: 'optional<double>' },
          yQuat: { type: 'optional<double>' },
          zQuat: { type: 'optional<double>' },
          wQuat: { type: 'optional<double>' },
          fov: { type: 'optional<double>', desc: 'Field of view, degrees' },
          aspectRatio: { type: 'optional<double>' },
        },
        returns: 'null',
      },
      setTransformationAndLensProps: {
        description: 'Sets position, euler rotation and all lens properties of the studio camera in one call.',
        params: {
          xPos: { type: 'double', desc: 'Meters' },
          yPos: { type: 'double', desc: 'Meters' },
          zPos: { type: 'double', desc: 'Meters' },
          xRot: { type: 'double', desc: 'Degrees' },
          yRot: { type: 'double', desc: 'Degrees' },
          zRot: { type: 'double', desc: 'Degrees' },
          fov: { type: 'double', desc: 'Field of view, degrees' },
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
        description: 'Sets position, quaternion rotation and all lens properties of the studio camera in one call.',
        params: {
          xPos: { type: 'double', desc: 'Meters' },
          yPos: { type: 'double', desc: 'Meters' },
          zPos: { type: 'double', desc: 'Meters' },
          xQuat: 'double',
          yQuat: 'double',
          zQuat: 'double',
          wQuat: 'double',
          fov: { type: 'double', desc: 'Field of view, degrees' },
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
        description: 'Sets position, euler rotation and extended lens properties (zoom, focal distance, distortion) in one call.',
        params: {
          xPos: { type: 'double', desc: 'Meters' },
          yPos: { type: 'double', desc: 'Meters' },
          zPos: { type: 'double', desc: 'Meters' },
          xRot: { type: 'double', desc: 'Degrees' },
          yRot: { type: 'double', desc: 'Degrees' },
          zRot: { type: 'double', desc: 'Degrees' },
          fov: { type: 'double', desc: 'Field of view, degrees' },
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
        description: 'Sets position, quaternion rotation and extended lens properties (zoom, focal distance, distortion) in one call.',
        params: {
          xPos: { type: 'double', desc: 'Meters' },
          yPos: { type: 'double', desc: 'Meters' },
          zPos: { type: 'double', desc: 'Meters' },
          xQuat: 'double',
          yQuat: 'double',
          zQuat: 'double',
          wQuat: 'double',
          fov: { type: 'double', desc: 'Field of view, degrees' },
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
      setTrackingInputPause: {
        description: 'Pauses or resumes the tracking input of the studio camera.',
        params: { pause: 'bool' },
        returns: 'null',
      },
      getTrackingInputPause: {
        description: 'Returns whether the tracking input is paused.',
        returns: 'bool',
      },
      setUsePositionPropertiesFromTracking: {
        description: 'Sets whether the position is taken from tracking.',
        params: { pause: { type: 'bool', desc: 'true = position is not taken from tracking' } },
        returns: 'null',
      },
      getUsePositionPropertiesFromTracking: {
        description: 'Returns whether the position is taken from tracking.',
        returns: 'bool',
      },
      setUseRotationPropertiesFromTracking: {
        description: 'Sets whether the rotation is taken from tracking.',
        params: { pause: { type: 'bool', desc: 'true = rotation is not taken from tracking' } },
        returns: 'null',
      },
      getUseRotationPropertiesFromTracking: {
        description: 'Returns whether the rotation is taken from tracking.',
        returns: 'bool',
      },
      setProjectOnAssociatedScreens: {
        description: 'Sets whether the camera projects onto its associated screens.',
        params: { state: 'bool' },
        returns: 'null',
      },
      getProjectOnAssociatedScreens: {
        description: 'Returns whether the camera projects onto its associated screens.',
        returns: 'bool',
      },
      moveToTop: {
        description: 'Moves the projected inner frustum rendering of this camera to the top among multiple studio cameras.',
        returns: 'null',
      },
      getInst: {
        description: 'Returns the handle of the child object at the given instance path.',
        params: { instancePath: 'string' },
        returns: 'handle',
      },
      getHandleFromInstancePath: {
        description: 'Returns the handle for the given instance path.',
        params: { instancePath: 'string' },
        returns: 'handle',
      },
      getInstancePath: {
        description: 'Returns the instance path of this object.',
        returns: 'string',
      },
    },
  },
  {
    scope: 'Pixera.Screens.ScreenGroup',
    isClass: true,
    title: 'Pixera screen group (object)',
    description:
      'A screen group in the Screens tab. Get a handle via pixera_screens action getScreenGroups (names via getScreenGroupNames).',
    actions: {
      getName: {
        description: 'Returns the name of the screen group.',
        returns: 'string',
      },
      getInst: {
        description: 'Returns the handle of the child object at the given instance path.',
        params: { instancePath: 'string' },
        returns: 'handle',
      },
      getHandleFromInstancePath: {
        description: 'Returns the handle for the given instance path.',
        params: { instancePath: 'string' },
        returns: 'handle',
      },
      getInstancePath: {
        description: 'Returns the instance path of this object.',
        returns: 'string',
      },
    },
  },
  {
    scope: 'Pixera.Screens.Perspective',
    isClass: true,
    title: 'Pixera perspective (object)',
    description:
      'The perspective (viewpoint) of a screen group, used for perspective-correct rendering. Get a handle via ' +
      'pixera_screens_screen action getPerspectives or getPerspectiveForScreenGroup.',
    actions: {
      getName: {
        description: 'Returns the name of the perspective.',
        returns: 'string',
      },
      setTransformation: {
        description: 'Sets position, rotation, field of view and aspect ratio of the perspective.',
        params: {
          xPos: { type: 'optional<double>', desc: 'Meters' },
          yPos: { type: 'optional<double>', desc: 'Meters' },
          zPos: { type: 'optional<double>', desc: 'Meters' },
          xRot: { type: 'optional<double>', desc: 'Degrees' },
          yRot: { type: 'optional<double>', desc: 'Degrees' },
          zRot: { type: 'optional<double>', desc: 'Degrees' },
          fov: { type: 'optional<double>', desc: 'Field of view, degrees' },
          aspectRatio: { type: 'optional<double>' },
          lockLookAtPt: { type: 'optional<bool>', desc: 'Lock the look-at point. Default false' },
        },
        returns: 'null',
      },
      setGeneralizedPerspectivePosition: {
        description: 'Sets the position of the perspective when generalized perspective projection is used.',
        params: {
          xPos: { type: 'optional<double>', desc: 'Meters' },
          yPos: { type: 'optional<double>', desc: 'Meters' },
          zPos: { type: 'optional<double>', desc: 'Meters' },
        },
        returns: 'null',
      },
      getInst: {
        description: 'Returns the handle of the child object at the given instance path.',
        params: { instancePath: 'string' },
        returns: 'handle',
      },
      getHandleFromInstancePath: {
        description: 'Returns the handle for the given instance path.',
        params: { instancePath: 'string' },
        returns: 'handle',
      },
      getInstancePath: {
        description: 'Returns the instance path of this object.',
        returns: 'string',
      },
    },
  },
  {
    scope: 'Pixera.Screens.TransformationNode',
    isClass: true,
    title: 'Pixera transformation node (object)',
    description:
      'A transformation node in the venue that groups objects and carries position, rotation and scale. Get a ' +
      'handle via pixera_screens action getTransformationNodes.',
    actions: {
      getName: {
        description: 'Returns the name of the transformation node.',
        returns: 'string',
      },
      setPosition: {
        description: 'Sets the position of the transformation node.',
        params: {
          xPos: { type: 'optional<double>', desc: 'Meters' },
          yPos: { type: 'optional<double>', desc: 'Meters' },
          zPos: { type: 'optional<double>', desc: 'Meters' },
        },
        returns: 'null',
      },
      getPosition: {
        description: 'Returns the position in meters as [x, y, z].',
        returns: 'double[]',
      },
      setRotation: {
        description: 'Sets the euler rotation of the transformation node.',
        params: {
          xRot: { type: 'optional<double>', desc: 'Degrees' },
          yRot: { type: 'optional<double>', desc: 'Degrees' },
          zRot: { type: 'optional<double>', desc: 'Degrees' },
        },
        returns: 'null',
      },
      getRotation: {
        description: 'Returns the euler rotation in degrees as [x, y, z].',
        returns: 'double[]',
      },
      setScale: {
        description: 'Sets the scale of the transformation node.',
        params: {
          xPos: { type: 'optional<double>', desc: 'X scale' },
          yPos: { type: 'optional<double>', desc: 'Y scale' },
          zPos: { type: 'optional<double>', desc: 'Z scale' },
        },
        returns: 'null',
      },
      getScale: {
        description: 'Returns the scale as [x, y, z].',
        returns: 'double[]',
      },
      getInst: {
        description: 'Returns the handle of the child object at the given instance path.',
        params: { instancePath: 'string' },
        returns: 'handle',
      },
      getHandleFromInstancePath: {
        description: 'Returns the handle for the given instance path.',
        params: { instancePath: 'string' },
        returns: 'handle',
      },
      getInstancePath: {
        description: 'Returns the instance path of this object.',
        returns: 'string',
      },
    },
  },
  {
    scope: 'Pixera.LiveSystems',
    isClass: false,
    title: 'Pixera live systems (namespace)',
    description:
      'Live systems (render machines) and multi-user members of the Pixera network, plus usage presets. Get ' +
      'LiveSystem handles via getLiveSystems, multi-user member handles via getMultiUserMembers and usage ' +
      'preset handles via getUsagePresets; use the matching pixera_livesystems_* tool for their methods.',
    actions: {
      getLiveSystems: {
        description: 'Returns handles to the live systems, including ones that are no longer connected.',
        returns: 'handle[]',
      },
      liveSystemNotAvailable: {
        description: 'Notifies that a live system has become unavailable.',
        params: {
          reason: { type: 'int', desc: 'Reason code for the unavailability' },
          system: 'handle',
        },
        returns: 'null',
      },
      getMultiUserMembers: {
        description: 'Returns handles to all multi-user members.',
        returns: 'handle[]',
      },
      getUsagePresets: {
        description: 'Returns handles to all usage presets.',
        returns: 'handle[]',
      },
    },
  },
  {
    scope: 'Pixera.LiveSystems.MultiUserMember',
    isClass: true,
    title: 'Pixera multi-user member (object)',
    description:
      'A multi-user member machine of the Pixera network: state, performance monitoring, power and engine control. ' +
      'Get a handle via pixera_livesystems action getMultiUserMembers.',
    actions: {
      getName: {
        description: 'Returns the hardware name of the multi-user member.',
        returns: 'string',
      },
      getIp: {
        description: 'Returns the IP address of the multi-user member.',
        returns: 'string',
      },
      getState: {
        description: 'Returns a description of the state of the multi-user member.',
        returns: 'string',
      },
      getPerformanceMonitoringValuesJson: {
        description: 'Returns the performance monitoring values of the multi-user member as a JSON string.',
        returns: 'string',
      },
      getPerformanceMonitoringValuesJsonEx: {
        description: 'Returns the filtered performance monitoring values as a JSON string.',
        params: {
          filter: {
            type: 'string',
            desc: 'Comma-separated sections, e.g. system,outputs,outputsIndividual,outputsTotal,unreal',
          },
        },
        returns: 'string',
      },
      resetCumulativePerformanceMonitoringValues: {
        description: 'Resets the cumulative performance monitoring values.',
        returns: 'null',
      },
      ensureFileDistribution: {
        description: 'Starts distributing the files used in a timeline to the multi-user member.',
        params: {
          includeNotUsedYet: {
            type: 'bool',
            desc: 'true = also distribute files not yet used in any timeline',
          },
        },
        returns: 'null',
      },
      shutDown: {
        description: 'Shuts down the multi-user member machine.',
        params: {
          mode: { type: 'int', desc: '1 = shut down, 2 = shut down and turn off power (if supported), 3 = shut down and reboot' },
        },
        returns: 'null',
      },
      wakeUp: {
        description: 'Tries to wake up the multi-user member.',
        returns: 'string',
      },
      getMacAddress: {
        description: 'Returns the MAC address of the multi-user member.',
        returns: 'string',
      },
      resetEngine: {
        description: 'Resets the engine of the multi-user member.',
        returns: 'null',
      },
      restartEngine: {
        description: 'Restarts the engine of the multi-user member.',
        returns: 'null',
      },
      startEngine: {
        description: 'Starts the engine of the multi-user member.',
        returns: 'null',
      },
      closeEngine: {
        description: 'Closes the engine of the multi-user member.',
        returns: 'null',
      },
      triggerBackup: {
        description: 'Triggers a backup of the multi-user member.',
        params: {
          applyControlCommand: { type: 'optional<bool>', desc: 'Default false' },
        },
        returns: 'null',
      },
      runControlAction: {
        description: 'Runs a control action on the multi-user member.',
        params: {
          action: { type: 'optional<string>', desc: 'Action name' },
          stringArgument: { type: 'optional<string>', desc: 'Argument for the action' },
        },
        returns: 'null',
      },
      getStructureJson: {
        description: 'Returns a JSON description of the hardware structure of the multi-user member.',
        returns: 'string',
      },
      getInst: {
        description: 'Returns the handle of the child object at the given instance path.',
        params: { instancePath: 'string' },
        returns: 'handle',
      },
    },
  },
  {
    scope: 'Pixera.LiveSystems.LiveSystem',
    isClass: true,
    title: 'Pixera live system (object)',
    description:
      'A live system (render machine) with its graphics devices, outputs, video streams, audio, backup, mappings and ' +
      'usage presets. Get a handle via pixera_livesystems action getLiveSystems.',
    actions: {
      ref: {
        description: 'Returns a self-reference handle to this live system (Pixera Control only).',
        returns: 'handle',
      },
      getName: {
        description: 'Returns the hardware name of the live system.',
        returns: 'string',
      },
      getIp: {
        description: 'Returns the IP address of the live system.',
        returns: 'string',
      },
      getState: {
        description: 'Returns a description of the state of the live system.',
        returns: 'string',
      },
      setBackupRole: {
        description: 'Sets the backup role of the live system.',
        params: { role: { type: 'int', desc: 'Backup role code (meaning not documented)' } },
        returns: 'null',
      },
      getBackupRole: {
        description: 'Returns the backup role of the live system.',
        returns: 'int',
      },
      getPerformanceMonitoringValuesJson: {
        description: 'Returns the performance monitoring values of the live system as a JSON string.',
        returns: 'string',
      },
      getPerformanceMonitoringValuesJsonEx: {
        description: 'Returns the filtered performance monitoring values as a JSON string.',
        params: {
          filter: {
            type: 'string',
            desc: 'Comma-separated sections, e.g. system,outputs,outputsIndividual,outputsTotal,unreal',
          },
        },
        returns: 'string',
      },
      resetCumulativePerformanceMonitoringValues: {
        description: 'Resets the cumulative performance monitoring values.',
        returns: 'null',
      },
      moveMappingsToOutputs: {
        description: 'Moves the mappings of a source to the outputs given by an output id path map.',
        params: {
          hdlSrc: 'handle',
          outputIdPathMapStr: { type: 'string', desc: 'Map of output ids to output paths (format as in the docs)' },
        },
        returns: 'null',
      },
      setUsagePresetName: {
        description: 'Sets the name of the current usage preset.',
        params: { name: 'string' },
        returns: 'null',
      },
      getUsagePresetName: {
        description: 'Returns the name of the current usage preset.',
        returns: 'string',
      },
      updateUsagePreset: {
        description: 'Updates the current usage preset with the current settings.',
        returns: 'null',
      },
      saveUsagePresetAs: {
        description: 'Saves the current settings as a new usage preset with the given name.',
        params: { name: 'string' },
        returns: 'null',
      },
      applyUsagePreset: {
        description: 'Applies the currently selected usage preset.',
        returns: 'null',
      },
      applyUsagePresetWithName: {
        description: 'Applies the usage preset with the given name.',
        params: { name: 'string' },
        returns: 'null',
      },
      exportUsagePreset: {
        description: 'Exports the current usage preset to a file.',
        params: { path: { type: 'string', desc: 'Absolute path on the Pixera machine' } },
        returns: 'null',
      },
      importUsagePreset: {
        description: 'Imports a usage preset from a file.',
        params: { path: { type: 'string', desc: 'Absolute path on the Pixera machine' } },
        returns: 'null',
      },
      clearExportedMappings: {
        description: 'Clears the exported mappings at a path.',
        params: {
          path: { type: 'string', desc: 'Absolute path on the Pixera machine' },
          onlyServicePath: { type: 'bool', desc: 'true = clear only the service path' },
        },
        returns: 'null',
      },
      exportMappings: {
        description: 'Exports the mappings to a file.',
        params: { path: { type: 'string', desc: 'Absolute path on the Pixera machine' } },
        returns: 'null',
      },
      importMappings: {
        description: 'Imports mappings from a file.',
        params: {
          path: { type: 'string', desc: 'Absolute path on the Pixera machine' },
          outputIdPathMapStr: { type: 'string', desc: 'Map of output ids to output paths (format as in the docs)' },
        },
        returns: 'null',
      },
      exportMappingsDirectly: {
        description: 'Exports the mappings directly to a file.',
        params: { path: { type: 'string', desc: 'Absolute path on the Pixera machine' } },
        returns: 'null',
      },
      importMappingsDirectly: {
        description: 'Imports mappings directly from a file.',
        params: {
          path: { type: 'string', desc: 'Absolute path on the Pixera machine' },
          outputIdPathMapStr: { type: 'string', desc: 'Map of output ids to output paths (format as in the docs)' },
        },
        returns: 'null',
      },
      exportMappingsToLiveSystemPath: {
        description: 'Exports the mappings to the live system path below the given parent path.',
        params: { parentPath: 'string' },
        returns: 'null',
      },
      importMappingsFromLiveSystemPath: {
        description: 'Imports the mappings from the live system path below the given parent path.',
        params: { parentPath: 'string' },
        returns: 'null',
      },
      clearExportedMappingsAtLiveSystemPath: {
        description: 'Clears the exported mappings at a live system path.',
        params: { path: 'string' },
        returns: 'null',
      },
      ensureFileDistribution: {
        description: 'Starts distributing the files used in a timeline to the live system.',
        params: {
          includeNotUsedYet: {
            type: 'bool',
            desc: 'true = also distribute files not yet used in any timeline',
          },
        },
        returns: 'null',
      },
      shutDown: {
        description: 'Shuts down the live system machine.',
        params: {
          mode: { type: 'int', desc: '1 = shut down, 2 = shut down and turn off power (if supported), 3 = shut down and reboot' },
        },
        returns: 'null',
      },
      wakeUp: {
        description: 'Tries to wake up the live system.',
        returns: 'string',
      },
      getMacAddress: {
        description: 'Returns the MAC address of the live system.',
        returns: 'string',
      },
      getGraphicsDevices: {
        description: 'Returns handles to the graphics devices of the live system.',
        returns: 'handle[]',
      },
      getEnabledOutputs: {
        description: 'Returns handles to all enabled outputs of the live system.',
        returns: 'handle[]',
      },
      getAllOutputs: {
        description: 'Returns handles to all outputs, even if they are not physically connected.',
        returns: 'handle[]',
      },
      getVideoStreamOutputs: {
        description: 'Returns handles to all video stream outputs (NDI, Art-Net, etc.).',
        returns: 'handle[]',
      },
      getVideoStreamInputs: {
        description: 'Returns handles to all video stream inputs (NDI, Art-Net, etc.).',
        returns: 'handle[]',
      },
      resetEngine: {
        description: 'Resets the engine of the live system.',
        returns: 'null',
      },
      restartEngine: {
        description: 'Restarts the engine of the live system.',
        returns: 'null',
      },
      startEngine: {
        description: 'Starts the engine of the live system.',
        returns: 'null',
      },
      closeEngine: {
        description: 'Closes the engine of the live system.',
        returns: 'null',
      },
      setAudioMasterVolume: {
        description: 'Sets the audio master volume of a channel.',
        params: {
          channel: { type: 'int', desc: 'Audio channel index' },
          volume: 'double',
        },
        returns: 'null',
      },
      getAudioMasterVolume: {
        description: 'Returns the audio master volume of a channel.',
        params: { channel: { type: 'int', desc: 'Audio channel index' } },
        returns: 'double',
      },
      setAudioMasterMute: {
        description: 'Sets the audio master mute state of a channel.',
        params: {
          channel: { type: 'int', desc: 'Audio channel index' },
          state: { type: 'bool', desc: 'true = muted' },
        },
        returns: 'null',
      },
      getAudioMasterMute: {
        description: 'Returns the audio master mute state of a channel.',
        params: { channel: { type: 'int', desc: 'Audio channel index' } },
        returns: 'bool',
      },
      toggleAudioMasterMute: {
        description: 'Toggles the audio master mute state of a channel.',
        params: { channel: { type: 'int', desc: 'Audio channel index' } },
        returns: 'null',
      },
      setAudioTimecodeInput: {
        description: 'Sets whether a channel takes audio timecode input.',
        params: {
          channel: { type: 'int', desc: 'Audio channel index' },
          state: { type: 'bool', desc: 'true = enabled' },
        },
        returns: 'null',
      },
      triggerBackup: {
        description: 'Triggers a backup of the live system.',
        params: {
          applyControlCommand: { type: 'optional<bool>', desc: 'Default false' },
        },
        returns: 'null',
      },
      getBackupIpAddress: {
        description: 'Returns the backup IP address of the live system.',
        returns: 'string',
      },
      deleteUnusedFilesFromCache: {
        description: 'Deletes files from the RX cache that are not used in the current project.',
        returns: 'null',
      },
      getStructureJson: {
        description: 'Returns a JSON description of the hardware structure of the live system.',
        returns: 'string',
      },
      getInst: {
        description: 'Returns the handle of the child object at the given instance path.',
        params: { instancePath: 'string' },
        returns: 'handle',
      },
      getInstancePath: {
        description: 'Returns the instance path of this object.',
        returns: 'string',
      },
    },
  },
  {
    scope: 'Pixera.LiveSystems.UsagePreset',
    isClass: true,
    title: 'Pixera usage preset (object)',
    description:
      'A usage preset that stores live system settings and can be applied to a live system. Get a handle via ' +
      'pixera_livesystems action getUsagePresets.',
    actions: {
      getName: {
        description: 'Returns the name of the usage preset.',
        returns: 'string',
      },
      update: {
        description: 'Updates the usage preset with the current settings.',
        returns: 'null',
      },
      apply: {
        description: 'Applies the usage preset to the live system at the given IP address.',
        params: { destinationIp: { type: 'string', desc: 'IP address of the target live system' } },
        returns: 'null',
      },
      importFromFile: {
        description: 'Imports the usage preset from a file.',
        params: { path: { type: 'string', desc: 'Absolute path on the Pixera machine' } },
        returns: 'null',
      },
      exportToFile: {
        description: 'Exports the usage preset to a file.',
        params: { path: { type: 'string', desc: 'Absolute path on the Pixera machine' } },
        returns: 'null',
      },
      getInst: {
        description: 'Returns the handle of the child object at the given instance path.',
        params: { instancePath: 'string' },
        returns: 'handle',
      },
      getInstancePath: {
        description: 'Returns the instance path of this object.',
        returns: 'string',
      },
    },
  },
  {
    scope: 'Pixera.LiveSystems.GraphicsDevice',
    isClass: true,
    title: 'Pixera graphics device (object)',
    description:
      'A graphics device (GPU) of a live system that owns outputs. Get a handle via pixera_livesystems_live_system ' +
      'action getGraphicsDevices.',
    actions: {
      getName: {
        description: 'Returns the name of the graphics device.',
        returns: 'string',
      },
      getEnabledOutputs: {
        description: 'Returns handles to all enabled outputs of the graphics device.',
        returns: 'handle[]',
      },
      getAllOutputs: {
        description: 'Returns handles to all outputs of the graphics device, even if they are not physically connected.',
        returns: 'handle[]',
      },
      getInst: {
        description: 'Returns the handle of the child object at the given instance path.',
        params: { instancePath: 'string' },
        returns: 'handle',
      },
      getInstancePath: {
        description: 'Returns the instance path of this object.',
        returns: 'string',
      },
    },
  },
  {
    scope: 'Pixera.LiveSystems.Output',
    isClass: true,
    title: 'Pixera output (object)',
    description:
      'A physical display output of a graphics device, with active/identify state and aggregate (multi-output) settings. ' +
      'Get a handle via pixera_livesystems_live_system action getAllOutputs or getEnabledOutputs, or pixera_livesystems_graphics_device.',
    actions: {
      getName: {
        description: 'Returns the name of the output.',
        returns: 'string',
      },
      setActive: {
        description: 'Sets the output active or inactive.',
        params: { active: 'bool' },
        returns: 'null',
      },
      getActive: {
        description: 'Returns whether the output is active.',
        returns: 'bool',
      },
      setIdentify: {
        description: 'Sets the identify state of the output.',
        params: { state: 'bool' },
        returns: 'null',
      },
      getIdentify: {
        description: 'Returns the identify state of the output.',
        returns: 'bool',
      },
      getAssignedScreens: {
        description: 'Returns handles to the screens assigned to the output.',
        returns: 'handle[]',
      },
      getAssignedProjectors: {
        description: 'Returns handles to the projectors assigned to the output.',
        returns: 'handle[]',
      },
      getEnabled: {
        description: 'Returns whether the output is enabled.',
        returns: 'bool',
      },
      getForPreview: {
        description: 'Returns whether the output is used for the preview.',
        returns: 'bool',
      },
      setIsOutputAggregate: {
        description: 'Sets whether the output is an aggregate of several outputs.',
        params: { state: 'bool' },
        returns: 'null',
      },
      getIsOutputAggregate: {
        description: 'Returns whether the output is an aggregate of several outputs.',
        returns: 'bool',
      },
      setAggregateDims: {
        description: 'Sets the horizontal and vertical aggregate dimensions of the output.',
        params: {
          horizontalCount: { type: 'int', desc: 'Number of outputs horizontally' },
          verticalCount: { type: 'int', desc: 'Number of outputs vertically' },
        },
        returns: 'null',
      },
      getAggregateDims: {
        description: 'Returns the aggregate dimensions of the output as [horizontal, vertical].',
        returns: 'int[]',
      },
      getInst: {
        description: 'Returns the handle of the child object at the given instance path.',
        params: { instancePath: 'string' },
        returns: 'handle',
      },
      getInstancePath: {
        description: 'Returns the instance path of this object.',
        returns: 'string',
      },
    },
  },
  {
    scope: 'Pixera.LiveSystems.VideoStream',
    isClass: true,
    title: 'Pixera video stream (object)',
    description:
      'A video stream input or output of a live system (NDI, Art-Net, etc.) with its IP address and availability. ' +
      'Get a handle via pixera_livesystems_live_system action getVideoStreamOutputs or getVideoStreamInputs.',
    actions: {
      getName: {
        description: 'Returns the name of the video stream.',
        returns: 'string',
      },
      setActive: {
        description: 'Sets the video stream active or inactive.',
        params: { active: 'bool' },
        returns: 'null',
      },
      getActive: {
        description: 'Returns whether the video stream is active.',
        returns: 'bool',
      },
      getAvailable: {
        description: 'Returns whether the video stream is available.',
        returns: 'bool',
      },
      getIpAddress: {
        description: 'Returns the IP address of the video stream.',
        returns: 'string',
      },
      setIpAddress: {
        description: 'Sets the IP address of the video stream.',
        params: { ipAddress: { type: 'string', desc: 'IPv4 address, e.g. 192.168.0.10' } },
        returns: 'null',
      },
      getDeviceType: {
        description: 'Returns the device type of the video stream as a string.',
        returns: 'string',
      },
      getInst: {
        description: 'Returns the handle of the child object at the given instance path.',
        params: { instancePath: 'string' },
        returns: 'handle',
      },
      getInstancePath: {
        description: 'Returns the instance path of this object.',
        returns: 'string',
      },
    },
  },
];
