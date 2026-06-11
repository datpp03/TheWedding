import { AppShell } from '@/components/app-shell';
import { MetricCard } from '@/components/metric-card';
import { PageHeader } from '@/components/page-header';

const metrics = [
  { label: 'Active sites', value: '1', detail: 'Primary wedding site' },
  { label: 'Albums', value: '0', detail: 'Ready for Phase 4' },
  { label: 'Media storage', value: '0 GB', detail: 'Tracked after upload support' },
  { label: 'Public visibility', value: 'Private', detail: 'Tenant setting placeholder' },
];

export default function DashboardPage() {
  return (
    <AppShell section="dashboard">
      <PageHeader
        title="Dashboard"
        description="Manage wedding sites, albums, media, theme, and sharing controls."
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <MetricCard key={metric.label} {...metric} />
        ))}
      </div>
      <section className="mt-6 rounded-md border border-neutral-200 bg-white">
        <div className="border-b border-neutral-200 px-4 py-3">
          <h2 className="font-semibold text-ink">Implementation queue</h2>
        </div>
        <div className="divide-y divide-neutral-100 text-sm">
          {[
            'Auth and sessions',
            'Tenant settings',
            'Album management',
            'Media upload',
            'Theme preview',
          ].map((item) => (
            <div key={item} className="flex items-center justify-between px-4 py-3">
              <span>{item}</span>
              <span className="rounded bg-neutral-100 px-2 py-1 text-xs text-neutral-600">
                planned
              </span>
            </div>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
