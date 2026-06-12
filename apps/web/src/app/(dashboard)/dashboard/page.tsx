import { AppShell } from '@/components/app-shell';
import { PageHeader } from '@/components/page-header';
import { TenantDashboard } from '@/features/tenants/tenant-dashboard';

export default function DashboardPage() {
  return (
    <AppShell section="dashboard">
      <PageHeader
        title="Dashboard"
        description="Manage wedding sites, albums, media, theme, and sharing controls."
      />
      <TenantDashboard />
    </AppShell>
  );
}
