import {
  createThemeFromPreset,
  normalizeTheme,
  validateTheme,
} from '@the-wedding/shared';

describe('shared theme validation', () => {
  it('accepts a valid preset theme', () => {
    const theme = createThemeFromPreset('city-pop');
    expect(validateTheme(theme)).toEqual([]);
  });

  it('rejects invalid hex colors', () => {
    const theme = createThemeFromPreset();
    expect(
      validateTheme({
        ...theme,
        colors: { ...theme.colors, primary: 'not-a-color' },
      }),
    ).toContain('primary must be a valid hex color.');
  });

  it('rejects theme names outside the allowed length', () => {
    expect(validateTheme({ name: 'a' })).toContain('Theme name must be 2-80 characters.');
  });

  it('normalizes partial theme input onto the selected preset', () => {
    const base = createThemeFromPreset('midnight-film');
    const normalized = normalizeTheme({
      presetId: 'midnight-film',
      colors: { ...base.colors, primary: '#112233' },
    });

    expect(normalized.presetId).toBe('midnight-film');
    expect(normalized.colors.primary).toBe('#112233');
    expect(normalized.layoutType).toBe('timeline');
  });
});
