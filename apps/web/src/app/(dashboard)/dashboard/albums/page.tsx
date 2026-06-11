import { AppShell } from '@/components/app-shell';
import { PageHeader } from '@/components/page-header';

export default function AlbumsPage() {
  return (
    <AppShell section="dashboard">
      <PageHeader title="Albums" description="Create, sort, protect, and publish wedding albums." />
      <section className="rounded-md border border-neutral-200 bg-white p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-semibold text-ink">No albums yet</h2>
            <p className="mt-1 text-sm text-neutral-600">Album CRUD starts in Phase 4.</p>
          </div>
          <button className="h-10 rounded-md bg-ink px-4 text-sm font-medium text-white">
            New album
          </button>
        </div>
      </section>
    </AppShell>
  );
}
