'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  LAYOUT_TYPES,
  THEME_ANIMATION_TYPES,
  THEME_PRESETS,
  createThemeFromPreset,
  normalizeTheme,
  type WeddingTheme,
} from '@the-wedding/shared';
import { t } from '@/lib/i18n/locales';
import { listTenants, type Tenant } from '@/features/tenants/tenant-api';
import {
  activateTheme,
  cloneTheme,
  createTheme,
  listThemes,
  resetTheme,
  updateTheme,
  type Theme,
} from './theme-api';
import {
  draftFromPreset,
  findInitialTheme,
  shouldUpdateExistingTheme,
} from './theme-dashboard.logic';

type Message = { tone: 'error' | 'neutral' | 'success'; text: string };

const locale = 'vi';

export function ThemeDashboard() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [tenantId, setTenantId] = useState('');
  const [themes, setThemes] = useState<Theme[]>([]);
  const [draft, setDraft] = useState<WeddingTheme>(() => createThemeFromPreset());
  const [selectedThemeId, setSelectedThemeId] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [message, setMessage] = useState<Message | null>(null);

  useEffect(() => {
    void listTenants()
      .then((rows) => {
        setTenants(rows);
        setTenantId(rows[0]?.id ?? '');
      })
      .catch(() => setMessage({ tone: 'error', text: t('themes.error.load', locale) }))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!tenantId) return;
    setLoading(true);
    void listThemes(tenantId)
      .then((rows) => {
        setThemes(rows);
        const active = findInitialTheme(rows);
        if (active) {
          setSelectedThemeId(active.id);
          setDraft(normalizeTheme(active));
        }
        setDirty(false);
      })
      .catch(() => setMessage({ tone: 'error', text: t('themes.error.load', locale) }))
      .finally(() => setLoading(false));
  }, [tenantId]);

  const selectedTheme = useMemo(
    () => themes.find((theme) => theme.id === selectedThemeId),
    [selectedThemeId, themes],
  );

  function patchDraft(input: Partial<WeddingTheme>) {
    setDraft((current) => normalizeTheme({ ...current, ...input }));
    setDirty(true);
  }

  function chooseTheme(theme: Theme) {
    setSelectedThemeId(theme.id);
    setDraft(normalizeTheme(theme));
    setDirty(false);
    setMessage(null);
  }

  function applyPreset(presetId: string) {
    setDraft(draftFromPreset(presetId));
    setDirty(true);
  }

  async function save() {
    if (!tenantId) return;
    setSaving(true);
    setMessage(null);

    try {
      const saved = shouldUpdateExistingTheme(selectedTheme?.id, themes)
        ? await updateTheme(tenantId, selectedTheme!.id, draft)
        : await createTheme(tenantId, draft);
      setThemes((current) =>
        current.some((theme) => theme.id === saved.id)
          ? current.map((theme) => (theme.id === saved.id ? saved : theme))
          : [saved, ...current],
      );
      setSelectedThemeId(saved.id);
      setDraft(normalizeTheme(saved));
      setDirty(false);
      setMessage({ tone: 'success', text: t('themes.status.saved', locale) });
    } catch {
      setMessage({ tone: 'error', text: t('themes.error.save', locale) });
    } finally {
      setSaving(false);
    }
  }

  async function activate() {
    if (!tenantId || !selectedThemeId) return;
    setSaving(true);
    try {
      const saved = dirty ? await updateTheme(tenantId, selectedThemeId, draft) : selectedTheme;
      if (!saved) return;
      const activated = await activateTheme(tenantId, saved.id);
      setThemes((current) =>
        current.map((theme) => ({
          ...theme,
          isActive: theme.id === activated.id,
          ...(theme.id === activated.id ? activated : {}),
        })),
      );
      setDraft(normalizeTheme(activated));
      setSelectedThemeId(activated.id);
      setDirty(false);
      setMessage({ tone: 'success', text: t('themes.status.activated', locale) });
    } catch {
      setMessage({ tone: 'error', text: t('themes.error.save', locale) });
    } finally {
      setSaving(false);
    }
  }

  async function clone() {
    if (!tenantId || !selectedThemeId) return;
    setSaving(true);
    try {
      const cloned = await cloneTheme(tenantId, selectedThemeId);
      setThemes((current) => [cloned, ...current]);
      chooseTheme(cloned);
      setMessage({ tone: 'success', text: t('themes.status.cloned', locale) });
    } catch {
      setMessage({ tone: 'error', text: t('themes.error.save', locale) });
    } finally {
      setSaving(false);
    }
  }

  async function reset() {
    if (!tenantId) return;
    setSaving(true);
    try {
      const reset = await resetTheme(tenantId, draft.presetId);
      setThemes([reset]);
      chooseTheme(reset);
      setMessage({ tone: 'success', text: t('themes.status.reset', locale) });
    } catch {
      setMessage({ tone: 'error', text: t('themes.error.save', locale) });
    } finally {
      setSaving(false);
    }
  }

  if (loading && !tenants.length) {
    return <Status tone="neutral" text={t('themes.loading', locale)} />;
  }

  if (!tenants.length) {
    return <Status tone="neutral" text={t('themes.empty', locale)} />;
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[1fr_380px]">
      <div className="grid gap-5">
        <section className="rounded-md border border-neutral-200 bg-white p-4 shadow-sm">
          <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
            <label className="grid gap-2 text-sm font-medium text-neutral-700">
              {t('themes.site.label', locale)}
              <select
                className="h-11 rounded-md border-neutral-300"
                value={tenantId}
                onChange={(event) => setTenantId(event.target.value)}
              >
                {tenants.map((tenant) => (
                  <option key={tenant.id} value={tenant.id}>
                    {tenant.siteName}
                  </option>
                ))}
              </select>
            </label>
            <div className="flex flex-wrap gap-2">
              <ActionButton disabled={saving || !dirty} onClick={() => void save()}>
                {saving ? t('themes.loading', locale) : t('themes.actions.save', locale)}
              </ActionButton>
              <ActionButton disabled={saving || !selectedThemeId} onClick={() => void activate()}>
                {t('themes.actions.activate', locale)}
              </ActionButton>
              <GhostButton disabled={saving || !selectedThemeId} onClick={() => void clone()}>
                {t('themes.actions.clone', locale)}
              </GhostButton>
              <GhostButton disabled={saving} onClick={() => void reset()}>
                {t('themes.actions.reset', locale)}
              </GhostButton>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {themes.map((theme) => (
              <button
                key={theme.id}
                className={`rounded-md border px-3 py-2 text-sm font-medium ${
                  theme.id === selectedThemeId
                    ? 'border-ink bg-ink text-white'
                    : 'border-neutral-200 bg-white text-neutral-700'
                }`}
                onClick={() => chooseTheme(theme)}
                type="button"
              >
                {theme.name}
                {theme.isActive ? ` · ${t('themes.state.active', locale)}` : ''}
              </button>
            ))}
            {dirty ? (
              <span className="rounded-md bg-amber-50 px-3 py-2 text-sm font-medium text-amber-800">
                {t('themes.state.dirty', locale)}
              </span>
            ) : null}
          </div>
          {message ? <Status tone={message.tone} text={message.text} /> : null}
        </section>

        <section className="rounded-md border border-neutral-200 bg-white p-4 shadow-sm">
          <h2 className="text-lg font-semibold text-ink">{t('themes.sections.presets', locale)}</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {THEME_PRESETS.map((preset) => (
              <button
                key={preset.presetId}
                className="grid gap-3 rounded-md border border-neutral-200 bg-white p-3 text-left transition hover:border-ink"
                onClick={() => applyPreset(preset.presetId)}
                type="button"
              >
                <ThemeStrip theme={preset} />
                <span>
                  <span className="block font-semibold text-ink">{t(preset.labelKey, locale)}</span>
                  <span className="mt-1 block text-sm leading-5 text-neutral-600">
                    {t(preset.descriptionKey, locale)}
                  </span>
                </span>
                <span className="text-sm font-semibold text-sage">
                  {t('themes.actions.usePreset', locale)}
                </span>
              </button>
            ))}
          </div>
        </section>

        <section className="grid gap-4 rounded-md border border-neutral-200 bg-white p-4 shadow-sm lg:grid-cols-2">
          <div className="grid gap-4">
            <h2 className="text-lg font-semibold text-ink">
              {t('themes.sections.colors', locale)}
            </h2>
            <TextField
              label={t('themes.fields.name', locale)}
              value={draft.name}
              onChange={(value) => patchDraft({ name: value })}
            />
            <div className="grid gap-3 sm:grid-cols-2">
              {colorFields.map((field) => (
                <ColorField
                  key={field.key}
                  label={t(field.labelKey, locale)}
                  value={draft.colors[field.key]}
                  onChange={(value) =>
                    patchDraft({ colors: { ...draft.colors, [field.key]: value } })
                  }
                />
              ))}
            </div>
          </div>

          <div className="grid gap-4">
            <h2 className="text-lg font-semibold text-ink">
              {t('themes.sections.typography', locale)}
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <SelectField
                label={t('themes.fields.headingFont', locale)}
                value={draft.typography.headingFont}
                onChange={(value) =>
                  patchDraft({ typography: { ...draft.typography, headingFont: value } })
                }
                options={fontOptions}
              />
              <SelectField
                label={t('themes.fields.bodyFont', locale)}
                value={draft.typography.bodyFont}
                onChange={(value) =>
                  patchDraft({ typography: { ...draft.typography, bodyFont: value } })
                }
                options={fontOptions}
              />
              <RangeField
                label={t('themes.fields.radius', locale)}
                value={draft.config.borderRadius}
                max={32}
                min={0}
                step={1}
                onChange={(value) =>
                  patchDraft({ config: { ...draft.config, borderRadius: value } })
                }
              />
              <RangeField
                label={t('themes.fields.overlay', locale)}
                value={Math.round(draft.config.overlayOpacity * 100)}
                max={75}
                min={0}
                step={1}
                onChange={(value) =>
                  patchDraft({ config: { ...draft.config, overlayOpacity: value / 100 } })
                }
              />
            </div>
            <h2 className="text-lg font-semibold text-ink">
              {t('themes.sections.layout', locale)}
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <SelectField
                label={t('themes.fields.layout', locale)}
                value={draft.layoutType}
                onChange={(value) =>
                  patchDraft({ layoutType: value as WeddingTheme['layoutType'] })
                }
                options={Object.values(LAYOUT_TYPES).map((value) => ({
                  label: t(`themes.layout.${value}`, locale),
                  value,
                }))}
              />
              <SelectField
                label={t('themes.fields.heroStyle', locale)}
                value={draft.config.heroStyle}
                onChange={(value) =>
                  patchDraft({
                    config: {
                      ...draft.config,
                      heroStyle: value as WeddingTheme['config']['heroStyle'],
                    },
                  })
                }
                options={['split', 'centered', 'magazine'].map((value) => ({
                  label: t(`themes.hero.${value}`, locale),
                  value,
                }))}
              />
              <SelectField
                label={t('themes.fields.mediaDensity', locale)}
                value={draft.config.mediaDensity}
                onChange={(value) =>
                  patchDraft({
                    config: {
                      ...draft.config,
                      mediaDensity: value as WeddingTheme['config']['mediaDensity'],
                    },
                  })
                }
                options={['airy', 'balanced', 'compact'].map((value) => ({
                  label: t(`themes.density.${value}`, locale),
                  value,
                }))}
              />
              <SelectField
                label={t('themes.fields.animation', locale)}
                value={draft.animationType}
                onChange={(value) =>
                  patchDraft({ animationType: value as WeddingTheme['animationType'] })
                }
                options={Object.values(THEME_ANIMATION_TYPES).map((value) => ({
                  label: t(`themes.animation.${value}`, locale),
                  value,
                }))}
              />
            </div>
          </div>
        </section>
      </div>

      <aside className="xl:sticky xl:top-6 xl:self-start">
        <section className="rounded-md border border-neutral-200 bg-white p-4 shadow-sm">
          <h2 className="text-lg font-semibold text-ink">{t('themes.sections.preview', locale)}</h2>
          <div className="mt-4">
            <ThemePreview theme={draft} />
          </div>
        </section>
      </aside>
    </div>
  );
}

