export const LAYOUT_TYPES = {
  GRID: 'grid',
  MASONRY: 'masonry',
  CAROUSEL: 'carousel',
  STORY: 'story',
  TIMELINE: 'timeline',
} as const;

export type LayoutType = (typeof LAYOUT_TYPES)[keyof typeof LAYOUT_TYPES];

export const THEME_STYLE_TYPES = {
  CLASSIC: 'classic',
  EDITORIAL: 'editorial',
  PLAYFUL: 'playful',
  CINEMATIC: 'cinematic',
} as const;

export type ThemeStyleType = (typeof THEME_STYLE_TYPES)[keyof typeof THEME_STYLE_TYPES];

export const THEME_ANIMATION_TYPES = {
  NONE: 'none',
  SOFT: 'soft',
  FLOAT: 'float',
  SNAP: 'snap',
} as const;

export type ThemeAnimationType = (typeof THEME_ANIMATION_TYPES)[keyof typeof THEME_ANIMATION_TYPES];

export type ThemeColors = {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  text: string;
  muted: string;
};

export type ThemeTypography = {
  headingFont: string;
  bodyFont: string;
  headingWeight: number;
  bodyWeight: number;
};

export type ThemeConfig = {
  borderRadius: number;
  heroStyle: 'split' | 'centered' | 'magazine';
  mediaDensity: 'airy' | 'balanced' | 'compact';
  overlayOpacity: number;
};

export type WeddingTheme = {
  id?: string;
  tenantId?: string;
  presetId: ThemePresetId;
  name: string;
  colors: ThemeColors;
  typography: ThemeTypography;
  layoutType: LayoutType;
  styleType: ThemeStyleType;
  animationType: ThemeAnimationType;
  config: ThemeConfig;
  customCss?: string | null;
  isActive?: boolean;
  createdAt?: string | Date;
  updatedAt?: string | Date;
};

export type ThemePreset = WeddingTheme & {
  presetId: ThemePresetId;
  labelKey: string;
  descriptionKey: string;
};

