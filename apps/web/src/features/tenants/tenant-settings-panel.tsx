'use client';

import { useEffect, useMemo, useState } from 'react';
import { TENANT_VISIBILITY, type TenantVisibility } from '@the-wedding/shared';
import {
  listTenants,
  updateTenant,
  updateTenantSettings,
  updateTenantVisibility,
  type Tenant,
} from './tenant-api';

type SettingsForm = {
  siteName: string;
  slug: string;
  brideName: string;
  groomName: string;
  weddingDate: string;
  description: string;
  seoTitle: string;
  seoDescription: string;
  seoImageUrl: string;
  shareHeadline: string;
  shareSummary: string;
  shareImageUrl: string;
  accentColor: string;
  coverImageUrl: string;
  welcomeMessage: string;
  visibility: TenantVisibility;
  password: string;
};

export function TenantSettingsPanel({ tenantId }: { tenantId?: string }) {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [selectedId, setSelectedId] = useState<string | undefined>(tenantId);
  const [form, setForm] = useState<SettingsForm | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    void listTenants()
      .then((loadedTenants) => {
        setTenants(loadedTenants);
        const activeTenant =
          loadedTenants.find((tenant) => tenant.id === tenantId) ?? loadedTenants[0];
        setSelectedId(activeTenant?.id);
        setForm(activeTenant ? toForm(activeTenant) : null);
      })
      .catch((caughtError: unknown) =>
        setError(caughtError instanceof Error ? caughtError.message : 'Unable to load settings'),
      )
      .finally(() => setLoading(false));
  }, [tenantId]);

  const selectedTenant = useMemo(
    () => tenants.find((tenant) => tenant.id === selectedId),
    [selectedId, tenants],
  );

  function chooseTenant(nextTenantId: string) {
    const nextTenant = tenants.find((tenant) => tenant.id === nextTenantId);
    setSelectedId(nextTenantId);
    setForm(nextTenant ? toForm(nextTenant) : null);
    setError(null);
    setSuccess(null);
  }

  async function handleSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedTenant || !form) {
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const updatedTenant = await updateTenant(selectedTenant.id, {
        brideName: form.brideName,
        description: form.description,
        groomName: form.groomName,
        seo: {
          description: form.seoDescription,
          imageUrl: form.seoImageUrl,
          title: form.seoTitle,
        },
        sharing: {
          headline: form.shareHeadline,
          imageUrl: form.shareImageUrl,
          summary: form.shareSummary,
        },
        siteName: form.siteName,
        slug: form.slug,
        weddingDate: form.weddingDate,
      });
      const settingsTenant = await updateTenantSettings(selectedTenant.id, {
        accentColor: form.accentColor,
        coverImageUrl: form.coverImageUrl,
        welcomeMessage: form.welcomeMessage,
      });
      const visibilityTenant = await updateTenantVisibility(
        selectedTenant.id,
        form.visibility,
        form.password || undefined,
      );
      const mergedTenant = {
        ...updatedTenant,
        settings: settingsTenant.settings,
        visibility: visibilityTenant.visibility,
      };

      setTenants((current) =>
        current.map((tenant) => (tenant.id === selectedTenant.id ? mergedTenant : tenant)),
      );
      setForm(toForm(mergedTenant));
      setSuccess('Settings saved.');
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Unable to save settings');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <PanelMessage message="Loading tenant settings..." />;
  }

  if (!form || !selectedTenant) {
    return <PanelMessage message="Create a wedding site from the dashboard to unlock settings." />;
  }

  return (
    <div className="grid gap-5">
      {tenants.length > 1 ? (
        <label className="grid gap-2 text-sm font-medium text-neutral-700 md:max-w-sm">
          Site
          <select
            className="h-11 rounded-md border-neutral-300"
            onChange={(event) => chooseTenant(event.target.value)}
            value={selectedId}
          >
            {tenants.map((tenant) => (
              <option key={tenant.id} value={tenant.id}>
                {tenant.siteName}
              </option>
            ))}
          </select>
        </label>
      ) : null}

      <form
        className="grid gap-5"
        onSubmit={(event) => {
          void handleSave(event);
        }}
      >
        <section className="grid gap-4 rounded-md border border-neutral-200 bg-white p-4 md:grid-cols-2">
          <Field
            label="Site name"
            value={form.siteName}
            onChange={(siteName) => patch({ siteName })}
          />
          <Field label="Slug" value={form.slug} onChange={(slug) => patch({ slug })} />
          <Field
            label="Bride name"
            value={form.brideName}
            onChange={(brideName) => patch({ brideName })}
          />
          <Field
            label="Groom name"
            value={form.groomName}
            onChange={(groomName) => patch({ groomName })}
          />
          <Field
            label="Event date"
            type="date"
            value={form.weddingDate}
            onChange={(weddingDate) => patch({ weddingDate })}
          />
          <label className="grid gap-2 text-sm font-medium text-neutral-700">
            Visibility
            <select
              className="h-11 rounded-md border-neutral-300"
              onChange={(event) => patch({ visibility: event.target.value as TenantVisibility })}
              value={form.visibility}
            >
              <option value={TENANT_VISIBILITY.PRIVATE}>Private</option>
              <option value={TENANT_VISIBILITY.PUBLIC}>Public</option>
              <option value={TENANT_VISIBILITY.PASSWORD_PROTECTED}>Password protected</option>
            </select>
          </label>
          {form.visibility === TENANT_VISIBILITY.PASSWORD_PROTECTED ? (
            <Field
              label="Access password"
              type="password"
              value={form.password}
              onChange={(password) => patch({ password })}
            />
          ) : null}
          <label className="grid gap-2 text-sm font-medium text-neutral-700 md:col-span-2">
            Description
            <textarea
              className="min-h-28 rounded-md border-neutral-300"
              onChange={(event) => patch({ description: event.target.value })}
              value={form.description}
            />
          </label>
        </section>

        <section className="grid gap-4 rounded-md border border-neutral-200 bg-white p-4 md:grid-cols-3">
          <Field
            label="SEO title"
            value={form.seoTitle}
            onChange={(seoTitle) => patch({ seoTitle })}
          />
          <Field
            label="SEO description"
            value={form.seoDescription}
            onChange={(seoDescription) => patch({ seoDescription })}
          />
          <Field
            label="SEO image URL"
            value={form.seoImageUrl}
            onChange={(seoImageUrl) => patch({ seoImageUrl })}
          />
          <Field
            label="Share headline"
            value={form.shareHeadline}
            onChange={(shareHeadline) => patch({ shareHeadline })}
          />
          <Field
            label="Share summary"
            value={form.shareSummary}
            onChange={(shareSummary) => patch({ shareSummary })}
          />
          <Field
            label="Share image URL"
            value={form.shareImageUrl}
            onChange={(shareImageUrl) => patch({ shareImageUrl })}
          />
        </section>

        <section className="grid gap-4 rounded-md border border-neutral-200 bg-white p-4 md:grid-cols-3">
          <Field
            label="Accent color"
            value={form.accentColor}
            onChange={(accentColor) => patch({ accentColor })}
            placeholder="#7f9b83"
          />
          <Field
            label="Cover image URL"
            value={form.coverImageUrl}
            onChange={(coverImageUrl) => patch({ coverImageUrl })}
          />
          <Field
            label="Welcome message"
            value={form.welcomeMessage}
            onChange={(welcomeMessage) => patch({ welcomeMessage })}
          />
        </section>

        {error ? <StatusTone tone="error" message={error} /> : null}
        {success ? <StatusTone tone="success" message={success} /> : null}

        <button
          className="h-11 w-fit rounded-md bg-ink px-5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-neutral-400"
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Save settings'}
        </button>
      </form>
    </div>
  );

  function patch(value: Partial<SettingsForm>) {
    setForm((current) => (current ? { ...current, ...value } : current));
  }
}

