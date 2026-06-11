import { AppShell } from '@/components/app-shell';
import { PageHeader } from '@/components/page-header';

export default function SettingsPage() {
  return (
    <AppShell section="dashboard">
      <PageHeader
        title="Settings"
        description="Configure site identity, visibility, SEO, sharing, and download rules."
      />
      <form className="grid gap-4 rounded-md border border-neutral-200 bg-white p-4">
        <label className="grid gap-2 text-sm font-medium text-neutral-700">
          Site name
          <input className="rounded-md border-neutral-300" defaultValue="Our Wedding" />
        </label>
        <label className="grid gap-2 text-sm font-medium text-neutral-700">
          Visibility
          <select className="rounded-md border-neutral-300" defaultValue="private">
            <option value="public">Public</option>
            <option value="private">Private</option>
            <option value="password_protected">Password protected</option>
          </select>
        </label>
        <button className="h-10 w-fit rounded-md bg-ink px-4 text-sm font-medium text-white">
          Save settings
        </button>
      </form>
    </AppShell>
  );
}
