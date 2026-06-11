import { AppShell } from '@/components/app-shell';
import { PageHeader } from '@/components/page-header';

export default function AdminUsersPage() {
  return (
    <AppShell section="admin">
      <PageHeader
        title="Users"
        description="Review accounts, roles, lock status, and verification state."
      />
      <section className="rounded-md border border-neutral-200 bg-white p-4 text-sm text-neutral-600">
        User management API arrives in Phase 6.
      </section>
    </AppShell>
  );
}
