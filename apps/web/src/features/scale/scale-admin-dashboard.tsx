'use client';

import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import {
  SCALE_FEATURES,
  SCALE_FEATURE_FLAGS,
  classifyScaleFeature,
  type ScaleAddOn,
  type ScaleFeatureKey,
  type ScalePlan,
} from '@the-wedding/shared';
import { t } from '@/lib/i18n/locales';
import { getScaleAdminOverview, grantScaleEntitlement, type ScaleAdminOverview } from './scale-api';

const accentBySegment = {
  b2b_studio: 'border-teal-200 bg-teal-50 text-teal-800',
  b2c_couple: 'border-rose-200 bg-rose-50 text-rose-800',
};

export function ScaleAdminDashboard() {
  const [overview, setOverview] = useState<ScaleAdminOverview | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    void getScaleAdminOverview()
      .then(setOverview)
      .catch((caught) =>
        setError(caught instanceof Error ? caught.message : t('scale.error.load')),
      );
  }, []);

  async function onGrant(input: EntitlementFormState) {
    await grantScaleEntitlement(input);
    setMessage(t('scale.entitlements.saved'));
    setOverview(await getScaleAdminOverview());
  }

  if (error) return <Notice tone="error" text={error} />;
  if (!overview) return <Notice text={t('scale.loading')} />;

  return (
    <div className="grid gap-6">
      {message ? <Notice text={message} /> : null}
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          ['scale.metrics.subscriptions', overview.subscriptions],
          ['scale.metrics.entitlements', overview.entitlements],
          ['scale.metrics.paymentEvents', overview.paymentEvents],
          ['scale.metrics.analyticsEvents', overview.analyticsEvents],
          ['scale.metrics.studios', overview.studioProfiles],
          ['scale.metrics.clients', overview.studioClients],
          ['scale.metrics.domains', overview.customDomains],
          ['scale.metrics.greetings', overview.greetingRules],
        ].map(([label, value]) => (
          <article
            key={label}
            className="rounded-md border border-neutral-200 bg-white p-4 shadow-sm"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-rose-600">
              {t(String(label))}
            </p>
            <p className="mt-2 text-3xl font-bold text-ink">{value}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.4fr_0.8fr]">
        <PlanCatalog plans={overview.catalog.plans} />
        <EntitlementForm onGrant={onGrant} />
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <AddOnCatalog addOns={overview.catalog.addOns} />
        <FeatureGatePanel />
      </section>
    </div>
  );
}

function PlanCatalog({ plans }: { plans: ScalePlan[] }) {
  return (
    <section className="rounded-md border border-neutral-200 bg-white p-4 shadow-sm">
      <SectionTitle eyebrow={t('scale.sections.catalog')} title={t('scale.sections.plans')} />
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {plans.map((plan) => (
          <article key={plan.id} className="rounded-md border border-neutral-200 p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <span
                  className={`inline-flex rounded-full border px-2 py-1 text-xs font-semibold ${accentBySegment[plan.segment]}`}
                >
                  {t(`scale.segment.${plan.segment}`)}
                </span>
                <h3 className="mt-3 text-base font-semibold text-ink">{t(plan.labelKey)}</h3>
                <p className="mt-1 text-sm text-neutral-600">{t(plan.descriptionKey)}</p>
              </div>
            </div>
            <dl className="mt-4 grid grid-cols-2 gap-2 text-sm">
              <Metric
                label={t('scale.fields.storage')}
                value={formatBytes(plan.limits.storageBytes)}
              />
              <Metric label={t('scale.fields.photos')} value={String(plan.limits.maxPhotoCount)} />
              <Metric label={t('scale.fields.videos')} value={String(plan.limits.maxVideoCount)} />
              <Metric label={t('scale.fields.support')} value={plan.limits.supportLevel} />
            </dl>
          </article>
        ))}
      </div>
    </section>
  );
}

