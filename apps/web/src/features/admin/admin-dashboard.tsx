'use client';

import { useEffect, useState } from 'react';
import { MetricCard } from '@/components/metric-card';
import { t } from '@/lib/i18n/locales';
import {
  getAdminStats,
  getSystemParameters,
  listAdminMedia,
  listAdminTenants,
  listAdminUsers,
  listAuditLogs,
  listFeatureFlags,
  listSystemSettings,
  updateAdminMediaStatus,
  updateAdminTenantStatus,
  updateAdminUserStatus,
  updateSystemParameters,
  type AdminMedia,
  type AdminStats,
  type AdminTenant,
  type AdminUser,
  type AuditLog,
  type FeatureFlag,
  type PageResult,
  type SystemParameters,
  type SystemSetting,
} from './admin-api';

type View = 'stats' | 'users' | 'tenants' | 'media' | 'audit' | 'settings';

export function AdminDashboard({ view }: { view: View }) {
  if (view === 'stats') return <StatsPanel />;
  if (view === 'users') return <UsersPanel />;
  if (view === 'tenants') return <TenantsPanel />;
  if (view === 'media') return <MediaPanel />;
  if (view === 'audit') return <AuditPanel />;
  return <SettingsPanel />;
}

function StatsPanel() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void getAdminStats()
      .then(setStats)
      .catch((caught) => setError(readError(caught)));
  }, []);

  if (error) return <Notice tone="error" text={error} />;
  if (!stats) return <Notice text={t('admin.loading')} />;

  const metrics = [
    {
      detail: t('admin.stats.activeUsers'),
      label: t('admin.nav.users'),
      value: String(stats.usersTotal),
    },
    {
      detail: t('admin.stats.activeTenants'),
      label: t('admin.nav.tenants'),
      value: String(stats.tenantsTotal),
    },
    {
      detail: t('admin.stats.pendingMedia'),
      label: t('admin.nav.media'),
      value: String(stats.mediaTotal),
    },
    {
      detail: t('admin.stats.auditEvents'),
      label: t('admin.nav.audit'),
      value: String(stats.auditEvents),
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => (
        <MetricCard key={metric.label} {...metric} />
      ))}
    </div>
  );
}

