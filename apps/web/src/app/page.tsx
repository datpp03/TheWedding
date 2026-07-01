import type { ApiResponse } from '@the-wedding/shared';
import type { Metadata } from 'next';
import Link from 'next/link';
import { PublicHomeAuthNav } from '@/features/auth/public-home-auth-nav';
import { PublicAlbumCard } from '@/features/public-albums/public-album-card';
import type { PublicHome } from '@/features/public-albums/public-album-api';
import { t } from '@/lib/i18n/locales';
import { absoluteAppUrl, getApiBaseUrl } from '@/lib/seo';

export const metadata: Metadata = {
  title: t('public.home.metaTitle'),
  description: t('public.home.metaDescription'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: t('public.home.metaTitle'),
    description: t('public.home.metaDescription'),
    type: 'website',
    url: '/',
  },
  robots: {
    follow: true,
    index: true,
    googleBot: {
      follow: true,
      index: true,
      'max-image-preview': 'large',
    },
  },
};

export default async function HomePage() {
  const home = await fetchPublicHome();
  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    description: t('public.home.metaDescription'),
    name: 'The Wedding',
    url: absoluteAppUrl('/'),
  };

  return (
    <main className="min-h-screen bg-pearl">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <section className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <Link className="text-lg font-semibold text-ink" href="/">
            The Wedding
          </Link>
          <PublicHomeAuthNav />
        </div>
      </section>

      <section className="px-4 pb-10 pt-4 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-6">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase text-rose-700">
              {t('public.home.kicker')}
            </p>
            <h1 className="mt-3 text-4xl font-semibold leading-tight text-ink sm:text-6xl">
              {t('public.home.title')}
            </h1>
            <p className="mt-4 text-base leading-7 text-neutral-600">
              {t('public.home.description')}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              className="rounded-md bg-rose-600 px-5 py-3 text-sm font-semibold text-white"
              href="#today"
            >
              {t('public.home.todayCta')}
            </Link>
            <Link
              className="rounded-md border border-teal-200 bg-white px-5 py-3 text-sm font-semibold text-teal-800"
              href="#week"
            >
              {t('public.home.weekCta')}
            </Link>
          </div>
        </div>
      </section>

      <FeaturedSection
        id="today"
        title={t('public.home.todayTitle')}
        albums={home?.featuredToday ?? []}
      />
      <FeaturedSection
        id="week"
        title={t('public.home.weekTitle')}
        albums={home?.featuredWeek ?? []}
      />
    </main>
  );
}

function FeaturedSection({
  albums,
  id,
  title,
}: {
  albums: PublicHome['featuredToday'];
  id: string;
  title: string;
}) {
  return (
    <section id={id} className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-6xl gap-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase text-teal-700">
              {t('public.home.sectionEyebrow')}
            </p>
            <h2 className="mt-1 text-2xl font-semibold text-ink">{title}</h2>
          </div>
        </div>
        {albums.length ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {albums.map((album) => (
              <PublicAlbumCard key={album.id} album={album} />
            ))}
          </div>
        ) : (
          <div className="rounded-md border border-dashed border-rose-200 bg-white p-8 text-center shadow-sm">
            <h3 className="text-lg font-semibold text-ink">{t('public.home.emptyTitle')}</h3>
            <p className="mt-2 text-sm text-neutral-600">{t('public.home.emptyDescription')}</p>
          </div>
        )}
      </div>
    </section>
  );
}

async function fetchPublicHome() {
  const response = await fetch(`${getApiBaseUrl()}/api/v1/public/home`, {
    cache: 'no-store',
  }).catch(() => null);
  if (!response?.ok) {
    return null;
  }
  const payload = (await response.json()) as ApiResponse<PublicHome>;
  return payload.success ? payload.data : null;
}
