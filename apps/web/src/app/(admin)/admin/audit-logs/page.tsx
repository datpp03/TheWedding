import { AppShell } from '@/components/app-shell';
import { PageHeader } from '@/components/page-header';

export default function AdminAuditLogsPage() {
  return (
    <AppShell section="admin">
      <PageHeader
        title="Audit Logs"
        description="Track sensitive authentication, tenant, media, permission, and admin events."
      />
      <section className="rounded-md border border-neutral-200 bg-white p-4 text-sm text-neutral-600">
        Audit log search and filtering arrive in Phase 6.
      </section>
    </AppShell>
  );
}
