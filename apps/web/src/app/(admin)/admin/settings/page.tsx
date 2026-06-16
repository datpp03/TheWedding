import { AppShell } from '@/components/app-shell';
import { PageHeader } from '@/components/page-header';
import { AdminDashboard } from '@/features/admin/admin-dashboard';
import { t } from '@/lib/i18n/locales';

export default function AdminSettingsPage() {
  return (
    <AppShell section="admin">
      <PageHeader title={t('admin.settings.title')} description={t('admin.settings.description')} />
      <AdminDashboard view="settings" />
    </AppShell>
  );
}
