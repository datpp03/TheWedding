import { AppShell } from '@/components/app-shell';
import { PageHeader } from '@/components/page-header';

export default function MediaPage() {
  return (
    <AppShell section="dashboard">
      <PageHeader
        title="Media"
        description="Upload, preview, reorder, and manage photo/video metadata."
      />
      <section className="rounded-md border border-dashed border-neutral-300 bg-white p-8 text-center">
        <h2 className="font-semibold text-ink">Bulk uploader placeholder</h2>
        <p className="mt-2 text-sm text-neutral-600">
          Upload validation and processing queue arrive in Phase 4 and 7.
        </p>
      </section>
    </AppShell>
  );
}
