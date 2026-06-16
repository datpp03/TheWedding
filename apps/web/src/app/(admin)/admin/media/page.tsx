import { AppShell } from '@/components/app-shell';
import { PageHeader } from '@/components/page-header';
import { AdminDashboard } from '@/features/admin/admin-dashboard';
import { t } from '@/lib/i18n/locales';

export default function AdminMediaPage() {
  return (
    <AppShell section="admin">
      <PageHeader title={t('admin.media.title')} description={t('admin.media.description')} />
      <AdminDashboard view="media" />
    </AppShell>
  );
}
