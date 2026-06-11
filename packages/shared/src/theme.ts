export const THEME_PRESETS = [
  'Classic Wedding',
  'Modern Minimal',
  'Romantic Pink',
  'Luxury Gold',
  'Nature Outdoor',
  'Dark Elegant',
  'Film Style',
  'Magazine Layout',
] as const;

export type ThemePresetName = (typeof THEME_PRESETS)[number];

export const LAYOUT_TYPES = {
  GRID: 'grid',
  MASONRY: 'masonry',
  CAROUSEL: 'carousel',
  STORY: 'story',
  TIMELINE: 'timeline',
} as const;

export type LayoutType = (typeof LAYOUT_TYPES)[keyof typeof LAYOUT_TYPES];
