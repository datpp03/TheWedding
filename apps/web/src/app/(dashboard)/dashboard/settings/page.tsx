import { AppShell } from '@/components/app-shell';
import { LocalizedPageHeader } from '@/components/localized-page-header';
import { AccountSecurityPanel } from '@/features/auth/account-security-panel';
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
      <LocalizedPageHeader
        titleKey="dashboard.settings.title"
        descriptionKey="dashboard.settings.description"
      />
      <div className="grid gap-6">
        <AccountSecurityPanel />
        <TenantSettingsPanel tenantId={tenantId} />
      </div>
    </AppShell>
  );
}
