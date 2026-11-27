/**
 * Which Pixera scopes each area module owns (no imports, so tooling can load one
 * area in isolation). The coverage checker verifies every scope here is fully and
 * exactly implemented by its module, and that every scope in pixera_api.json is owned.
 */
export const AREA_SCOPES: Record<string, { file: string; scopes: string[] }> = {
  utility: {
    file: 'src/tools/utility.ts',
    scopes: ['Pixera.Utility', 'Pixera.Unreal.Utility'],
  },
  timelines: {
    file: 'src/tools/timelines.ts',
    scopes: ['Pixera.Timelines', 'Pixera.Timelines.Timeline', 'Pixera.Timelines.Layer'],
  },
  'timeline-items': {
    file: 'src/tools/timeline-items.ts',
    scopes: [
      'Pixera.Timelines.Clip',
      'Pixera.Timelines.Node',
      'Pixera.Timelines.Param',
      'Pixera.Timelines.Cue',
      'Pixera.Compound',
    ],
  },
  resources: {
    file: 'src/tools/resources.ts',
    scopes: [
      'Pixera.Resources',
      'Pixera.Resources.ResourceFolder',
      'Pixera.Resources.TranscodingFolder',
      'Pixera.Resources.Resource',
      'Pixera.Resources.UnrealWorld',
      'Pixera.Projectors',
      'Pixera.Projectors.Projector',
    ],
  },
  screens: {
    file: 'src/tools/screens.ts',
    scopes: [
      'Pixera.Screens',
      'Pixera.Screens.Screen',
      'Pixera.Screens.StudioCamera',
      'Pixera.Screens.ScreenGroup',
      'Pixera.Screens.Perspective',
      'Pixera.Screens.TransformationNode',
      'Pixera.LiveSystems',
      'Pixera.LiveSystems.MultiUserMember',
      'Pixera.LiveSystems.LiveSystem',
      'Pixera.LiveSystems.UsagePreset',
      'Pixera.LiveSystems.GraphicsDevice',
      'Pixera.LiveSystems.Output',
      'Pixera.LiveSystems.VideoStream',
    ],
  },
  system: {
    file: 'src/tools/system.ts',
    scopes: [
      'Pixera.Network',
      'Pixera.Network.Conveyor',
      'Pixera.Session',
      'Pixera.Settings.SettingsGeneral',
      'Pixera.Settings.SettingsTranscoding',
      'Pixera.Settings.SettingsResourceDistribution',
      'Pixera.Calibration',
      'Pixera.WebViews',
      'Pixera.Ui',
      'Pixera.Ui.ComboBox',
      'Pixera.Ui.Control',
      'Pixera.Ui.PreviewCameras',
      'Pixera.Ui.PreviewCameras.PreviewCamera',
      'Pixera.Direct',
      'Pixera.Direct.Projector',
      'Pixera.Direct.Screen',
      'Pixera.Direct.Param',
      'Pixera.Direct.Camera',
      'Pixera.Direct.Perspective',
    ],
  },
};

