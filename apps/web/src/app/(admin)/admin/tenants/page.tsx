import { AppShell } from '@/components/app-shell';
import { PageHeader } from '@/components/page-header';

export default function AdminTenantsPage() {
  return (
    <AppShell section="admin">
      <PageHeader
        title="Tenants"
        description="Monitor wedding sites, custom domains, visibility, and storage use."
      />
      <section className="rounded-md border border-neutral-200 bg-white p-4 text-sm text-neutral-600">
        Tenant administration arrives in Phase 6.
      </section>
    </AppShell>
  );
}
