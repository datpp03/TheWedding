import type { ApiResponse } from '@the-wedding/shared';
import type { PublicTenant } from '@/features/tenants/tenant-api';

type PageProps = {
  params: Promise<{
    siteSlug: string;
  }>;
  searchParams: Promise<{
    password?: string;
  }>;
};

export default async function PublicSitePage({ params, searchParams }: PageProps) {
  const { siteSlug } = await params;
  const { password } = await searchParams;
  const site = await fetchPublicSite(siteSlug, password);

  if (!site) {
    return (
      <main className="grid min-h-screen place-items-center bg-pearl px-4">
        <section className="max-w-md rounded-md border border-neutral-200 bg-white p-6 text-center shadow-sm">
          <p className="text-sm font-semibold uppercase text-sage">404</p>
          <h1 className="mt-2 text-2xl font-semibold text-ink">Site not found</h1>
          <p className="mt-2 text-sm leading-6 text-neutral-600">
            This wedding site is unavailable or the slug has changed.
          </p>
        </section>
      </main>
    );
  }

  if (site.requiresPassword) {
    return (
      <main className="grid min-h-screen place-items-center bg-pearl px-4">
        <form className="w-full max-w-md rounded-md border border-neutral-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase text-sage">Private celebration</p>
          <h1 className="mt-2 text-2xl font-semibold text-ink">{site.siteName}</h1>
          <p className="mt-2 text-sm leading-6 text-neutral-600">
            Enter the access password shared by the couple to view this wedding site.
          </p>
          <input
            className="mt-5 h-11 w-full rounded-md border-neutral-300"
            name="password"
            placeholder="Access password"
            type="password"
          />
          <button className="mt-3 h-11 w-full rounded-md bg-ink text-sm font-semibold text-white">
            Unlock site
          </button>
        </form>
      </main>
    );
  }

  const title = site.seo.title || site.sharing.headline || site.siteName;
  const subtitle = site.settings.welcomeMessage || site.description;

  return (
    <main className="min-h-screen bg-pearl">
      <section className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase text-sage">/{site.slug}</p>
            <h1 className="mt-3 text-4xl font-semibold text-ink sm:text-5xl">{title}</h1>
            {subtitle ? (
              <p className="mt-4 max-w-2xl text-base leading-7 text-neutral-600">{subtitle}</p>
            ) : null}
            <div className="mt-6 flex flex-wrap gap-3 text-sm text-neutral-700">
              {site.brideName || site.groomName ? (
                <span className="rounded-md bg-white px-3 py-2 shadow-sm">
                  {[site.brideName, site.groomName].filter(Boolean).join(' & ')}
                </span>
              ) : null}
              {site.weddingDate ? (
                <span className="rounded-md bg-white px-3 py-2 shadow-sm">
                  {new Intl.DateTimeFormat('en', { dateStyle: 'long' }).format(
                    new Date(site.weddingDate),
                  )}
                </span>
              ) : null}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {['bg-champagne', 'bg-sage', 'bg-rosewood', 'bg-neutral-900'].map((frame, index) => (
              <div
                key={frame}
                className={`aspect-[4/3] rounded-md border border-white/70 shadow-sm ${frame}`}
                aria-label={`Wedding frame ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

async function fetchPublicSite(slug: string, password?: string) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';
  const params = password ? `?password=${encodeURIComponent(password)}` : '';
  const response = await fetch(`${apiUrl}/api/v1/public/sites/${slug}${params}`, {
    cache: 'no-store',
  }).catch(() => null);

  if (!response) {
    return null;
  }

  if (!response.ok) {
    return null;
  }

  const payload = (await response.json()) as ApiResponse<PublicTenant>;
  return payload.success ? payload.data : null;
}
