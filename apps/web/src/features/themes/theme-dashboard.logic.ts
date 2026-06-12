import { createThemeFromPreset, normalizeTheme, type WeddingTheme } from '@the-wedding/shared';

export function findInitialTheme<T extends WeddingTheme & { isActive?: boolean }>(themes: T[]) {
  return themes.find((theme) => theme.isActive) ?? themes[0] ?? null;
}

export function shouldUpdateExistingTheme(
  selectedThemeId: string | undefined,
  themes: { id: string }[],
) {
  return Boolean(selectedThemeId && themes.some((theme) => theme.id === selectedThemeId));
}

export function draftFromPreset(presetId: string) {
  return normalizeTheme(createThemeFromPreset(presetId));
}