export const THEME_PRESETS = [
  {
    presetId: 'neon-romance',
    labelKey: 'themes.presets.neonRomance.name',
    descriptionKey: 'themes.presets.neonRomance.description',
    name: 'Neon Romance',
    colors: {
      primary: '#ff4f8b',
      secondary: '#21d4fd',
      background: '#fff7fb',
      surface: '#ffffff',
      text: '#191019',
      muted: '#6f5f69',
    },
    typography: {
      headingFont: 'Inter',
      bodyFont: 'Inter',
      headingWeight: 800,
      bodyWeight: 500,
    },
    layoutType: LAYOUT_TYPES.MASONRY,
    styleType: THEME_STYLE_TYPES.PLAYFUL,
    animationType: THEME_ANIMATION_TYPES.SNAP,
    config: {
      borderRadius: 18,
      heroStyle: 'centered',
      mediaDensity: 'balanced',
      overlayOpacity: 0.18,
    },
  },
  {
    presetId: 'soft-editorial',
    labelKey: 'themes.presets.softEditorial.name',
    descriptionKey: 'themes.presets.softEditorial.description',
    name: 'Soft Editorial',
    colors: {
      primary: '#8b5cf6',
      secondary: '#f59e0b',
      background: '#faf7ff',
      surface: '#ffffff',
      text: '#21172d',
      muted: '#71657f',
    },
    typography: {
      headingFont: 'Georgia',
      bodyFont: 'Inter',
      headingWeight: 700,
      bodyWeight: 400,
    },
    layoutType: LAYOUT_TYPES.STORY,
    styleType: THEME_STYLE_TYPES.EDITORIAL,
    animationType: THEME_ANIMATION_TYPES.SOFT,
    config: {
      borderRadius: 10,
      heroStyle: 'magazine',
      mediaDensity: 'airy',
      overlayOpacity: 0.24,
    },
  },
  {
    presetId: 'city-pop',
    labelKey: 'themes.presets.cityPop.name',
    descriptionKey: 'themes.presets.cityPop.description',
    name: 'City Pop',
    colors: {
      primary: '#00a6a6',
      secondary: '#ffb703',
      background: '#f3fffb',
      surface: '#ffffff',
      text: '#102322',
      muted: '#5e706f',
    },
    typography: {
      headingFont: 'Arial',
      bodyFont: 'Arial',
      headingWeight: 800,
      bodyWeight: 500,
    },
    layoutType: LAYOUT_TYPES.GRID,
    styleType: THEME_STYLE_TYPES.PLAYFUL,
    animationType: THEME_ANIMATION_TYPES.FLOAT,
    config: {
      borderRadius: 14,
      heroStyle: 'split',
      mediaDensity: 'compact',
      overlayOpacity: 0.12,
    },
  },
  {
    presetId: 'midnight-film',
    labelKey: 'themes.presets.midnightFilm.name',
    descriptionKey: 'themes.presets.midnightFilm.description',
    name: 'Midnight Film',
    colors: {
      primary: '#f4d35e',
      secondary: '#ee6c4d',
      background: '#111318',
      surface: '#1b1f2a',
      text: '#fffdf4',
      muted: '#c3bdad',
    },
    typography: {
      headingFont: 'Georgia',
      bodyFont: 'Inter',
      headingWeight: 700,
      bodyWeight: 400,
    },
    layoutType: LAYOUT_TYPES.TIMELINE,
    styleType: THEME_STYLE_TYPES.CINEMATIC,
    animationType: THEME_ANIMATION_TYPES.SOFT,
    config: {
      borderRadius: 8,
      heroStyle: 'centered',
      mediaDensity: 'balanced',
      overlayOpacity: 0.42,
    },
  },
  {
    presetId: 'garden-glow',
    labelKey: 'themes.presets.gardenGlow.name',
    descriptionKey: 'themes.presets.gardenGlow.description',
    name: 'Garden Glow',
    colors: {
      primary: '#2f9e44',
      secondary: '#ff8787',
      background: '#f8fff6',
      surface: '#ffffff',
      text: '#172417',
      muted: '#647264',
    },
    typography: {
      headingFont: 'Georgia',
      bodyFont: 'Arial',
      headingWeight: 700,
      bodyWeight: 400,
    },
    layoutType: LAYOUT_TYPES.CAROUSEL,
    styleType: THEME_STYLE_TYPES.CLASSIC,
    animationType: THEME_ANIMATION_TYPES.FLOAT,
    config: {
      borderRadius: 20,
      heroStyle: 'split',
      mediaDensity: 'airy',
      overlayOpacity: 0.16,
    },
  },
] as const satisfies readonly ThemePreset[];

export type ThemePresetId = string;

export const DEFAULT_THEME_PRESET_ID = 'neon-romance';

export function getThemePreset(presetId: string): ThemePreset {
  return THEME_PRESETS.find((preset) => preset.presetId === presetId) ?? THEME_PRESETS[0];
}

export function createThemeFromPreset(presetId = DEFAULT_THEME_PRESET_ID): WeddingTheme {
  const preset = getThemePreset(presetId);
  return {
    presetId: preset.presetId,
    name: preset.name,
    colors: { ...preset.colors },
    typography: { ...preset.typography },
    layoutType: preset.layoutType,
    styleType: preset.styleType,
    animationType: preset.animationType,
    config: { ...preset.config },
    customCss: null,
  };
}

export function normalizeTheme(input: Partial<WeddingTheme>): WeddingTheme {
  const base = createThemeFromPreset(input.presetId);
  return {
    ...base,
    ...input,
    presetId: input.presetId || base.presetId,
    name: cleanThemeName(input.name ?? base.name),
    colors: normalizeThemeColors({ ...base.colors, ...input.colors }),
    typography: normalizeThemeTypography({ ...base.typography, ...input.typography }),
    layoutType: isLayoutType(input.layoutType) ? input.layoutType : base.layoutType,
    styleType: isThemeStyleType(input.styleType) ? input.styleType : base.styleType,
    animationType: isThemeAnimationType(input.animationType)
      ? input.animationType
      : base.animationType,
    config: normalizeThemeConfig({ ...base.config, ...input.config }),
    customCss: input.customCss?.trim() ? input.customCss.slice(0, 4000) : null,
  };
}