function Field({
  label,
  onChange,
  placeholder,
  type = 'text',
  value,
}: {
  label: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  value: string;
}) {
  return (
    <label className="grid gap-2 text-sm font-medium text-neutral-700">
      {label}
      <input
        className="h-11 rounded-md border-neutral-300"
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        type={type}
        value={value}
      />
    </label>
  );
}

function StatusTone({ message, tone }: { message: string; tone: 'error' | 'success' }) {
  const className = tone === 'error' ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700';
  return <p className={`rounded-md px-3 py-2 text-sm ${className}`}>{message}</p>;
}

function PanelMessage({ message }: { message: string }) {
  return (
    <div className="rounded-md border border-neutral-200 bg-white p-5 text-sm text-neutral-600">
      {message}
    </div>
  );
}

function toForm(tenant: Tenant): SettingsForm {
  return {
    siteName: tenant.siteName,
    slug: tenant.slug,
    brideName: tenant.brideName ?? '',
    groomName: tenant.groomName ?? '',
    weddingDate: tenant.weddingDate ?? '',
    description: tenant.description ?? '',
    seoTitle: tenant.seo.title ?? '',
    seoDescription: tenant.seo.description ?? '',
    seoImageUrl: tenant.seo.imageUrl ?? '',
    shareHeadline: tenant.sharing.headline ?? '',
    shareSummary: tenant.sharing.summary ?? '',
    shareImageUrl: tenant.sharing.imageUrl ?? '',
    accentColor: tenant.settings.accentColor ?? '#7f9b83',
    coverImageUrl: tenant.settings.coverImageUrl ?? '',
    welcomeMessage: tenant.settings.welcomeMessage ?? '',
    visibility: tenant.visibility,
    password: '',
  };
}
