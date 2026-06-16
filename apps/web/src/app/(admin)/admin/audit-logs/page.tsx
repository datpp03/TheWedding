import { AppShell } from '@/components/app-shell';
import { PageHeader } from '@/components/page-header';
import { AdminDashboard } from '@/features/admin/admin-dashboard';
import { t } from '@/lib/i18n/locales';

export default function AdminAuditLogsPage() {
  return (
    <AppShell section="admin">
      <PageHeader title={t('admin.audit.title')} description={t('admin.audit.description')} />
      <AdminDashboard view="audit" />
    </AppShell>
  );
}
