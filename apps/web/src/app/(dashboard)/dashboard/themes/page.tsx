import { AppShell } from '@/components/app-shell';
import { LocalizedPageHeader } from '@/components/localized-page-header';
import { ThemeDashboard } from '@/features/themes/theme-dashboard';

export default function ThemesPage() {
  return (
    <AppShell section="dashboard">
      <LocalizedPageHeader titleKey="themes.page.title" descriptionKey="themes.page.description" />
      <ThemeDashboard />
    </AppShell>
  );
}
