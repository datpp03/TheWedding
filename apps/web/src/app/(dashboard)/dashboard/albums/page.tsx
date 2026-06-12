import { AppShell } from '@/components/app-shell';
import { PageHeader } from '@/components/page-header';
import { AlbumsDashboard } from '@/features/media/albums-dashboard';

export default function AlbumsPage() {
  return (
    <AppShell section="dashboard">
      <PageHeader title="Albums" description="Create, sort, protect, and publish wedding albums." />
      <AlbumsDashboard />
    </AppShell>
  );
}
