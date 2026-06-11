import { AppShell } from '@/components/app-shell';
import { MetricCard } from '@/components/metric-card';
import { PageHeader } from '@/components/page-header';

const metrics = [
  { label: 'Users', value: '0', detail: 'Auth starts Phase 2' },
  { label: 'Tenants', value: '0', detail: 'Tenant module starts Phase 3' },
  { label: 'Media items', value: '0', detail: 'Upload starts Phase 4' },
  { label: 'Security events', value: '0', detail: 'Audit log base starts Phase 2' },
];

export default function AdminPage() {
  return (
    <AppShell section="admin">
      <PageHeader
        title="Admin"
        description="System overview for users, tenants, media, storage, settings, and audit logs."
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <MetricCard key={metric.label} {...metric} />
        ))}
      </div>
    </AppShell>
  );
}
