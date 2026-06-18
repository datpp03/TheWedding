import { AppShell } from '@/components/app-shell';
import { PageHeader } from '@/components/page-header';
import { ScaleAdminDashboard } from '@/features/scale/scale-admin-dashboard';
import { t } from '@/lib/i18n/locales';

export default function AdminScalePage() {
  return (
    <AppShell section="admin">
      <PageHeader title={t('scale.page.title')} description={t('scale.page.description')} />
      <ScaleAdminDashboard />
    </AppShell>
  );
}
