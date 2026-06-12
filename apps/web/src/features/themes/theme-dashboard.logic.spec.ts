import { createThemeFromPreset, normalizeTheme } from '@the-wedding/shared';
import {
  draftFromPreset,
  findInitialTheme,
  shouldUpdateExistingTheme,
} from './theme-dashboard.logic';

describe('theme dashboard flow', () => {
  it('selects the active theme when loading tenant themes', () => {
    const themes = [
      { ...createThemeFromPreset('neon-romance'), id: 'theme-a', isActive: false },
      { ...createThemeFromPreset('city-pop'), id: 'theme-b', isActive: true },
    ];

    expect(findInitialTheme(themes)?.id).toBe('theme-b');
  });

  it('applies a preset into a normalized draft for preview and save', () => {
    const draft = draftFromPreset('garden-glow');

    expect(draft.presetId).toBe('garden-glow');
    expect(draft.layoutType).toBe('carousel');
  });

  it('chooses update instead of create when the selected theme still exists', () => {
    const themes = [{ id: 'theme-1' }, { id: 'theme-2' }];

    expect(shouldUpdateExistingTheme('theme-2', themes)).toBe(true);
    expect(shouldUpdateExistingTheme('missing', themes)).toBe(false);
  });

  it('keeps dirty draft changes separate until save', () => {
    const base = normalizeTheme(createThemeFromPreset('soft-editorial'));
    const dirty = normalizeTheme({
      ...base,
      colors: { ...base.colors, primary: '#123456' },
    });

    expect(dirty.colors.primary).toBe('#123456');
    expect(base.colors.primary).not.toBe('#123456');
  });
});
