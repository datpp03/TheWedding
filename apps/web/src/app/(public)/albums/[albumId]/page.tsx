import type { ApiResponse } from '@the-wedding/shared';
import Link from 'next/link';
import { mediaSrc } from '@/features/media/media-api';
import { AlbumSocialPanel } from '@/features/public-albums/album-social-panel';
import type { PublicAlbumDetail } from '@/features/public-albums/public-album-api';

type PageProps = {
  params: Promise<{ albumId: string }>;
};

export default async function PublicAlbumPage({ params }: PageProps) {
  const { albumId } = await params;
  const album = await fetchPublicAlbum(albumId);

  if (!album) {
    return (
      <main className="grid min-h-screen place-items-center bg-pearl px-4">
        <section className="max-w-md rounded-md border border-neutral-200 bg-white p-6 text-center shadow-sm">
          <p className="text-sm font-semibold uppercase text-rose-700">404</p>
          <h1 className="mt-2 text-2xl font-semibold text-ink">Album not found</h1>
          <p className="mt-2 text-sm leading-6 text-neutral-600">
            This album is private, unavailable, or no longer published.
          </p>
          <Link
            className="mt-5 inline-flex rounded-md bg-ink px-4 py-2 text-sm font-semibold text-white"
            href="/"
          >
            Back home
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-pearl">
      <section className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <Link className="text-lg font-semibold text-ink" href="/">
            The Wedding
          </Link>
          <Link
            className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-neutral-700 shadow-sm"
            href="/login"
          >
            Sign in
          </Link>
        </div>
      </section>
      <section className="px-4 pb-8 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <div>
            <p className="text-sm font-semibold uppercase text-teal-700">
              {album.visibility === 'unlisted' ? 'Direct link album' : 'Public album'}
            </p>
            <h1 className="mt-3 text-4xl font-semibold leading-tight text-ink sm:text-5xl">
              {album.title}
            </h1>
            {album.description ? (
              <p className="mt-4 max-w-2xl text-base leading-7 text-neutral-600">
                {album.description}
              </p>
            ) : null}
            <div className="mt-5 flex flex-wrap gap-2 text-sm font-medium">
              <span className="rounded-full bg-rose-50 px-3 py-1 text-rose-700">
                {album.mediaCount} moments
              </span>
              <span className="rounded-full bg-teal-50 px-3 py-1 text-teal-700">
                {album.wishCount} wishes
              </span>
              <span className="rounded-full bg-amber-50 px-3 py-1 text-amber-700">
                {album.reactionCount} reactions
              </span>
            </div>
          </div>
          <AlbumSocialPanel
            albumId={album.id}
            initialReactions={album.reactions}
            initialWishes={album.wishes}
            symbols={album.symbols}
          />
        </div>
      </section>

      <section className="px-4 pb-12 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {album.media.length ? (
            album.media.map((item) => (
              <div
                key={item.id}
                className="aspect-square overflow-hidden rounded-md bg-white shadow-sm"
              >
                {item.type === 'image' && item.publicUrl ? (
                  <img
                    className="h-full w-full object-cover"
                    src={mediaSrc(item.publicUrl)}
                    alt={item.title ?? item.originalFileName}
                    loading="lazy"
                  />
                ) : item.type === 'video' && item.publicUrl ? (
                  <video
                    className="h-full w-full object-cover"
                    src={mediaSrc(item.publicUrl)}
                    controls
                  />
                ) : (
                  <div className="grid h-full place-items-center bg-amber-50 p-4 text-center text-sm font-semibold text-amber-800">
                    {item.processingStatus}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="rounded-md border border-dashed border-neutral-300 bg-white p-8 text-center text-sm text-neutral-600 sm:col-span-2 lg:col-span-3">
              This album does not have public media yet.
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

async function fetchPublicAlbum(albumId: string) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';
  const response = await fetch(`${apiUrl}/api/v1/public/albums/${albumId}`, {
    cache: 'no-store',
  }).catch(() => null);
  if (!response?.ok) {
    return null;
  }
  const payload = (await response.json()) as ApiResponse<PublicAlbumDetail>;
  return payload.success ? payload.data : null;
}
