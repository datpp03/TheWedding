import { AppShell } from '@/components/app-shell';
import { PageHeader } from '@/components/page-header';
import { AdminDashboard } from '@/features/admin/admin-dashboard';
import { t } from '@/lib/i18n/locales';

export default function AdminTenantsPage() {
  return (
    <AppShell section="admin">
      <PageHeader title={t('admin.tenants.title')} description={t('admin.tenants.description')} />
      <AdminDashboard view="tenants" />
    </AppShell>
  );
}