function AddOnCatalog({ addOns }: { addOns: ScaleAddOn[] }) {
  return (
    <section className="rounded-md border border-neutral-200 bg-white p-4 shadow-sm">
      <SectionTitle eyebrow={t('scale.sections.valueAdds')} title={t('scale.sections.addOns')} />
      <div className="mt-4 grid gap-3">
        {addOns.map((addOn) => (
          <article key={addOn.id} className="rounded-md border border-amber-200 bg-amber-50 p-3">
            <h3 className="text-sm font-semibold text-amber-950">{t(addOn.labelKey)}</h3>
            <p className="mt-1 text-sm text-amber-800">{t(addOn.descriptionKey)}</p>
            <p className="mt-2 text-xs font-medium text-amber-700">
              {addOn.storageBoostBytes
                ? `${t('scale.fields.storageBoost')}: ${formatBytes(addOn.storageBoostBytes)}`
                : `${t('scale.fields.features')}: ${addOn.featureKeys.join(', ') || '-'}`}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

type EntitlementFormState = {
  featureKey?: string;
  granted: boolean;
  reason?: string;
  storageBoostBytes?: string;
  subjectId: string;
  subjectType: 'tenant' | 'user';
};

function EntitlementForm({ onGrant }: { onGrant: (input: EntitlementFormState) => Promise<void> }) {
  const [form, setForm] = useState<EntitlementFormState>({
    featureKey: SCALE_FEATURES.PREMIUM_THEMES,
    granted: true,
    reason: '',
    storageBoostBytes: '',
    subjectId: '',
    subjectType: 'tenant',
  });
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    try {
      await onGrant({
        ...form,
        storageBoostBytes: form.storageBoostBytes || undefined,
      });
    } finally {
      setBusy(false);
    }
  }

  return (
    <form
      onSubmit={(event) => {
        void submit(event);
      }}
      className="rounded-md border border-teal-200 bg-teal-50 p-4 shadow-sm"
    >
      <SectionTitle
        eyebrow={t('scale.sections.adminControls')}
        title={t('scale.entitlements.title')}
      />
      <div className="mt-4 grid gap-3">
        <label className="grid gap-1 text-sm font-medium text-teal-950">
          {t('scale.entitlements.subjectType')}
          <select
            className="h-10 rounded-md border-teal-200 bg-white"
            value={form.subjectType}
            onChange={(event) =>
              setForm({ ...form, subjectType: event.target.value as 'tenant' | 'user' })
            }
          >
            <option value="tenant">{t('scale.entitlements.tenant')}</option>
            <option value="user">{t('scale.entitlements.user')}</option>
          </select>
        </label>
        <label className="grid gap-1 text-sm font-medium text-teal-950">
          {t('scale.entitlements.subjectId')}
          <input
            className="h-10 rounded-md border-teal-200"
            required
            value={form.subjectId}
            onChange={(event) => setForm({ ...form, subjectId: event.target.value })}
          />
        </label>
        <label className="grid gap-1 text-sm font-medium text-teal-950">
          {t('scale.entitlements.feature')}
          <select
            className="h-10 rounded-md border-teal-200 bg-white"
            value={form.featureKey}
            onChange={(event) => setForm({ ...form, featureKey: event.target.value })}
          >
            {Object.values(SCALE_FEATURES).map((feature) => (
              <option key={feature} value={feature}>
                {feature}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-1 text-sm font-medium text-teal-950">
          {t('scale.entitlements.storageBoost')}
          <input
            className="h-10 rounded-md border-teal-200"
            inputMode="numeric"
            placeholder="10737418240"
            value={form.storageBoostBytes}
            onChange={(event) => setForm({ ...form, storageBoostBytes: event.target.value })}
          />
        </label>
        <label className="grid gap-1 text-sm font-medium text-teal-950">
          {t('scale.entitlements.reason')}
          <textarea
            className="min-h-20 rounded-md border-teal-200"
            value={form.reason}
            onChange={(event) => setForm({ ...form, reason: event.target.value })}
          />
        </label>
        <button
          className="h-10 rounded-md bg-teal-700 px-4 text-sm font-semibold text-white transition hover:bg-teal-800 disabled:opacity-60"
          disabled={busy}
          type="submit"
        >
          {busy ? t('scale.entitlements.saving') : t('scale.entitlements.save')}
        </button>
      </div>
    </form>
  );
}

function FeatureGatePanel() {
  return (
    <section className="rounded-md border border-neutral-200 bg-white p-4 shadow-sm">
      <SectionTitle eyebrow={t('scale.sections.gates')} title={t('scale.sections.featureFlags')} />
      <div className="mt-4 grid gap-2">
        {Object.entries(SCALE_FEATURE_FLAGS).map(([feature, flag]) => (
          <div key={feature} className="rounded-md border border-neutral-200 px-3 py-2 text-sm">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <span className="font-semibold text-ink">{feature}</span>
              <span className="text-xs font-medium text-rose-600">
                {classifyScaleFeature(feature as ScaleFeatureKey)}
              </span>
            </div>
            <p className="mt-1 break-words text-neutral-600">{flag}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function SectionTitle({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-rose-600">{eyebrow}</p>
      <h2 className="mt-1 text-lg font-semibold text-ink">{title}</h2>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-neutral-50 px-3 py-2">
      <dt className="text-xs text-neutral-500">{label}</dt>
      <dd className="mt-1 break-words font-semibold text-neutral-800">{value}</dd>
    </div>
  );
}

function Notice({ text, tone = 'info' }: { text: string; tone?: 'error' | 'info' }) {
  return (
    <section
      className={`rounded-md border p-4 text-sm ${tone === 'error' ? 'border-red-200 bg-red-50 text-red-700' : 'border-neutral-200 bg-white text-neutral-600'}`}
    >
      {text}
    </section>
  );
}

function formatBytes(value: number) {
  if (value >= 1024 * 1024 * 1024) return `${Math.round(value / 1024 / 1024 / 1024)} GB`;
  return `${Math.round(value / 1024 / 1024)} MB`;
}