function UsersPanel() {
  const [rows, setRows] = useState<PageResult<AdminUser> | null>(null);
  const [status, setStatus] = useState('');
  useEffect(() => {
    void listAdminUsers(status ? `?status=${status}` : '').then(setRows);
  }, [status]);
  return (
    <DataPanel title={t('admin.nav.users')} status={status} onStatus={setStatus}>
      <ResponsiveTable
        empty={t('admin.empty.users')}
        headers={[
          t('admin.field.name'),
          t('admin.field.email'),
          t('admin.field.status'),
          t('admin.field.created'),
          t('admin.field.actions'),
        ]}
        rows={
          rows?.items.map((user) => ({
            id: user.id,
            cells: [user.displayName, user.email, user.status, formatDate(user.createdAt)],
            action: (
              <select
                className="h-9 rounded-md border-neutral-300 text-sm"
                value={user.status}
                onChange={(event) =>
                  void updateAdminUserStatus(user.id, event.target.value).then(() =>
                    listAdminUsers(status ? `?status=${status}` : '').then(setRows),
                  )
                }
              >
                {['active', 'pending_verification', 'locked', 'disabled'].map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            ),
          })) ?? []
        }
      />
    </DataPanel>
  );
}

function TenantsPanel() {
  const [rows, setRows] = useState<PageResult<AdminTenant> | null>(null);
  const [status, setStatus] = useState('');
  useEffect(() => {
    void listAdminTenants(status ? `?status=${status}` : '').then(setRows);
  }, [status]);
  return (
    <DataPanel title={t('admin.nav.tenants')} status={status} onStatus={setStatus}>
      <ResponsiveTable
        empty={t('admin.empty.tenants')}
        headers={[
          t('admin.field.site'),
          t('admin.field.slug'),
          t('admin.field.visibility'),
          t('admin.field.status'),
          t('admin.field.actions'),
        ]}
        rows={
          rows?.items.map((tenant) => ({
            id: tenant.id,
            cells: [tenant.siteName, tenant.slug, tenant.visibility, tenant.status],
            action: (
              <select
                className="h-9 rounded-md border-neutral-300 text-sm"
                value={tenant.status}
                onChange={(event) =>
                  void updateAdminTenantStatus(tenant.id, event.target.value).then(() =>
                    listAdminTenants(status ? `?status=${status}` : '').then(setRows),
                  )
                }
              >
                {['active', 'suspended', 'archived'].map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            ),
          })) ?? []
        }
      />
    </DataPanel>
  );
}

function MediaPanel() {
  const [rows, setRows] = useState<PageResult<AdminMedia> | null>(null);
  const [status, setStatus] = useState('');
  useEffect(() => {
    void listAdminMedia(status ? `?status=${status}` : '').then(setRows);
  }, [status]);
  return (
    <DataPanel title={t('admin.nav.media')} status={status} onStatus={setStatus}>
      <ResponsiveTable
        empty={t('admin.empty.media')}
        headers={[
          t('admin.field.file'),
          t('admin.field.type'),
          t('admin.field.status'),
          t('admin.field.created'),
          t('admin.field.actions'),
        ]}
        rows={
          rows?.items.map((media) => ({
            id: media.id,
            cells: [
              media.originalFileName,
              media.mimeType,
              t(`media.processing.${media.processingStatus}`),
              formatDate(media.createdAt),
            ],
            action: (
              <select
                className="h-9 rounded-md border-neutral-300 text-sm"
                value={media.processingStatus}
                onChange={(event) =>
                  void updateAdminMediaStatus(media.id, event.target.value).then(() =>
                    listAdminMedia(status ? `?status=${status}` : '').then(setRows),
                  )
                }
              >
                {['pending', 'ready', 'processing', 'failed', 'rejected'].map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            ),
          })) ?? []
        }
      />
    </DataPanel>
  );
}

function AuditPanel() {
  const [rows, setRows] = useState<PageResult<AuditLog> | null>(null);
  useEffect(() => {
    void listAuditLogs().then(setRows);
  }, []);
  return (
    <DataPanel title={t('admin.nav.audit')}>
      <ResponsiveTable
        empty={t('admin.empty.audit')}
        headers={[
          t('admin.field.action'),
          t('admin.field.entity'),
          t('admin.field.actor'),
          t('admin.field.created'),
        ]}
        rows={
          rows?.items.map((log) => ({
            id: log.id,
            cells: [log.action, log.entityType, log.actorUserId ?? '-', formatDate(log.createdAt)],
          })) ?? []
        }
      />
    </DataPanel>
  );
}

function SettingsPanel() {
  const [settings, setSettings] = useState<SystemSetting[]>([]);
  const [flags, setFlags] = useState<FeatureFlag[]>([]);
  const [parameters, setParameters] = useState<SystemParameters | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    void Promise.all([listSystemSettings(), listFeatureFlags(), getSystemParameters()]).then(
      ([nextSettings, nextFlags, nextParameters]) => {
        setSettings(nextSettings);
        setFlags(nextFlags);
        setParameters(nextParameters);
      },
    );
  }, []);

  async function saveParameters(next: SystemParameters) {
    setParameters(next);
    setParameters(await updateSystemParameters(next));
    setMessage(t('admin.status.saved'));
  }

  return (
    <div className="grid gap-5">
      {message ? <Notice text={message} /> : null}
      {parameters ? (
        <section className="rounded-md border border-neutral-200 bg-white p-4 shadow-sm">
          <h2 className="text-base font-semibold text-ink">{t('admin.systemParameters.title')}</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {parameterToggles.map((item) => (
              <label
                key={item.key}
                className="flex items-center justify-between gap-3 rounded-md border border-neutral-200 px-3 py-3 text-sm"
              >
                <span>{t(item.label)}</span>
                <input
                  type="checkbox"
                  checked={Boolean(parameters[item.key])}
                  onChange={(event) =>
                    void saveParameters({ ...parameters, [item.key]: event.target.checked })
                  }
                />
              </label>
            ))}
          </div>
          <label className="mt-4 grid gap-2 text-sm font-medium text-neutral-700">
            {t('admin.systemParameters.maintenanceMessage')}
            <textarea
              className="min-h-24 rounded-md border-neutral-300"
              value={parameters.maintenanceMessage}
              onChange={(event) =>
                setParameters({ ...parameters, maintenanceMessage: event.target.value })
              }
              onBlur={() => void saveParameters(parameters)}
            />
          </label>
        </section>
      ) : (
        <Notice text={t('admin.loading')} />
      )}

      <section className="grid gap-4 lg:grid-cols-2">
        <ListBox
          title={t('admin.nav.settings')}
          rows={settings.map((setting) => `${setting.key}: ${setting.valueJson}`)}
          empty={t('admin.empty.settings')}
        />
        <ListBox
          title={t('admin.nav.featureFlags')}
          rows={flags.map(
            (flag) =>
              `${flag.key}: ${flag.enabled ? t('admin.status.enabled') : t('admin.status.disabled')}`,
          )}
          empty={t('admin.empty.flags')}
        />
      </section>
    </div>
  );
}

const parameterToggles: Array<{ key: keyof SystemParameters; label: string }> = [
  { key: 'disableNewUserRegistration', label: 'admin.systemParameters.disableRegistration' },
  { key: 'disableLogin', label: 'admin.systemParameters.disableLogin' },
  { key: 'disableUploads', label: 'admin.systemParameters.disableUploads' },
  { key: 'disableDownloads', label: 'admin.systemParameters.disableDownloads' },
  { key: 'disablePublicGallery', label: 'admin.systemParameters.disablePublicGallery' },
  { key: 'disablePaymentCheckout', label: 'admin.systemParameters.disablePayment' },
];

function DataPanel({
  children,
  onStatus,
  status,
  title,
}: {
  children: React.ReactNode;
  onStatus?: (value: string) => void;
  status?: string;
  title: string;
}) {
  return (
    <section className="grid gap-4">
      <div className="flex flex-col gap-3 rounded-md border border-neutral-200 bg-white p-4 shadow-sm sm:flex-row sm:items-end sm:justify-between">
        <h2 className="text-base font-semibold text-ink">{title}</h2>
        {onStatus ? (
          <label className="grid gap-1 text-sm font-medium text-neutral-700">
            {t('admin.filter.status')}
            <input
              className="h-10 rounded-md border-neutral-300"
              value={status}
              onChange={(event) => onStatus(event.target.value)}
              placeholder={t('admin.filter.any')}
            />
          </label>
        ) : null}
      </div>
      {children}
    </section>
  );
}

function ResponsiveTable({
  empty,
  headers,
  rows,
}: {
  empty: string;
  headers: string[];
  rows: Array<{ action?: React.ReactNode; cells: string[]; id: string }>;
}) {
  if (!rows.length) return <Notice text={empty} />;
  return (
    <div className="overflow-hidden rounded-md border border-neutral-200 bg-white shadow-sm">
      <table className="hidden w-full table-fixed text-left text-sm lg:table">
        <thead className="bg-neutral-50 text-neutral-600">
          <tr>
            {headers.map((header) => (
              <th key={header} className="px-3 py-3 font-medium">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-100">
          {rows.map((row) => (
            <tr key={row.id}>
              {row.cells.map((cell, index) => (
                <td key={`${row.id}-${index}`} className="truncate px-3 py-3 text-neutral-700">
                  {cell}
                </td>
              ))}
              {row.action ? <td className="px-3 py-3">{row.action}</td> : null}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="grid gap-3 p-3 lg:hidden">
        {rows.map((row) => (
          <article
            key={row.id}
            className="grid gap-2 rounded-md border border-neutral-200 p-3 text-sm"
          >
            {row.cells.map((cell, index) => (
              <div key={`${row.id}-${index}`} className="flex justify-between gap-3">
                <span className="text-neutral-500">{headers[index]}</span>
                <span className="min-w-0 break-words text-right text-neutral-800">{cell}</span>
              </div>
            ))}
            {row.action ? <div className="pt-2">{row.action}</div> : null}
          </article>
        ))}
      </div>
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

function ListBox({ empty, rows, title }: { empty: string; rows: string[]; title: string }) {
  return (
    <section className="rounded-md border border-neutral-200 bg-white p-4 shadow-sm">
      <h2 className="text-base font-semibold text-ink">{title}</h2>
      <div className="mt-3 grid gap-2 text-sm text-neutral-700">
        {rows.length ? (
          rows.map((row) => (
            <p key={row} className="break-words rounded-md bg-neutral-50 px-3 py-2">
              {row}
            </p>
          ))
        ) : (
          <p>{empty}</p>
        )}
      </div>
    </section>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('vi-VN', { dateStyle: 'medium', timeStyle: 'short' }).format(
    new Date(value),
  );
}

function readError(caught: unknown) {
  return caught instanceof Error ? caught.message : t('admin.error.load');
}
