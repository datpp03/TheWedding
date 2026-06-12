'use client';

import { useEffect, useMemo, useState } from 'react';
import { TENANT_VISIBILITY } from '@the-wedding/shared';
import { MetricCard } from '@/components/metric-card';
import { checkTenantSlug, createTenant, listTenants, type Tenant } from './tenant-api';

type CreateState = {
  siteName: string;
  slug: string;
  brideName: string;
  groomName: string;
  weddingDate: string;
  description: string;
};

const initialCreateState: CreateState = {
  siteName: '',
  slug: '',
  brideName: '',
  groomName: '',
  weddingDate: '',
  description: '',
};

export function TenantDashboard() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [form, setForm] = useState<CreateState>(initialCreateState);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [slugStatus, setSlugStatus] = useState<'available' | 'checking' | 'taken' | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    void listTenants()
      .then(setTenants)
      .catch((caughtError: unknown) =>
        setError(caughtError instanceof Error ? caughtError.message : 'Unable to load sites'),
      )
      .finally(() => setLoading(false));
  }, []);

  const slugPreview = useMemo(() => normalizeSlug(form.slug || form.siteName), [form]);
  const primaryTenant = tenants[0];

  useEffect(() => {
    if (slugPreview.length < 3) {
      setSlugStatus(null);
      return;
    }

    let cancelled = false;
    setSlugStatus('checking');
    const timeout = window.setTimeout(() => {
      void checkTenantSlug(slugPreview)
        .then((result) => {
          if (!cancelled) {
            setSlugStatus(result.available ? 'available' : 'taken');
          }
        })
        .catch(() => {
          if (!cancelled) {
            setSlugStatus(null);
          }
        });
    }, 350);

    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
    };
  }, [slugPreview]);

  async function handleCreate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const tenant = await createTenant({
        ...form,
        slug: slugPreview,
      });
      setTenants((current) => [tenant, ...current]);
      setForm(initialCreateState);
      setSuccess('Wedding site created. Your public slug is ready.');
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Unable to create site');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="grid gap-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Active sites" value={String(tenants.length)} detail="Owned or shared" />
        <MetricCard label="Albums" value="0" detail="Ready for Phase 4" />
        <MetricCard label="Media storage" value="0 GB" detail="Tracked after uploads" />
        <MetricCard
          label="Public visibility"
          value={formatVisibility(primaryTenant?.visibility)}
          detail={primaryTenant ? primaryTenant.slug : 'Create your first site'}
        />
      </div>

      <section className="grid gap-5 rounded-md border border-neutral-200 bg-white p-4 shadow-sm md:grid-cols-[1.1fr_0.9fr] md:p-5">
        <div>
          <p className="text-sm font-semibold uppercase text-sage">Tenant onboarding</p>
          <h2 className="mt-2 text-2xl font-semibold text-ink">
            {tenants.length ? 'Launch another wedding site' : 'Create your wedding site'}
          </h2>
          <p className="mt-2 text-sm leading-6 text-neutral-600">
            Set the names, date, and a shareable slug. You can tune SEO, cover copy, and visibility
            from Settings right after this.
          </p>

          {loading ? <StatusTone tone="neutral" message="Loading your sites..." /> : null}
          {error ? <StatusTone tone="error" message={error} /> : null}
          {success ? <StatusTone tone="success" message={success} /> : null}
        </div>

        <form
          className="grid gap-3"
          onSubmit={(event) => {
            void handleCreate(event);
          }}
        >
          <Field
            label="Site name"
            value={form.siteName}
            onChange={(value) => setForm((current) => ({ ...current, siteName: value }))}
            placeholder="Linh & An Wedding"
            required
          />
          <div className="grid gap-2 sm:grid-cols-2">
            <Field
              label="Bride name"
              value={form.brideName}
              onChange={(value) => setForm((current) => ({ ...current, brideName: value }))}
              placeholder="Linh"
            />
            <Field
              label="Groom name"
              value={form.groomName}
              onChange={(value) => setForm((current) => ({ ...current, groomName: value }))}
              placeholder="An"
            />
          </div>
          <Field
            label="Event date"
            type="date"
            value={form.weddingDate}
            onChange={(value) => setForm((current) => ({ ...current, weddingDate: value }))}
          />
          <Field
            label="Slug"
            value={form.slug}
            onChange={(value) => setForm((current) => ({ ...current, slug: value }))}
            placeholder="linh-an"
            required
          />
          <p className="rounded-md bg-champagne px-3 py-2 text-sm text-ink">
            Preview: <span className="font-semibold">/{slugPreview || 'your-slug'}</span>
          </p>
          {slugStatus ? (
            <p
              className={`rounded-md px-3 py-2 text-sm ${
                slugStatus === 'taken'
                  ? 'bg-red-50 text-red-700'
                  : slugStatus === 'available'
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'bg-neutral-100 text-neutral-700'
              }`}
            >
              {slugStatus === 'checking'
                ? 'Checking slug...'
                : slugStatus === 'available'
                  ? 'Slug is available.'
                  : 'Slug is already taken.'}
            </p>
          ) : null}
          <label className="grid gap-2 text-sm font-medium text-neutral-700">
            Description
            <textarea
              className="min-h-24 rounded-md border-neutral-300"
              value={form.description}
              onChange={(event) =>
                setForm((current) => ({ ...current, description: event.target.value }))
              }
              placeholder="A tiny note for guests"
            />
          </label>
          <button
            className="h-11 rounded-md bg-ink px-4 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-neutral-400"
            disabled={saving || slugStatus === 'taken' || !slugPreview || !form.siteName}
          >
            {saving ? 'Creating...' : 'Create site'}
          </button>
        </form>
      </section>

      {tenants.length ? (
        <section className="grid gap-3">
          {tenants.map((tenant) => (
            <a
              key={tenant.id}
              className="rounded-md border border-neutral-200 bg-white p-4 shadow-sm transition hover:border-sage"
              href={`/dashboard/settings?tenantId=${tenant.id}`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="font-semibold text-ink">{tenant.siteName}</h3>
                  <p className="text-sm text-neutral-600">/{tenant.slug}</p>
                </div>
                <span className="rounded-md bg-neutral-100 px-2 py-1 text-xs font-medium text-neutral-700">
                  {formatVisibility(tenant.visibility)}
                </span>
              </div>
            </a>
          ))}
        </section>
      ) : null}
    </div>
  );
}