const colorFields = [
  { key: 'primary', labelKey: 'themes.fields.primary' },
  { key: 'secondary', labelKey: 'themes.fields.secondary' },
  { key: 'background', labelKey: 'themes.fields.background' },
  { key: 'surface', labelKey: 'themes.fields.surface' },
  { key: 'text', labelKey: 'themes.fields.text' },
  { key: 'muted', labelKey: 'themes.fields.muted' },
] as const;

const fontOptions = ['Inter', 'Arial', 'Georgia', 'Trebuchet MS'].map((font) => ({
  label: font,
  value: font,
}));

function ThemePreview({ theme }: { theme: WeddingTheme }) {
  const radius = `${theme.config.borderRadius}px`;
  return (
    <div
      className="overflow-hidden border shadow-sm"
      style={{
        background: theme.colors.background,
        borderColor: theme.colors.primary,
        borderRadius: radius,
        color: theme.colors.text,
      }}
    >
      <div
        className={`grid min-h-[420px] gap-4 p-4 ${
          theme.config.heroStyle === 'split' ? 'sm:grid-cols-[0.95fr_1.05fr]' : ''
        }`}
      >
        <div className="grid content-center gap-3">
          <p
            className="text-sm font-bold uppercase"
            style={{ color: theme.colors.primary, fontFamily: theme.typography.bodyFont }}
          >
            {t('themes.preview.kicker', locale)}
          </p>
          <h3
            className="text-4xl leading-tight"
            style={{
              fontFamily: theme.typography.headingFont,
              fontWeight: theme.typography.headingWeight,
            }}
          >
            {t('themes.preview.title', locale)}
          </h3>
          <p
            className="text-sm leading-6"
            style={{ color: theme.colors.muted, fontFamily: theme.typography.bodyFont }}
          >
            {t('themes.preview.copy', locale)}
          </p>
          <div className="flex flex-wrap gap-2">
            <span
              className="px-3 py-2 text-sm font-semibold"
              style={{
                background: theme.colors.primary,
                borderRadius: radius,
                color: theme.colors.surface,
              }}
            >
              {t('themes.preview.cta', locale)}
            </span>
            <span
              className="px-3 py-2 text-sm font-semibold"
              style={{
                background: theme.colors.surface,
                borderRadius: radius,
                color: theme.colors.text,
              }}
            >
              {t('themes.preview.date', locale)}
            </span>
          </div>
        </div>
        <div
          className={`grid gap-2 ${
            theme.config.mediaDensity === 'compact' ? 'grid-cols-3' : 'grid-cols-2'
          }`}
        >
          {[0, 1, 2, 3, 4, 5].map((item) => (
            <div
              key={item}
              className="min-h-24"
              style={{
                background:
                  item % 3 === 0
                    ? theme.colors.primary
                    : item % 3 === 1
                      ? theme.colors.secondary
                      : theme.colors.surface,
                borderRadius: radius,
                opacity: item % 3 === 2 ? 1 - theme.config.overlayOpacity : 1,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function ThemeStrip({ theme }: { theme: WeddingTheme }) {
  return (
    <span className="grid h-16 grid-cols-5 overflow-hidden rounded-md border border-neutral-200">
      {[
        theme.colors.primary,
        theme.colors.secondary,
        theme.colors.background,
        theme.colors.surface,
        theme.colors.text,
      ].map((color) => (
        <span key={color} style={{ background: color }} />
      ))}
    </span>
  );
}

function TextField({
  label,
  onChange,
  value,
}: {
  label: string;
  onChange: (value: string) => void;
  value: string;
}) {
  return (
    <label className="grid gap-2 text-sm font-medium text-neutral-700">
      {label}
      <input
        className="h-11 rounded-md border-neutral-300"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

function ColorField({
  label,
  onChange,
  value,
}: {
  label: string;
  onChange: (value: string) => void;
  value: string;
}) {
  return (
    <label className="grid gap-2 text-sm font-medium text-neutral-700">
      {label}
      <span className="grid grid-cols-[44px_1fr] gap-2">
        <input
          className="h-11 w-11 rounded-md border-neutral-300 p-1"
          type="color"
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
        <input
          className="h-11 rounded-md border-neutral-300 font-mono text-sm"
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      </span>
    </label>
  );
}

function SelectField({
  label,
  onChange,
  options,
  value,
}: {
  label: string;
  onChange: (value: string) => void;
  options: { label: string; value: string }[];
  value: string;
}) {
  return (
    <label className="grid gap-2 text-sm font-medium text-neutral-700">
      {label}
      <select
        className="h-11 rounded-md border-neutral-300"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function RangeField({
  label,
  max,
  min,
  onChange,
  step,
  value,
}: {
  label: string;
  max: number;
  min: number;
  onChange: (value: number) => void;
  step: number;
  value: number;
}) {
  return (
    <label className="grid gap-2 text-sm font-medium text-neutral-700">
      <span className="flex items-center justify-between gap-2">
        {label}
        <span className="font-mono text-xs text-neutral-500">{value}</span>
      </span>
      <input
        className="h-11"
        max={max}
        min={min}
        step={step}
        type="range"
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </label>
  );
}

function Status({ text, tone }: { text: string; tone: Message['tone'] }) {
  const className =
    tone === 'error'
      ? 'bg-red-50 text-red-700'
      : tone === 'success'
        ? 'bg-emerald-50 text-emerald-700'
        : 'bg-neutral-100 text-neutral-700';

  return <p className={`mt-3 rounded-md px-3 py-2 text-sm ${className}`}>{text}</p>;
}

function ActionButton({
  children,
  disabled,
  onClick,
}: {
  children: React.ReactNode;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      className="h-11 rounded-md bg-ink px-4 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-neutral-400"
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}

function GhostButton({
  children,
  disabled,
  onClick,
}: {
  children: React.ReactNode;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      className="h-11 rounded-md border border-neutral-300 px-4 text-sm font-semibold text-neutral-700 disabled:cursor-not-allowed disabled:text-neutral-400"
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}
