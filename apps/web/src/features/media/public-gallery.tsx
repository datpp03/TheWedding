'use client';

import { useEffect, useMemo, useState } from 'react';
import { mediaSrc, type PublicGallery as PublicGalleryData, type MediaItem } from './media-api';

export function PublicGallery({ gallery }: { gallery: PublicGalleryData | null }) {
  const [active, setActive] = useState<MediaItem | null>(null);
  const flatMedia = useMemo(() => gallery?.albums.flatMap((album) => album.media) ?? [], [gallery]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (!active) return;
      const index = flatMedia.findIndex((item) => item.id === active.id);
      if (event.key === 'Escape') setActive(null);
      if (event.key === 'ArrowRight')
        setActive(flatMedia[(index + 1) % flatMedia.length] ?? active);
      if (event.key === 'ArrowLeft')
        setActive(flatMedia[(index - 1 + flatMedia.length) % flatMedia.length] ?? active);
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [active, flatMedia]);

  if (!gallery || gallery.albums.length === 0) {
    return (
      <section className="px-4 pb-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl rounded-md border border-dashed border-neutral-300 bg-white p-8 text-center">
          <h2 className="font-semibold text-ink">Gallery coming soon</h2>
          <p className="mt-2 text-sm text-neutral-600">The couple has not published albums yet.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="px-4 pb-12 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-6xl gap-8">
        {gallery.albums.map((album) => (
          <div key={album.id} className="grid gap-3">
            <div className="flex flex-wrap items-end justify-between gap-2">
              <div>
                <h2 className="text-2xl font-semibold text-ink">{album.title}</h2>
                {album.description ? (
                  <p className="mt-1 text-sm text-neutral-600">{album.description}</p>
                ) : null}
              </div>
              <span className="rounded-md bg-white px-3 py-2 text-sm text-neutral-700 shadow-sm">
                {album.media.length} moments
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
              {album.media.map((item) => (
                <button
                  key={item.id}
                  className="group aspect-square overflow-hidden rounded-md bg-neutral-100 text-left shadow-sm"
                  onClick={() => setActive(item)}
                >
                  {item.type === 'image' ? (
                    <img
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                      src={mediaSrc(item.publicUrl)}
                      alt={item.title ?? item.originalFileName}
                    />
                  ) : (
                    <video
                      className="h-full w-full object-cover"
                      src={mediaSrc(item.publicUrl)}
                      muted
                      playsInline
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {active ? (
        <div
          className="fixed inset-0 z-50 grid bg-black/90 p-3 sm:p-6"
          role="dialog"
          aria-modal="true"
          onClick={() => setActive(null)}
        >
          <button
            className="absolute right-3 top-3 rounded-md bg-white px-3 py-2 text-sm font-semibold text-ink"
            onClick={() => setActive(null)}
          >
            Close
          </button>
          <div
            className="m-auto grid max-h-full max-w-5xl gap-3"
            onClick={(event) => event.stopPropagation()}
          >
            {active.type === 'image' ? (
              <img
                className="max-h-[78vh] max-w-full rounded-md object-contain"
                src={mediaSrc(active.publicUrl)}
                alt={active.title ?? active.originalFileName}
              />
            ) : (
              <video
                className="max-h-[78vh] max-w-full rounded-md"
                src={mediaSrc(active.publicUrl)}
                controls
                autoPlay
              />
            )}
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-md bg-white p-3">
              <div>
                <p className="font-medium text-ink">{active.title ?? active.originalFileName}</p>
                {active.description ? (
                  <p className="text-sm text-neutral-600">{active.description}</p>
                ) : null}
              </div>
              {gallery.albums.find((album) => album.id === active.albumId)?.allowDownload ? (
                <a
                  className="rounded-md bg-ink px-4 py-2 text-sm font-semibold text-white"
                  href={mediaSrc(
                    `/api/v1/public/tenants/${active.tenantId}/media/${active.id}/download`,
                  )}
                >
                  Download
                </a>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