export function validateTheme(input: Partial<WeddingTheme>): string[] {
  const errors: string[] = [];
  const base = createThemeFromPreset(input.presetId);
  const theme = {
    ...base,
    ...input,
    colors: { ...base.colors, ...input.colors },
    typography: { ...base.typography, ...input.typography },
    config: { ...base.config, ...input.config },
  };

  if (theme.name.length < 2 || theme.name.length > 80) {
    errors.push('Theme name must be 2-80 characters.');
  }

  for (const [key, value] of Object.entries(theme.colors)) {
    if (!isHexColor(value)) {
      errors.push(`${key} must be a valid hex color.`);
    }
  }

  if (!isLayoutType(theme.layoutType)) {
    errors.push('layoutType is not supported.');
  }

  if (!isThemeStyleType(theme.styleType)) {
    errors.push('styleType is not supported.');
  }

  if (!isThemeAnimationType(theme.animationType)) {
    errors.push('animationType is not supported.');
  }

  if (
    !Number.isFinite(Number(theme.config.borderRadius)) ||
    theme.config.borderRadius < 0 ||
    theme.config.borderRadius > 32
  ) {
    errors.push('borderRadius must be between 0 and 32.');
  }

  if (
    !Number.isFinite(Number(theme.config.overlayOpacity)) ||
    theme.config.overlayOpacity < 0 ||
    theme.config.overlayOpacity > 0.75
  ) {
    errors.push('overlayOpacity must be between 0 and 0.75.');
  }

  return errors;
}

function normalizeThemeColors(colors: ThemeColors): ThemeColors {
  return {
    primary: normalizeHex(colors.primary),
    secondary: normalizeHex(colors.secondary),
    background: normalizeHex(colors.background),
    surface: normalizeHex(colors.surface),
    text: normalizeHex(colors.text),
    muted: normalizeHex(colors.muted),
  };
}

function normalizeThemeTypography(typography: ThemeTypography): ThemeTypography {
  return {
    headingFont: cleanFont(typography.headingFont),
    bodyFont: cleanFont(typography.bodyFont),
    headingWeight: clampWeight(typography.headingWeight),
    bodyWeight: clampWeight(typography.bodyWeight),
  };
}

function normalizeThemeConfig(config: ThemeConfig): ThemeConfig {
  return {
    borderRadius: clampNumber(config.borderRadius, 0, 32),
    heroStyle: ['split', 'centered', 'magazine'].includes(config.heroStyle)
      ? config.heroStyle
      : 'centered',
    mediaDensity: ['airy', 'balanced', 'compact'].includes(config.mediaDensity)
      ? config.mediaDensity
      : 'balanced',
    overlayOpacity: clampNumber(config.overlayOpacity, 0, 0.75),
  };
}

function cleanThemeName(value: string) {
  return value.trim().slice(0, 80) || 'Custom Theme';
}

function cleanFont(value: string) {
  const clean = value
    .trim()
    .replace(/[^a-zA-Z0-9 ,'-]/g, '')
    .slice(0, 80);
  return clean || 'Inter';
}

function normalizeHex(value: string) {
  const clean = value.trim();
  return isHexColor(clean) ? clean.toLowerCase() : '#000000';
}

function isHexColor(value: string) {
  return /^#[0-9a-fA-F]{6}$/.test(value);
}

function clampWeight(value: number) {
  const rounded = Math.round(Number(value) / 100) * 100;
  return clampNumber(Number.isFinite(rounded) ? rounded : 400, 300, 900);
}

function clampNumber(value: number, min: number, max: number) {
  const numberValue = Number(value);
  if (!Number.isFinite(numberValue)) {
    return min;
  }

  return Math.min(max, Math.max(min, numberValue));
}

function isLayoutType(value: unknown): value is LayoutType {
  return Object.values(LAYOUT_TYPES).includes(value as LayoutType);
}

function isThemeStyleType(value: unknown): value is ThemeStyleType {
  return Object.values(THEME_STYLE_TYPES).includes(value as ThemeStyleType);
}

function isThemeAnimationType(value: unknown): value is ThemeAnimationType {
  return Object.values(THEME_ANIMATION_TYPES).includes(value as ThemeAnimationType);
}
