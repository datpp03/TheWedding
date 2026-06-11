import { AppShell } from '@/components/app-shell';
import { PageHeader } from '@/components/page-header';

export default function AdminMediaPage() {
  return (
    <AppShell section="admin">
      <PageHeader
        title="Media Audit"
        description="Inspect storage usage, processing status, and risky media operations."
      />
      <section className="rounded-md border border-neutral-200 bg-white p-4 text-sm text-neutral-600">
        Media audit workflows arrive after upload and processing are implemented.
      </section>
    </AppShell>
  );
}