function Field({
  label,
  onChange,
  value,
  placeholder,
  required,
  type = 'text',
}: {
  label: string;
  onChange: (value: string) => void;
  value: string;
  placeholder?: string;
  required?: boolean;
  type?: string;
}) {
  return (
    <label className="grid gap-2 text-sm font-medium text-neutral-700">
      {label}
      <input
        className="h-11 rounded-md border-neutral-300"
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        required={required}
        type={type}
        value={value}
      />
    </label>
  );
}

function StatusTone({ message, tone }: { message: string; tone: 'error' | 'neutral' | 'success' }) {
  const className =
    tone === 'error'
      ? 'bg-red-50 text-red-700'
      : tone === 'success'
        ? 'bg-emerald-50 text-emerald-700'
        : 'bg-neutral-100 text-neutral-700';

  return <p className={`mt-4 rounded-md px-3 py-2 text-sm ${className}`}>{message}</p>;
}

function normalizeSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
}

function formatVisibility(visibility?: Tenant['visibility']) {
  if (!visibility) {
    return 'Private';
  }

  if (visibility === TENANT_VISIBILITY.PASSWORD_PROTECTED) {
    return 'Password';
  }

  return visibility === TENANT_VISIBILITY.PUBLIC ? 'Public' : 'Private';
}
