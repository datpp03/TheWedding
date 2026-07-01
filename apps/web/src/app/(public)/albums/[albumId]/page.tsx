import type { ApiResponse } from '@the-wedding/shared';
import type { Metadata } from 'next';
import Link from 'next/link';
import type { Route } from 'next';
import { redirect } from 'next/navigation';
import { mediaSrc } from '@/features/media/media-api';
import { AlbumSocialPanel } from '@/features/public-albums/album-social-panel';
import type { PublicAlbumDetail } from '@/features/public-albums/public-album-api';
import { t } from '@/lib/i18n/locales';
import { absoluteAppUrl, absoluteMediaUrl, getApiBaseUrl } from '@/lib/seo';

type PageProps = {
  params: Promise<{ albumId: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { albumId } = await params;
  const album = await fetchPublicAlbum(albumId);

  if (!album || album.visibility !== 'public') {
    return {
      title: t('public.album.notFoundTitle'),
      robots: {
        follow: false,
        index: false,
      },
    };
  }

  const albumPath = `/albums/${album.slug || album.id}`;
  const description = album.description || t('public.album.metaDescription');
  const image = absoluteMediaUrl(
    album.media.find((item) => item.type === 'image' && item.publicUrl)?.publicUrl,
  );

  return {
    title: album.title,
    description,
    alternates: {
      canonical: albumPath,
    },
    openGraph: {
      title: album.title,
      description,
      images: image ? [{ url: image }] : undefined,
      type: 'website',
      url: absoluteAppUrl(albumPath),
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
}

export default async function PublicAlbumPage({ params }: PageProps) {
  const { albumId } = await params;
  const album = await fetchPublicAlbum(albumId);

  if (!album) {
    return (
      <main className="grid min-h-screen place-items-center bg-pearl px-4">
        <section className="max-w-md rounded-md border border-neutral-200 bg-white p-6 text-center shadow-sm">
          <p className="text-sm font-semibold uppercase text-rose-700">404</p>
          <h1 className="mt-2 text-2xl font-semibold text-ink">
            {t('public.album.notFoundTitle')}
          </h1>
          <p className="mt-2 text-sm leading-6 text-neutral-600">
            {t('public.album.notFoundDescription')}
          </p>
          <Link
            className="mt-5 inline-flex rounded-md bg-ink px-4 py-2 text-sm font-semibold text-white"
            href="/"
          >
            {t('public.album.backHome')}
          </Link>
        </section>
      </main>
    );
  }

  const albumPath = `/albums/${album.slug || album.id}`;
  if (album.slug && albumId !== album.slug) {
    redirect(albumPath as Route);
  }

  const heroMedia = album.media.find((item) => item.type === 'image' && item.publicUrl);
  const imageGalleryJsonLd =
    album.visibility === 'public'
      ? {
          '@context': 'https://schema.org',
          '@type': 'ImageGallery',
          description: album.description || t('public.album.metaDescription'),
          image: album.media
            .filter((item) => item.type === 'image' && item.publicUrl)
            .slice(0, 12)
            .map((item) => absoluteMediaUrl(item.publicUrl)),
          name: album.title,
          url: absoluteAppUrl(albumPath),
        }
      : null;

  return (
    <main className="min-h-screen bg-[#fbfaf7] text-ink">
      {imageGalleryJsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(imageGalleryJsonLd) }}
        />
      ) : null}
      <section className="px-4 py-5 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <Link className="text-lg font-semibold tracking-tight" href="/">
            The Wedding
          </Link>
          <Link
            className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-neutral-700 shadow-sm ring-1 ring-neutral-200 transition hover:-translate-y-0.5 hover:shadow-md"
            href="/login"
          >
            {t('public.album.signIn')}
          </Link>
        </div>
      </section>

      <section className="px-4 pb-6 pt-4 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start">
          <div className="grid gap-6">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">
                {album.visibility === 'unlisted'
                  ? t('public.album.directLinkAlbum')
                  : t('public.album.publicAlbum')}
              </p>
              <h1 className="mt-3 text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                {album.title}
              </h1>
              {album.description ? (
                <p className="mt-4 max-w-2xl text-base leading-7 text-neutral-600">
                  {album.description}
                </p>
              ) : null}
              <div className="mt-6 flex flex-wrap gap-2 text-sm font-medium">
                <span className="rounded-full bg-rose-50 px-3 py-1 text-rose-700">
                  {album.mediaCount} {t('public.album.moments')}
                </span>
                <span className="rounded-full bg-teal-50 px-3 py-1 text-teal-700">
                  {album.wishCount} {t('public.album.wishes')}
                </span>
                <span className="rounded-full bg-amber-50 px-3 py-1 text-amber-700">
                  {album.reactionCount} {t('public.album.reactions')}
                </span>
              </div>
            </div>

            {heroMedia?.publicUrl ? (
              <div className="relative aspect-[16/9] overflow-hidden rounded-md bg-neutral-100 shadow-sm ring-1 ring-neutral-200">
                <img
                  className="h-full w-full object-cover"
                  src={mediaSrc(heroMedia.publicUrl)}
                  alt={heroMedia.title ?? heroMedia.originalFileName}
                  loading="eager"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/45 to-transparent p-5">
                  <p className="max-w-xl text-sm font-medium text-white/90">
                    {heroMedia.title ?? heroMedia.originalFileName}
                  </p>
                </div>
              </div>
            ) : null}
          </div>

          <AlbumSocialPanel
            albumId={album.id}
            albumPath={albumPath}
            initialReactions={album.reactions}
            initialWishes={album.wishes}
            symbols={album.symbols}
          />
        </div>
      </section>

      <section className="px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-rose-700">
                {t('public.album.gallery')}
              </p>
              <h2 className="mt-1 text-2xl font-semibold tracking-tight">
                {t('public.album.momentsTitle')}
              </h2>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {album.media.length ? (
              album.media.map((item, index) => (
                <div
                  key={item.id}
                  className={`group overflow-hidden rounded-md bg-white shadow-sm ring-1 ring-neutral-200 transition hover:-translate-y-0.5 hover:shadow-lg ${
                    index === 0 && album.media.length > 1 ? 'sm:col-span-2 sm:row-span-2' : ''
                  }`}
                >
                  {item.type === 'image' && item.publicUrl ? (
                    <div className="relative aspect-[4/5]">
                      <img
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                        src={mediaSrc(item.publicUrl)}
                        alt={item.title ?? item.originalFileName}
                        loading={index < 2 ? 'eager' : 'lazy'}
                      />
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/45 to-transparent p-4 opacity-0 transition group-hover:opacity-100">
                        <p className="truncate text-sm font-medium text-white">
                          {item.title ?? item.originalFileName}
                        </p>
                      </div>
                    </div>
                  ) : item.type === 'video' && item.publicUrl ? (
                    <video
                      className="aspect-[4/5] h-full w-full object-cover"
                      src={mediaSrc(item.publicUrl)}
                      controls
                    />
                  ) : (
                    <div className="grid aspect-[4/5] place-items-center bg-amber-50 p-4 text-center text-sm font-semibold text-amber-800">
                      {item.processingStatus === 'ready'
                        ? t('public.album.preparing')
                        : item.processingStatus}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="rounded-md border border-dashed border-neutral-300 bg-white p-8 text-center text-sm text-neutral-600 sm:col-span-2 lg:col-span-3">
                {t('public.album.emptyMedia')}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

async function fetchPublicAlbum(albumId: string) {
  const response = await fetch(`${getApiBaseUrl()}/api/v1/public/albums/${albumId}`, {
    cache: 'no-store',
  }).catch(() => null);
  if (!response?.ok) {
    return null;
  }
  const payload = (await response.json()) as ApiResponse<PublicAlbumDetail>;
  return payload.success ? payload.data : null;
}
