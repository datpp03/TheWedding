import { AppShell } from '@/components/app-shell';
import { PageHeader } from '@/components/page-header';
import { AdminDashboard } from '@/features/admin/admin-dashboard';
import { t } from '@/lib/i18n/locales';

export default function AdminUsersPage() {
  return (
    <AppShell section="admin">
      <PageHeader title={t('admin.users.title')} description={t('admin.users.description')} />
      <AdminDashboard view="users" />
    </AppShell>
  );
}
