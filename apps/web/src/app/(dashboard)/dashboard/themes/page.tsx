import { THEME_PRESETS } from '@the-wedding/shared';
import { AppShell } from '@/components/app-shell';
import { PageHeader } from '@/components/page-header';

export default function ThemesPage() {
  return (
    <AppShell section="dashboard">
      <PageHeader
        title="Themes"
        description="Preview and activate visual styles for the public wedding site."
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {THEME_PRESETS.map((theme) => (
          <section key={theme} className="rounded-md border border-neutral-200 bg-white p-4">
            <div className="h-24 rounded bg-[linear-gradient(135deg,#f7f5f2,#c9a86a,#7f9183)]" />
            <h2 className="mt-3 font-semibold text-ink">{theme}</h2>
            <button className="mt-3 h-9 rounded-md border border-neutral-200 px-3 text-sm">
              Preview
            </button>
          </section>
        ))}
      </div>
    </AppShell>
  );
}
