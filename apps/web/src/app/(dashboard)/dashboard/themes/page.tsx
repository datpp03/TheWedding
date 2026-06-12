import { AppShell } from '@/components/app-shell';
import { PageHeader } from '@/components/page-header';
import { ThemeDashboard } from '@/features/themes/theme-dashboard';
import { t } from '@/lib/i18n/locales';

export default function ThemesPage() {
  return (
    <AppShell section="dashboard">
      <PageHeader title={t('themes.page.title')} description={t('themes.page.description')} />
      <ThemeDashboard />
    </AppShell>
  );
}
