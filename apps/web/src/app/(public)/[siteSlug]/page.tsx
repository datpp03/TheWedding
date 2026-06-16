import type { ApiResponse } from '@the-wedding/shared';
import { createThemeFromPreset, normalizeTheme } from '@the-wedding/shared';
import { PublicGallery } from '@/features/media/public-gallery';
import type { PublicGallery as PublicGalleryData } from '@/features/media/media-api';
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
  const gallery = site ? await fetchPublicGallery(siteSlug) : null;

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
  const theme = normalizeTheme(site.activeTheme ?? createThemeFromPreset());
  const radius = `${theme.config.borderRadius}px`;

  return (
    <main
      className="min-h-screen"
      style={{
        background: theme.colors.background,
        color: theme.colors.text,
        fontFamily: theme.typography.bodyFont,
      }}
    >
      <section className="px-4 py-8 sm:px-6 lg:px-8">
        <div
          className={`mx-auto grid max-w-6xl gap-8 lg:items-center ${
            theme.config.heroStyle === 'centered' ? 'text-center' : 'lg:grid-cols-[0.95fr_1.05fr]'
          }`}
        >
          <div>
            <p className="text-sm font-semibold uppercase" style={{ color: theme.colors.primary }}>
              /{site.slug}
            </p>
            <h1
              className="mt-3 text-4xl sm:text-5xl"
              style={{
                color: theme.colors.text,
                fontFamily: theme.typography.headingFont,
                fontWeight: theme.typography.headingWeight,
              }}
            >
              {title}
            </h1>
            {subtitle ? (
              <p
                className="mt-4 max-w-2xl text-base leading-7"
                style={{ color: theme.colors.muted }}
              >
                {subtitle}
              </p>
            ) : null}
            <div className="mt-6 flex flex-wrap gap-3 text-sm text-neutral-700">
              {site.brideName || site.groomName ? (
                <span
                  className="px-3 py-2 shadow-sm"
                  style={{
                    background: theme.colors.surface,
                    borderRadius: radius,
                    color: theme.colors.text,
                  }}
                >
                  {[site.brideName, site.groomName].filter(Boolean).join(' & ')}
                </span>
              ) : null}
              {site.weddingDate ? (
                <span
                  className="px-3 py-2 shadow-sm"
                  style={{
                    background: theme.colors.primary,
                    borderRadius: radius,
                    color: theme.colors.surface,
                  }}
                >
                  {new Intl.DateTimeFormat('en', { dateStyle: 'long' }).format(
                    new Date(site.weddingDate),
                  )}
                </span>
              ) : null}
            </div>
          </div>
          <div
            className={`grid gap-3 ${
              theme.config.mediaDensity === 'compact' ? 'grid-cols-3' : 'grid-cols-2'
            } ${theme.config.heroStyle === 'centered' ? 'mx-auto w-full max-w-3xl' : ''}`}
          >
            {(gallery?.albums.flatMap((album) => album.media).slice(0, 4) ?? []).map((item) => (
              <div
                key={item.id}
                className="aspect-[4/3] overflow-hidden border border-white/70 shadow-sm"
                style={{ background: theme.colors.surface, borderRadius: radius }}
              >
                {item.type === 'image' && item.publicUrl ? (
                  <img
                    className="h-full w-full object-cover"
                    src={absoluteMediaUrl(item.publicUrl)}
                    alt=""
                  />
                ) : item.type === 'video' && item.publicUrl ? (
                  <video
                    className="h-full w-full object-cover"
                    src={absoluteMediaUrl(item.publicUrl)}
                    muted
                    playsInline
                  />
                ) : (
                  <div className="h-full w-full" style={{ background: theme.colors.secondary }} />
                )}
              </div>
            ))}
            {gallery?.albums.flatMap((album) => album.media).length ? null : (
              <>
                {[
                  theme.colors.primary,
                  theme.colors.secondary,
                  theme.colors.surface,
                  theme.colors.text,
                ].map((color) => (
                  <div
                    key={color}
                    className="aspect-[4/3] shadow-sm"
                    style={{ background: color, borderRadius: radius }}
                  />
                ))}
              </>
            )}
          </div>
        </div>
      </section>
      <PublicGallery gallery={gallery} theme={theme} />
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

async function fetchPublicGallery(slug: string) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';
  const response = await fetch(`${apiUrl}/api/v1/public/sites/${slug}/gallery`, {
    cache: 'no-store',
  }).catch(() => null);

  if (!response?.ok) {
    return null;
  }

  const payload = (await response.json()) as ApiResponse<PublicGalleryData>;
  return payload.success ? payload.data : null;
}

function absoluteMediaUrl(url: string) {
  if (/^https?:\/\//.test(url)) return url;
  return `${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000'}${url}`;
}
