import type { ToolGroup } from '../types.js';

// Resource type values used by getResourcesOfType (Resource.getType returns the name instead).
const RES_TYPE_DESC =
  'Resource type: 1 Fx, 2 Video, 3 Image, 4 Audio, 5 3DModel, 6 Image Sequence, 7 Live Input, 8 Text, ' +
  '9 Script, 10 Timed Property, 11 Web Script, 12 Color, 13 Compositing, 14 Web Browser, 16 Raw Texture, ' +
  '17 Layer Reference, 18 Multi Resource, 19 Multi Fx, 20 Content Mapping, 21 Color LUT, 22 Mask';

// Area module - see src/tools/areas.ts for the scopes this file must cover,
// and src/tools/utility.ts for the template to follow.
export const groups: ToolGroup[] = [
  {
    scope: 'Pixera.Resources',
    isClass: false,
    title: 'Pixera resources (namespace)',
    description:
      'Namespace of the resource tree in the Compositing tab. Get folder handles via getResourceFolders or ' +
      'getResourceFolderWithNamePath (pixera_resources_resource_folder handles), and resource handles via ' +
      'getResources or getResourcesOfType (pixera_resources_resource handles). getTranscodingFolders returns ' +
      'pixera_resources_transcoding_folder handles.',
    actions: {
      getResources: {
        description: 'Handles to all resources in the resource tree, including those in subfolders.',
        returns: 'handle[]',
      },
      getResourcesOfType: {
        description: 'Handles to all resources of the given type, including those in subfolders.',
        params: { resType: { type: 'int', desc: RES_TYPE_DESC } },
        returns: 'handle[]',
      },
      getResourceFolderWithNamePath: {
        description: 'Handle to the resource folder at the given name path.',
        params: {
          namePath: {
            type: 'string',
            desc: "Path from the root, names separated by '/', e.g. 'Media/Std Backgrounds/Atmospherics'",
          },
        },
        returns: 'handle',
      },
      getResourceFolders: {
        description: 'Handles to the top-level resource folders.',
        returns: 'handle[]',
      },
      getTranscodingFolders: {
        description: 'Handles to the transcoding folders.',
        returns: 'handle[]',
      },
      getJsonDescrip: {
        description: 'JSON description of the resources (not documented in the API comments).',
        returns: 'string',
      },
    },
  },
  {
    scope: 'Pixera.Resources.ResourceFolder',
    isClass: true,
    title: 'Pixera resource folder (object)',
    description:
      'A folder in the resource tree. Get a handle via pixera_resources action getResourceFolders or ' +
      'getResourceFolderWithNamePath (child folders: action getResourceFolders on a folder handle). ' +
      'Resource handles of a folder come from getResources, getResourceByName or getResourceAtIndex.',
    actions: {
      ref: {
        description: 'Returns a handle to this folder (self-reference).',
        returns: 'handle',
      },
      getName: {
        description: 'Name of the folder.',
        returns: 'string',
      },
      setName: {
        description: 'Renames the folder.',
        params: { name: 'string' },
        returns: 'null',
      },
      getResourceFolders: {
        description: 'Handles to the immediate child folders of this folder.',
        returns: 'handle[]',
      },
      getResources: {
        description: 'Handles to the resources directly in this folder (not in subfolders).',
        returns: 'handle[]',
      },
      getResourcesOfType: {
        description: 'Handles to all resources of the given type in this folder and its subfolders.',
        params: { resType: { type: 'int', desc: RES_TYPE_DESC } },
        returns: 'handle[]',
      },
      getResourceAtIndex: {
        description: 'Handle to the resource at the given index in this folder.',
        params: { index: { type: 'int', desc: 'Index within this folder (index base not documented)' } },
        returns: 'handle',
      },
      getResourceByName: {
        description: 'Handle to the resource with the given name in this folder.',
        params: { name: 'string' },
        returns: 'handle',
      },
      addResource: {
        description: 'Adds a file to this folder and returns the handle of the new resource.',
        params: { path: { type: 'string', desc: 'Absolute path of the file on the Pixera machine' } },
        returns: 'handle',
      },
      addResourcesFromDirectory: {
        description: 'Adds all files of a directory to this folder and returns the handles of the new resources.',
        params: {
          path: { type: 'string', desc: 'Absolute path of the directory on the Pixera machine' },
          removeOthers: {
            type: 'bool',
            desc: 'true = remove resources from the folder whose files are missing in the directory (assets kept)',
          },
          checkRedundancy: {
            type: 'bool',
            desc: 'true = only add files whose names are not already in the folder',
          },
        },
        returns: 'handle[]',
      },
      addResourcesFromDirectoryRemoveAssets: {
        description:
          'Like addResourcesFromDirectory, but resources removed as missing also have their assets deleted.',
        params: {
          path: { type: 'string', desc: 'Absolute path of the directory on the Pixera machine' },
          removeOthers: {
            type: 'bool',
            desc: 'true = remove resources from the folder whose files are missing in the directory (assets removed too)',
          },
          checkRedundancy: {
            type: 'bool',
            desc: 'true = only add files whose names are not already in the folder',
          },
        },
        returns: 'handle[]',
      },
      addInternalResource: {
        description: 'Creates an internal resource (text, colour, web, timeline reference or multi) in this folder.',
        params: {
          signature: 'string',
          resKind: { type: 'int', desc: '0 Text, 1 Colour, 2 Web, 3 Timeline reference, 4 Multi' },
        },
        returns: 'handle',
      },
      createFoldersFrom: {
        description: 'Creates the folder hierarchy given by a path below this folder.',
        params: {
          path: { type: 'string', desc: "Relative path below this folder, e.g. 'my/new/folders'" },
        },
        returns: 'null',
      },
      refreshResources: {
        description: 'Reloads all resource files of this folder from disk and redistributes changed ones.',
        returns: 'null',
      },
      moveResourceToThis: {
        description: 'Moves the resource with the given id into this folder.',
        params: { id: { type: 'double', desc: 'Resource id (see pixera_resources_resource getId)' } },
        returns: 'null',
      },
      removeThis: {
        description: 'Removes this folder from the resource tree; assets are kept.',
        returns: 'null',
      },
      removeThisIncludingAssets: {
        description: 'Removes this folder and permanently deletes the assets of its resources on all systems.',
        returns: 'null',
      },
      removeAllContents: {
        description: 'Removes all resources and subfolders of this folder; assets are kept.',
        returns: 'null',
      },
      removeAllContentsIncludingAssets: {
        description: 'Removes all resources and subfolders of this folder and permanently deletes their assets.',
        returns: 'null',
      },
      deleteAllContentsAssetsFromLiveSystem: {
        description: 'Permanently deletes the assets of this folder contents from the given live system.',
        params: { apEntityLiveSystemHandle: 'handle' },
        returns: 'null',
      },
      resetDistributionTargets: {
        description: 'Resets the distribution targets from the file distribution settings and distributes if needed.',
        returns: 'null',
      },
      changeDistributionTarget: {
        description: 'Sets whether the resources of this folder are distributed to the given live system.',
        params: {
          apEntityLiveSystemHandle: 'handle',
          shouldDistribute: { type: 'bool', desc: 'true = distribute to this live system, false = do not' },
        },
        returns: 'null',
      },
      setWatchFolder: {
        description: 'Configures watching a directory for file changes; omitted optional parameters are optional.',
        params: {
          path: { type: 'optional<string>', desc: 'Directory to watch (absolute path on the Pixera machine)' },
          watchForChanges: { type: 'optional<bool>', desc: 'Watch the directory for file changes' },
          removeResourceIfDeleted: { type: 'optional<bool>', desc: 'Remove the resource when its file is deleted' },
          autodetectImageSequence: { type: 'optional<bool>', desc: 'Detect image sequences automatically' },
          loadFileAsNewVersionOfSubElements: {
            type: 'optional<bool>',
            desc: 'Load changed files as a new version of the sub-elements',
          },
        },
        returns: 'null',
      },
      getWatchFolderAsJsonString: {
        description: 'Watch folder settings as a JSON string.',
        returns: 'string',
      },
      replaceResourcesByString: {
        description: 'Replaces searchString with replaceString in resource paths (not documented; inferred from name).',
        params: {
          searchString: 'string',
          replaceString: 'string',
          path: 'string',
        },
        returns: 'null',
      },
      multiUserPush: {
        description: 'Pushes this folder to the other multi-user members.',
        returns: 'null',
      },
      multiUserPull: {
        description: 'Pulls this folder from the multi-user member with the given IP address.',
        params: { sourceIp: { type: 'string', desc: 'IP address of the multi-user member' } },
        returns: 'null',
      },
      getInst: {
        description: 'Handle of the object at an instance path (not documented in the API comments).',
        params: { instancePath: { type: 'string', desc: 'Instance path as returned by getInstancePath' } },
        returns: 'handle',
      },
      getHandleFromInstancePath: {
        description: 'Handle for an instance path (not documented in the API comments).',
        params: { instancePath: { type: 'string', desc: 'Instance path as returned by getInstancePath' } },
        returns: 'handle',
      },
      getInstancePath: {
        description: 'Instance path of this folder (not documented in the API comments).',
        returns: 'string',
      },
      getDmxId: {
        description: 'DMX id of this folder.',
        returns: 'int',
      },
      getCombinedDmxId: {
        description: 'Combined DMX id: folder id << 16 plus resource id.',
        returns: 'int',
      },
      setDmxId: {
        description: 'Sets the DMX id of this folder.',
        params: { id: 'int' },
        returns: 'null',
      },
      distributeResources: {
        description: 'Distributes the resources of this folder to the clients, optionally including subfolders.',
        params: { includeSubFolders: 'bool' },
        returns: 'null',
      },
    },
  },
  {
    scope: 'Pixera.Resources.TranscodingFolder',
    isClass: true,
    title: 'Pixera transcoding folder (object)',
    description:
      'The transcoding folder that receives resources to be transcoded. Get a handle via pixera_resources action ' +
      'getTranscodingFolders. Transcoding of a single resource is started with pixera_resources_resource action ' +
      'transcodeWithExisitngPreset or transcodeWithSettings.',
    actions: {
      getUsedTranscodingPreset: {
        description: 'Name of the transcoding preset currently used by this folder.',
        returns: 'string',
      },
      setUsedTranscodingPreset: {
        description: 'Sets the transcoding preset used by this folder.',
        params: { preset: { type: 'string', desc: 'Name of an existing transcoding preset' } },
        returns: 'null',
      },
      getTranscodeAutomatically: {
        description: 'True if resources are transcoded automatically when moved into this folder.',
        returns: 'bool',
      },
      setTranscodeAutomatically: {
        description: 'Enables or disables automatic transcoding of resources in this folder.',
        params: { autoTranscode: 'bool' },
        returns: 'null',
      },
      getUseRxCacheAsDestination: {
        description: 'True if the RX cache is used as the transcoding destination.',
        returns: 'bool',
      },
      setRxCacheAsDestination: {
        description: 'Sets whether the RX cache is used as the transcoding destination.',
        params: { useRxCache: 'bool' },
        returns: 'null',
      },
      getDestinationDirectory: {
        description: 'Destination directory for transcoded files.',
        returns: 'string',
      },
      setDestinationDirectory: {
        description: 'Sets the destination directory for transcoded files.',
        params: { path: { type: 'string', desc: 'Absolute path on the Pixera machine' } },
        returns: 'null',
      },
    },
  },
  {
    scope: 'Pixera.Resources.Resource',
    isClass: true,
    title: 'Pixera resource (object)',
    description:
      'A single resource (media file, text, colour, web, live input, multi resource, ...). Get a handle via ' +
      'pixera_resources action getResources or getResourcesOfType, or via pixera_resources_resource_folder ' +
      'actions getResources, getResourceByName or getResourceAtIndex. Some methods only apply to certain resource types.',
    actions: {
      ref: {
        description: 'Returns a handle to this resource (self-reference).',
        returns: 'handle',
      },
      removeThis: {
        description: 'Removes the resource from the resource tree; assets are kept.',
        returns: 'null',
      },
      deleteFilesOnSystems: {
        description: 'Permanently deletes the assets of this resource from all systems that store them.',
        returns: 'null',
      },
      removeThisIncludingAssets: {
        description: 'Removes the resource and permanently deletes its assets on all systems.',
        returns: 'null',
      },
      deleteAssetFromLiveSystem: {
        description: 'Permanently deletes the asset of this resource from the given live system.',
        params: { apEntityLiveSystemHandle: 'handle' },
        returns: 'null',
      },
      resetDistributionTargets: {
        description: 'Resets the distribution targets from the file distribution settings and distributes if needed.',
        returns: 'null',
      },
      changeDistributionTarget: {
        description: 'Sets whether this resource is distributed to the given live system.',
        params: {
          apEntityLiveSystemHandle: 'handle',
          shouldDistribute: { type: 'bool', desc: 'true = distribute to this live system, false = do not' },
        },
        returns: 'null',
      },
      getName: {
        description: 'Name of the resource.',
        returns: 'string',
      },
      setName: {
        description: 'Renames the resource.',
        params: { name: 'string' },
        returns: 'null',
      },
      getFps: {
        description: 'Frame rate of the resource.',
        returns: 'double',
      },
      getResolution: {
        description: 'Resolution of the resource as [width, height] in pixels.',
        returns: 'double[]',
      },
      setResolution: {
        description: 'Sets the resolution of the resource.',
        params: {
          x: { type: 'double', desc: 'Width in pixels' },
          y: { type: 'double', desc: 'Height in pixels' },
        },
        returns: 'null',
      },
      setColorLut: {
        description: 'Updates the colour LUT values of a Color LUT resource.',
        params: {
          values: { type: 'float[]', desc: 'size*size*size RGB triplets, i.e. length 3*size*size*size' },
          size: 'int',
        },
        returns: 'null',
      },
      getMetadataAsJson: {
        description: 'Metadata of the resource as a JSON string.',
        returns: 'string',
      },
      getIsActive: {
        description: 'Active state of a Live Input resource.',
        returns: 'bool',
      },
      setActive: {
        description: 'Sets the active state of a Live Input resource.',
        params: { active: 'bool' },
        returns: 'null',
      },
      getVideoStreamInputs: {
        description: 'Available video inputs of a Live Input resource.',
        returns: 'handle[]',
      },
      getVideoStreamModes: {
        description: 'Available video modes of a Live Input resource (not all have a list).',
        returns: 'string[]',
      },
      setVideoStreamMode: {
        description: 'Sets the video mode of a Live Input resource by its index in getVideoStreamModes.',
        params: { index: { type: 'int', desc: 'Index into getVideoStreamModes' } },
        returns: 'null',
      },
      getId: {
        description: 'Numeric id of the resource; use it where a handle cannot be passed.',
        returns: 'double',
      },
      getDuration: {
        description: 'Duration of the resource in seconds.',
        returns: 'double',
      },
      getType: {
        description: 'Type name of the resource.',
        returns: 'string',
      },
      setCurrentVersion: {
        description: 'Sets the current version of the resource.',
        params: { version: { type: 'string', desc: 'Version name, one of getVersions' } },
        returns: 'null',
      },
      getCurrentVersion: {
        description: 'Name of the current version of the resource.',
        returns: 'string',
      },
      getVersions: {
        description: 'Names of all versions of the resource.',
        returns: 'string[]',
      },
      getVersionSuffix: {
        description: 'Version suffixes of the resource (first entry is the begin suffix).',
        returns: 'string[]',
      },
      rescanVersions: {
        description: 'Rescans the versions of the resource from disk.',
        returns: 'null',
      },
      getThumbnailAsBase64: {
        description: 'PNG thumbnail of the resource as a base64 string (256 x 174 px).',
        returns: 'string',
      },
      getHasPendingTransfer: {
        description: 'True if a transfer of this resource is pending.',
        returns: 'bool',
      },
      getIsInUse: {
        description: 'True if the resource is currently referred to in a timeline (clip or dominant value); the API returns a double.',
        returns: 'double',
      },
      getLastUsageBeginTime: {
        description: 'Time the resource was first used in a timeline, in ms since 1970-01-01 UTC; 0 if never used.',
        returns: 'double',
      },
      getLastUsageBeginTimeAsString: {
        description: 'Time the resource was first used in a timeline as ISO-8601 string; empty if never used.',
        returns: 'string',
      },
      getLastUsageEndTime: {
        description: 'Time the resource was removed from the last timeline, in ms since 1970-01-01 UTC; 0 if never used or still in use.',
        returns: 'double',
      },
      getLastUsageEndTimeAsString: {
        description: 'Time the resource was removed from the last timeline as ISO-8601 string; empty if never used or still in use.',
        returns: 'string',
      },
      getFilePath: {
        description: 'System file path of the resource.',
        returns: 'string',
      },
      setText: {
        description: 'Sets the text of a Text resource.',
        params: { text: 'string' },
        returns: 'null',
      },
      getText: {
        description: 'Text of a Text resource.',
        returns: 'string',
      },
      setFontWithName: {
        description: 'Sets the font of a Text resource by font name.',
        params: { fontName: 'string' },
        returns: 'bool',
      },
      getFontName: {
        description: 'Font name of a Text resource.',
        returns: 'string',
      },
      setFontWithPath: {
        description: 'Sets the font of a Text resource by font file path.',
        params: { fontPath: { type: 'string', desc: 'Absolute path of the font file' } },
        returns: 'bool',
      },
      setHorizontalTextAlignment: {
        description: 'Sets the horizontal text alignment of a Text resource.',
        params: { textAlignment: { type: 'int', desc: '0 Left, 1 Center, 2 Right' } },
        returns: 'bool',
      },
      getHorizontalTextAlignment: {
        description: 'Horizontal text alignment of a Text resource.',
        returns: 'int',
      },
      setVerticalTextAlignment: {
        description: 'Sets the vertical text alignment of a Text resource.',
        params: { textAlignment: { type: 'int', desc: '0 Top, 1 Center, 2 Bottom' } },
        returns: 'bool',
      },
      getVerticalTextAlignment: {
        description: 'Vertical text alignment of a Text resource.',
        returns: 'int',
      },
      setLineHeight: {
        description: 'Sets the line height of a Text resource.',
        params: { lineHeight: 'double' },
        returns: 'bool',
      },
      getLineHeight: {
        description: 'Line height of a Text resource.',
        returns: 'double',
      },
      getTextMeasurementsWidthAndHeight: {
        description: 'Width and height in pixels of the rectangle enclosing the text of a Text resource.',
        returns: 'int[]',
      },
      setUrl: {
        description: 'Sets the URL of a Web Browser resource.',
        params: { url: 'string' },
        returns: 'null',
      },
      getUrl: {
        description: 'URL of a Web Browser resource.',
        returns: 'string',
      },
      setColorTransformPath: {
        description: 'Sets the colour transformation file path (deprecated; use setColorTransformLutResource).',
        params: { colorTransformPath: 'string' },
        returns: 'null',
      },
      setColorTransformLutResource: {
        description: 'Sets the Color LUT resource used for colour correction of this resource.',
        params: { resourcePath: { type: 'string', desc: 'Resource path of the Color LUT resource' } },
        returns: 'null',
      },
      getColorTransformPath: {
        description: 'Colour transformation file path of this resource.',
        returns: 'string',
      },
      getColorTransformLutResource: {
        description: 'Handle of the Color LUT resource used for colour correction of this resource.',
        returns: 'handle',
      },
      clearColorTransformPath: {
        description: 'Clears the colour transformation file path.',
        returns: 'null',
      },
      refresh: {
        description: 'Reloads the file from disk, redistributes changed files and creates a new preview.',
        params: { text: 'string' },
        returns: 'null',
      },
      distribute: {
        description: 'Distributes the file to the clients.',
        returns: 'null',
      },
      getDmxId: {
        description: 'DMX id of the resource.',
        returns: 'int',
      },
      setDmxId: {
        description: 'Sets the DMX id of the resource.',
        params: { id: 'int' },
        returns: 'null',
      },
      removeMultiresourceIndex: {
        description: 'Removes the Multi resource item at the given index.',
        params: { index: { type: 'int', desc: 'Index of the multi resource item' } },
        returns: 'null',
      },
      addMultiresourceItem: {
        description: 'Adds a resource as item to a Multi resource.',
        params: { id: { type: 'double', desc: 'Resource id (see getId)' } },
        returns: 'null',
      },
      getMultiresourceItems: {
        description: 'Handles to the items of a Multi resource.',
        returns: 'handle[]',
      },
      replaceMultiresourceItemByIndex: {
        description: 'Replaces the Multi resource item at the given index with another resource.',
        params: {
          index: { type: 'int', desc: 'Index of the multi resource item' },
          id: { type: 'double', desc: 'Resource id (see getId)' },
        },
        returns: 'null',
      },
      setMultiresourceResolution: {
        description: 'Sets the resolution of a Multi resource.',
        params: { width: 'int', height: 'int' },
        returns: 'null',
      },
      setMultiresourceItemSizebyIndex: {
        description: 'Sets the size of a Multi resource item.',
        params: {
          index: { type: 'int', desc: 'Index of the multi resource item' },
          width: { type: 'double', desc: 'Relative width, 1.0 = full' },
          height: { type: 'double', desc: 'Relative height, 1.0 = full' },
        },
        returns: 'null',
      },
      setMultiresourceItemPositionbyIndex: {
        description: 'Sets the position of a Multi resource item.',
        params: {
          index: { type: 'int', desc: 'Index of the multi resource item' },
          x: 'double',
          y: 'double',
        },
        returns: 'null',
      },
      setUseGradient: {
        description: 'Makes a Color resource show a gradient between its colours.',
        params: { useGradient: 'bool' },
        returns: 'null',
      },
      getUseGradient: {
        description: 'True if a Color resource shows a gradient.',
        returns: 'bool',
      },
      setColors: {
        description: 'Sets all colours of a Color resource.',
        params: {
          argbCols: { type: 'uint[]', desc: 'Colours as ARGB: a << 24 | r << 16 | g << 8 | b' },
          positions: 'double[]',
          colNames: 'string[]',
          useGradient: 'optional<bool>',
        },
        returns: 'null',
      },
      setColorAtIndex: {
        description: 'Sets one colour of a Color resource; appended if the index does not exist.',
        params: {
          index: 'int',
          red: { type: 'int', desc: '0..255' },
          green: { type: 'int', desc: '0..255' },
          blue: { type: 'int', desc: '0..255' },
          alpha: { type: 'int', desc: '0..255' },
          position: 'double',
          name: 'string',
          useGradient: 'optional<bool>',
        },
        returns: 'null',
      },
      getColorAtIndex: {
        description: 'Colour at the index as ARGB in one 32-bit integer (a << 24 | r << 16 | g << 8 | b).',
        params: { colorIndex: 'int' },
        returns: 'int',
      },
      getColorPositionAtIndex: {
        description: 'Position of the colour at the index.',
        params: { colorIndex: 'int' },
        returns: 'double',
      },
      launchVirtualWorld: {
        description: 'Launches or kills the virtual (Unreal) world of this resource.',
        params: { action: { type: 'string', desc: "'run' to launch, 'kill' to stop" } },
        returns: 'null',
      },
      getUnrealWorld: {
        description: 'Handle to the Unreal world of this resource (pixera_resources_unreal_world).',
        returns: 'handle',
      },
      setMultiResourceItemRestrictedServiceIps: {
        description: 'Restricts a Multi resource item to the services with the given IP addresses.',
        params: {
          itemIndex: 'int',
          ipAdresses: { type: 'string[]', desc: 'IP addresses of the allowed services' },
        },
        returns: 'null',
      },
      getMultiResourceItemRestrictedServiceIps: {
        description: 'IP addresses a Multi resource item is restricted to.',
        params: { itemIndex: 'int' },
        returns: 'string[]',
      },
      replace: {
        description: 'Replaces the resource file with the file at the given path (not documented; inferred from name).',
        params: { path: { type: 'string', desc: 'Absolute path on the Pixera machine' } },
        returns: 'null',
      },
      setCompositingResourceCreateLayerScreenAligned: {
        description: 'Sets whether Compositing resource layers are created screen aligned (true) or with transform parameters (false).',
        params: { createLayerScreenAligned: 'bool' },
        returns: 'null',
      },
      getCompositingResourceCreateLayerScreenAligned: {
        description: 'True if Compositing resource layers are created screen aligned.',
        returns: 'bool',
      },
      setCompositingResourceUseCustomFps: {
        description: 'Enables or disables a custom frame rate for a Compositing resource.',
        params: {
          useCustomFps: 'bool',
          customFps: { type: 'optional<double>', desc: 'Custom frame rate to set' },
        },
        returns: 'null',
      },
      getCompositingResourceUseCustomFps: {
        description: 'True if a Compositing resource uses a custom frame rate.',
        returns: 'bool',
      },
      getCompositingResourceCustomFps: {
        description: 'Custom frame rate of a Compositing resource; -1.0 if it does not use one.',
        returns: 'double',
      },
      multiUserPush: {
        description: 'Pushes this resource to the other multi-user members.',
        returns: 'null',
      },
      multiUserPull: {
        description: 'Pulls this resource from the multi-user member with the given IP address.',
        params: { sourceIp: { type: 'string', desc: 'IP address of the multi-user member' } },
        returns: 'null',
      },
      getInst: {
        description: 'Handle of the object at an instance path (not documented in the API comments).',
        params: { instancePath: { type: 'string', desc: 'Instance path as returned by getInstancePath' } },
        returns: 'handle',
      },
      getHandleFromInstancePath: {
        description: 'Handle for an instance path (not documented in the API comments).',
        params: { instancePath: { type: 'string', desc: 'Instance path as returned by getInstancePath' } },
        returns: 'handle',
      },
      getInstancePath: {
        description: 'Instance path of this resource (not documented in the API comments).',
        returns: 'string',
      },
      transcodeWithExisitngPreset: {
        description: 'Moves the resource to the transcoding folder and transcodes it with an existing preset found by name.',
        params: {
          presetName: 'string',
          useRxCache: 'bool',
          destinationPath: 'string',
          startFrame: { type: 'int', desc: 'First frame; 0 = from the start' },
          endFrame: { type: 'int', desc: 'Last frame; -1 = to the end' },
          serviceId: { type: 'uint', desc: 'Currently not used' },
        },
        returns: 'null',
      },
      transcodeWithSettings: {
        description: 'Moves the resource to the transcoding folder and transcodes it with a preset given as JSON.',
        params: {
          settings: { type: 'string', desc: 'Transcoding preset as JSON string (see Transcoding addOrChangePreset)' },
          useRxCache: 'bool',
          destinationPath: 'string',
          startFrame: { type: 'int', desc: 'First frame; 0 = from the start' },
          endFrame: { type: 'int', desc: 'Last frame; -1 = to the end' },
          serviceId: { type: 'uint', desc: 'Currently not used' },
        },
        returns: 'null',
      },
      moveToTranscodingFolder: {
        description: 'Moves the resource into the transcoding folder at the given path.',
        params: { folderPath: { type: 'string', desc: 'Path of the transcoding folder' } },
        returns: 'null',
      },
      setLayerReference: {
        description: 'Sets the layer that a Layer Reference resource refers to.',
        params: { layerToReference: 'handle' },
        returns: 'null',
      },
      setUpLayerReference: {
        description: 'Sets the layer that a Layer Reference resource refers to, with a resolution.',
        params: {
          layerToReference: 'handle',
          resX: 'double',
          resY: 'double',
        },
        returns: 'null',
      },
    },
  },
  {
    scope: 'Pixera.Resources.UnrealWorld',
    isClass: true,
    title: 'Pixera Unreal world (object)',
    description:
      'The Unreal Engine world attached to an Unreal resource. Get a handle via pixera_resources_resource action ' +
      'getUnrealWorld. Methods without documentation are described from their names.',
    actions: {
      setProjectPath: {
        description: 'Sets the path of the Unreal project.',
        params: { projectPath: { type: 'string', desc: 'Absolute path of the Unreal project' } },
        returns: 'null',
      },
      getProjectPath: {
        description: 'Path of the Unreal project.',
        returns: 'string',
      },
      getLevelNames: {
        description: 'Names of the levels in the Unreal project.',
        returns: 'string[]',
      },
      loadLevel: {
        description: 'Loads a level of the Unreal project.',
        params: { levelName: 'string' },
        returns: 'null',
      },
      setCustomArgumentState: {
        description: 'Enables or disables a custom command-line argument for launching Unreal.',
        params: { customArgument: 'string', isActive: 'bool' },
        returns: 'null',
      },
      getCustomArgumentState: {
        description: 'True if a custom command-line argument is enabled.',
        params: { customArgument: 'string' },
        returns: 'bool',
      },
      setCustomArguments: {
        description: 'Sets the custom command-line arguments for launching Unreal.',
        params: { customArguments: 'string[]' },
        returns: 'null',
      },
      getCustomArguments: {
        description: 'Custom command-line arguments for launching Unreal.',
        returns: 'string[]',
      },
      setPrimaryRenderNode: {
        description: 'Sets the primary render node by IP address.',
        params: { nodeIp: { type: 'string', desc: 'IP address of the render node' } },
        returns: 'bool',
      },
      getPrimaryRenderNodeIp: {
        description: 'IP address of the primary render node.',
        returns: 'string',
      },
      setSyncFramesLatency: {
        description: 'Sets the sync latency in frames.',
        params: { frames: { type: 'int', desc: 'Latency in frames' } },
        returns: 'null',
      },
      getSyncFramesLatency: {
        description: 'Sync latency in frames.',
        returns: 'int',
      },
      setUpdateInterval: {
        description: 'Sets the update interval (units not documented).',
        params: { interval: 'int' },
        returns: 'null',
      },
      getUpdateInterval: {
        description: 'Update interval (units not documented).',
        returns: 'int',
      },
      setAlphaHandling: {
        description: 'Sets the alpha handling mode (values not documented).',
        params: { mode: 'int' },
        returns: 'null',
      },
      getAlphaHandling: {
        description: 'Alpha handling mode (values not documented).',
        returns: 'int',
      },
      getEventTriggerNames: {
        description: 'Names of the event triggers in the Unreal project.',
        returns: 'string[]',
      },
      triggerEventByName: {
        description: 'Triggers an event trigger by its name.',
        params: { triggerName: 'string' },
        returns: 'null',
      },
      createNDisplayConfig: {
        description: 'Creates an nDisplay configuration (not documented in the API comments).',
        returns: 'null',
      },
      setLaunchParticipants: {
        description: 'Sets the participants launched together with Unreal.',
        params: { participantNames: 'string[]' },
        returns: 'null',
      },
      getLaunchParticipants: {
        description: 'Participants launched together with Unreal.',
        returns: 'string[]',
      },
      runUnreal: {
        description: 'Launches Unreal for this world.',
        returns: 'null',
      },
      killUnreal: {
        description: 'Kills the running Unreal instance(s).',
        params: { byProcessIds: { type: 'optional<bool>', desc: 'Meaning not documented' } },
        returns: 'null',
      },
      distributeProjectToClients: {
        description: 'Distributes the Unreal project to the clients.',
        params: { useIgnoreFile: { type: 'bool', desc: 'Apply the ignore file (inferred from name)' } },
        returns: 'null',
      },
      getName: {
        description: 'Name of the Unreal world.',
        returns: 'string',
      },
      getInst: {
        description: 'Handle of the object at an instance path (not documented in the API comments).',
        params: { instancePath: { type: 'string', desc: 'Instance path as returned by getInstancePath' } },
        returns: 'handle',
      },
      getHandleFromInstancePath: {
        description: 'Handle for an instance path (not documented in the API comments).',
        params: { instancePath: { type: 'string', desc: 'Instance path as returned by getInstancePath' } },
        returns: 'handle',
      },
      getInstancePath: {
        description: 'Instance path of this Unreal world (not documented in the API comments).',
        returns: 'string',
      },
    },
  },
  {
    scope: 'Pixera.Projectors',
    isClass: false,
    title: 'Pixera projectors (namespace)',
    description:
      'Projectors in the Mapping tab (venue). Get handles via getProjectors or getProjectorWithName ' +
      '(pixera_projectors_projector handles); addProjector creates a new projector from a projector library template.',
    actions: {
      getProjectorWithName: {
        description: 'Handle to the projector with the given name.',
        params: { name: { type: 'string', desc: 'Projector name as shown in the inspector' } },
        returns: 'handle',
      },
      getProjectors: {
        description: 'Handles to all projectors in the Mapping tab.',
        returns: 'handle[]',
      },
      getProjectorNames: {
        description: 'Names of all projectors in the Mapping tab.',
        returns: 'string[]',
      },
      addProjector: {
        description: 'Adds a projector to the venue from a projector library template and returns its handle.',
        params: {
          libraryPath: {
            type: 'string',
            desc:
              "Template path built from library signatures, separated by '/' or '.', e.g. 'Barco/UDX 4K32' or " +
              "'Generic.Generic Projector'; empty or not found = generic projector",
          },
          name: { type: 'optional<string>', desc: 'Projector name as shown in the inspector' },
          xPos: { type: 'optional<double>', desc: 'Position in meters (as in the inspector); omitted = 0' },
          yPos: { type: 'optional<double>', desc: 'Position in meters (as in the inspector); omitted = 0' },
          zPos: { type: 'optional<double>', desc: 'Position in meters (as in the inspector); omitted = 0' },
        },
        returns: 'handle',
      },
    },
  },
  {
    scope: 'Pixera.Projectors.Projector',
    isClass: true,
    title: 'Pixera projector (object)',
    description:
      'A projector in the Mapping tab. Get a handle via pixera_projectors actions getProjectors, getProjectorWithName ' +
      'or addProjector. Positions are in meters, rotations and lens values as in the inspector.',
    actions: {
      getPosition: {
        description: 'Position of the projector in meters.',
        returns: 'ProjectorPosValues',
      },
      setPosition: {
        description: 'Sets the position of the projector in meters; omitted coordinates are optional.',
        params: {
          xPos: { type: 'optional<double>', desc: 'Meters' },
          yPos: { type: 'optional<double>', desc: 'Meters' },
          zPos: { type: 'optional<double>', desc: 'Meters' },
        },
        returns: 'bool',
      },
      getRotation: {
        description: 'Rotation of the projector.',
        returns: 'ProjectorPosValues',
      },
      setRotation: {
        description: 'Sets the rotation of the projector; omitted axes are left out of the call.',
        params: {
          xRot: 'optional<double>',
          yRot: 'optional<double>',
          zRot: 'optional<double>',
        },
        returns: 'bool',
      },
      getName: {
        description: 'Name of the projector.',
        returns: 'string',
      },
      activateScreenMapping: {
        description: 'Activates or deactivates a screen mapping of the projector.',
        params: {
          screenId: { type: 'double', desc: 'Screen id (Screen getId), not the handle' },
          isActive: 'bool',
        },
        returns: 'null',
      },
      setBlackout: {
        description: 'Turns the projector blackout on or off.',
        params: { isActive: 'bool' },
        returns: 'null',
      },
      getBlackout: {
        description: 'True if the projector blackout is active.',
        returns: 'bool',
      },
      setRenderOrderId: {
        description: 'Sets the render order id of a screen mapping.',
        params: {
          screenId: { type: 'double', desc: 'Screen id (Screen getId), not the handle' },
          orderId: 'int',
        },
        returns: 'null',
      },
      getRenderOrderId: {
        description: 'Render order id of a screen mapping.',
        params: { screenId: { type: 'double', desc: 'Screen id (Screen getId), not the handle' } },
        returns: 'int',
      },
      setSoftedgeVisible: {
        description: 'Shows or hides the softedge of a screen.',
        params: {
          screenName: { type: 'string', desc: 'Screen name; empty = apply to all screens' },
          visible: 'bool',
        },
        returns: 'null',
      },
      resetAllColorCorrections: {
        description: 'Resets all colour corrections of the projector.',
        returns: 'null',
      },
      setColorCorrectionWithPath: {
        description: 'Sets one colour correction value by path.',
        params: {
          path: { type: 'string', desc: 'Colour correction path (format not documented)' },
          value: 'float',
        },
        returns: 'null',
      },
      getColorCorrectionWithPath: {
        description: 'One colour correction value by path.',
        params: { path: { type: 'string', desc: 'Colour correction path (format not documented)' } },
        returns: 'float',
      },
      setColorCorrectionAsJsonString: {
        description: 'Sets all colour corrections from a JSON string.',
        params: { colorCorrection: 'string' },
        returns: 'null',
      },
      getColorCorrectionAsJsonString: {
        description: 'All colour corrections as a JSON string.',
        returns: 'string',
      },
      getOutput: {
        description: 'Handle to an output (Output or Stream) of the projector.',
        params: { index: { type: 'optional<int>', desc: 'Output index; omitted = first output' } },
        returns: 'handle',
      },
      setOutput: {
        description: 'Replaces all outputs of the projector with the given Output or Stream.',
        params: { outputHandle: 'handle' },
        returns: 'null',
      },
      setOutputExt: {
        description: 'Sets an output at an aggregate position, optionally clearing the other outputs.',
        params: {
          outputHandle: 'handle',
          aggregateIndexHor: { type: 'int', desc: 'Horizontal position in an aggregate output; -1 for both indices = no position' },
          aggregateIndexVer: { type: 'int', desc: 'Vertical position in an aggregate output; -1 for both indices = no position' },
          clearOthers: { type: 'bool', desc: 'true = clear the other outputs first' },
        },
        returns: 'bool',
      },
      clearOutput: {
        description: 'Removes one assigned output (Output or Stream).',
        params: {
          outputHandle: 'handle',
          aggregateIndexHor: { type: 'int', desc: 'Horizontal position in an aggregate output' },
          aggregateIndexVer: { type: 'int', desc: 'Vertical position in an aggregate output' },
        },
        returns: 'bool',
      },
      clearOutputs: {
        description: 'Removes all assigned outputs.',
        returns: 'bool',
      },
      setHorizontalLensShift: {
        description: 'Sets the horizontal lens shift.',
        params: { value: 'double' },
        returns: 'null',
      },
      getHorizontalLensShift: {
        description: 'Horizontal lens shift.',
        returns: 'double',
      },
      setVerticalLensShift: {
        description: 'Sets the vertical lens shift.',
        params: { value: 'double' },
        returns: 'null',
      },
      getVerticalLensShift: {
        description: 'Vertical lens shift.',
        returns: 'double',
      },
      setBrightness: {
        description: 'Sets the brightness; only works for the generic projector.',
        params: { value: 'int' },
        returns: 'null',
      },
      getBrightness: {
        description: 'Brightness of the projector.',
        returns: 'int',
      },
      setFov: {
        description: 'Sets the lens field of view.',
        params: { value: 'double' },
        returns: 'null',
      },
      getFov: {
        description: 'Lens field of view.',
        returns: 'double',
      },
      setThrowRatio: {
        description: 'Sets the lens throw ratio.',
        params: { value: 'double' },
        returns: 'null',
      },
      getThrowRatio: {
        description: 'Lens throw ratio.',
        returns: 'double',
      },
      setLookAtPoint: {
        description: 'Sets the look-at point of the projector in meters.',
        params: {
          x: { type: 'double', desc: 'Meters' },
          y: { type: 'double', desc: 'Meters' },
          z: { type: 'double', desc: 'Meters' },
        },
        returns: 'null',
      },
      getLookAtPoint: {
        description: 'Look-at point of the projector as [x, y, z] in meters.',
        returns: 'double[]',
      },
      setResolution: {
        description: 'Sets the projector resolution; only possible while not connected to an output.',
        params: {
          x: { type: 'int', desc: 'Width in pixels' },
          y: { type: 'int', desc: 'Height in pixels' },
        },
        returns: 'null',
      },
      getResolution: {
        description: 'Resolution of the projector as [x, y] in pixels; with an output connected this is the output resolution.',
        returns: 'int[]',
      },
      getInst: {
        description: 'Handle of the object at an instance path (not documented in the API comments).',
        params: { instancePath: { type: 'string', desc: 'Instance path as returned by getInstancePath' } },
        returns: 'handle',
      },
      getHandleFromInstancePath: {
        description: 'Handle for an instance path (not documented in the API comments).',
        params: { instancePath: { type: 'string', desc: 'Instance path as returned by getInstancePath' } },
        returns: 'handle',
      },
      getInstancePath: {
        description: 'Instance path of this projector (not documented in the API comments).',
        returns: 'string',
      },
    },
  },
];
