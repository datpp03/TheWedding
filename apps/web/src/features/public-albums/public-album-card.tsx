import Link from 'next/link';
import type { Route } from 'next';
import { mediaSrc } from '@/features/media/media-api';
import type { PublicAlbumCard as PublicAlbumCardData } from './public-album-api';

export function PublicAlbumCard({ album }: { album: PublicAlbumCardData }) {
  return (
    <article className="grid min-h-[360px] overflow-hidden rounded-md border border-rose-100 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-rose-300 hover:shadow-md">
      <div className="relative aspect-[4/3] bg-gradient-to-br from-rose-100 via-teal-50 to-amber-100">
        {album.coverUrl ? (
          <img
            className="h-full w-full object-cover"
            src={mediaSrc(album.coverUrl)}
            alt=""
            loading="lazy"
          />
        ) : (
          <div className="grid h-full place-items-center px-6 text-center text-sm font-semibold text-rose-700">
            The Wedding
          </div>
        )}
        <div className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold uppercase text-rose-700 shadow-sm">
          {album.source}
        </div>
      </div>
      <div className="grid gap-3 p-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-teal-700">
            /{album.tenantSlug}
          </p>
          <h3 className="mt-1 text-lg font-semibold leading-snug text-ink">{album.title}</h3>
          {album.description ? (
            <p className="mt-2 line-clamp-2 text-sm leading-6 text-neutral-600">
              {album.description}
            </p>
          ) : (
            <p className="mt-2 text-sm leading-6 text-neutral-500">
              A public album ready for guests to explore.
            </p>
          )}
        </div>
        <div className="flex flex-wrap gap-2 text-xs font-medium text-neutral-600">
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
        <Link
          className="mt-auto inline-flex h-10 items-center justify-center rounded-md bg-rose-600 px-4 text-sm font-semibold text-white transition hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-300"
          href={`/albums/${album.id}` as Route}
        >
          Open album
        </Link>
      </div>
    </article>
  );
}
