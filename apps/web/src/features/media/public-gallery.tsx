'use client';

import type { WeddingTheme } from '@the-wedding/shared';
import { useEffect, useMemo, useState } from 'react';
import { t } from '@/lib/i18n/locales';
import { mediaSrc, type PublicGallery as PublicGalleryData, type MediaItem } from './media-api';

export function PublicGallery({
  gallery,
  theme,
}: {
  gallery: PublicGalleryData | null;
  theme?: WeddingTheme;
}) {
  const [active, setActive] = useState<MediaItem | null>(null);
  const flatMedia = useMemo(() => gallery?.albums.flatMap((album) => album.media) ?? [], [gallery]);
  const radius = theme ? `${theme.config.borderRadius}px` : undefined;
  const headingStyle = theme
    ? { color: theme.colors.text, fontFamily: theme.typography.headingFont }
    : undefined;
  const mutedStyle = theme ? { color: theme.colors.muted } : undefined;
  const surfaceStyle = theme
    ? { background: theme.colors.surface, borderRadius: radius, color: theme.colors.text }
    : undefined;
  const primaryButtonStyle = theme
    ? { background: theme.colors.primary, borderRadius: radius, color: theme.colors.surface }
    : undefined;

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
        <div
          className="mx-auto max-w-6xl border border-dashed p-8 text-center shadow-sm"
          style={
            theme
              ? {
                  background: theme.colors.surface,
                  borderColor: theme.colors.muted,
                  borderRadius: radius,
                  color: theme.colors.text,
                }
              : undefined
          }
        >
          <h2 className="font-semibold" style={headingStyle}>
            Gallery coming soon
          </h2>
          <p className="mt-2 text-sm" style={mutedStyle}>
            The couple has not published albums yet.
          </p>
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
                <h2 className="text-2xl font-semibold" style={headingStyle}>
                  {album.title}
                </h2>
                {album.description ? (
                  <p className="mt-1 text-sm" style={mutedStyle}>
                    {album.description}
                  </p>
                ) : null}
              </div>
              <span className="px-3 py-2 text-sm shadow-sm" style={surfaceStyle}>
                {album.media.length} moments
              </span>
            </div>
            <div
              className={`grid gap-2 ${
                theme?.config.mediaDensity === 'compact'
                  ? 'grid-cols-3'
                  : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'
              }`}
            >
              {album.media.map((item) => (
                <button
                  key={item.id}
                  className="group aspect-square overflow-hidden text-left shadow-sm"
                  style={{
                    background: theme?.colors.surface ?? undefined,
                    borderRadius: radius,
                  }}
                  onClick={() => setActive(item)}
                >
                  {item.type === 'image' && item.publicUrl ? (
                    <img
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                      src={mediaSrc(item.publicUrl)}
                      alt={item.title ?? item.originalFileName}
                    />
                  ) : item.type === 'video' && item.publicUrl ? (
                    <video
                      className="h-full w-full object-cover"
                      src={mediaSrc(item.publicUrl)}
                      muted
                      playsInline
                    />
                  ) : (
                    <ProcessingTile status={item.processingStatus} />
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
            className="absolute right-3 top-3 px-3 py-2 text-sm font-semibold shadow-sm"
            style={surfaceStyle}
            onClick={() => setActive(null)}
          >
            Close
          </button>
          <div
            className="m-auto grid max-h-full max-w-5xl gap-3"
            onClick={(event) => event.stopPropagation()}
          >
            {active.type === 'image' && active.publicUrl ? (
              <img
                className="max-h-[78vh] max-w-full object-contain"
                style={{ borderRadius: radius }}
                src={mediaSrc(active.publicUrl)}
                alt={active.title ?? active.originalFileName}
              />
            ) : active.type === 'video' && active.publicUrl ? (
              <video
                className="max-h-[78vh] max-w-full"
                style={{ borderRadius: radius }}
                src={mediaSrc(active.publicUrl)}
                controls
                autoPlay
              />
            ) : (
              <div
                className="grid min-h-64 place-items-center px-8 py-12 text-center"
                style={surfaceStyle}
              >
                <span className="text-sm font-semibold">
                  {t(`media.processing.${active.processingStatus}`)}
                </span>
              </div>
            )}
            <div
              className="flex flex-wrap items-center justify-between gap-2 p-3 shadow-sm"
              style={surfaceStyle}
            >
              <div>
                <p className="font-medium">{active.title ?? active.originalFileName}</p>
                {active.description ? (
                  <p className="text-sm" style={mutedStyle}>
                    {active.description}
                  </p>
                ) : null}
              </div>
              {gallery.albums.find((album) => album.id === active.albumId)?.allowDownload ? (
                <a
                  className="px-4 py-2 text-sm font-semibold"
                  style={primaryButtonStyle}
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

function ProcessingTile({ status }: { status: MediaItem['processingStatus'] }) {
  return (
    <div className="grid h-full w-full place-items-center bg-amber-50 p-4 text-center">
      <span className="text-xs font-semibold uppercase text-amber-800">
        {t(`media.processing.${status}`)}
      </span>
    </div>
  );
}
