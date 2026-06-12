import { AppShell } from '@/components/app-shell';
import { PageHeader } from '@/components/page-header';
import { MediaDashboard } from '@/features/media/media-dashboard';

export default function MediaPage() {
  return (
    <AppShell section="dashboard">
      <PageHeader
        title="Media"
        description="Upload, preview, reorder, and manage photo/video metadata."
      />
      <MediaDashboard />
    </AppShell>
  );
}
