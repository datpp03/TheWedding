import { AppShell } from '@/components/app-shell';
import { PageHeader } from '@/components/page-header';
import { TenantSettingsPanel } from '@/features/tenants/tenant-settings-panel';

type PageProps = {
  searchParams: Promise<{
    tenantId?: string;
  }>;
};

export default async function SettingsPage({ searchParams }: PageProps) {
  const { tenantId } = await searchParams;

  return (
    <AppShell section="dashboard">
      <PageHeader
        title="Settings"
        description="Configure site identity, visibility, SEO, sharing, and download rules."
      />
      <TenantSettingsPanel tenantId={tenantId} />
    </AppShell>
  );
}
