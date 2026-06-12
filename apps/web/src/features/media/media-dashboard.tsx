'use client';

import { useEffect, useMemo, useState } from 'react';
import { listTenants, type Tenant } from '@/features/tenants/tenant-api';
import {
  deleteMedia,
  listAlbums,
  listMedia,
  mediaSrc,
  moveMedia,
  setAlbumCover,
  uploadMedia,
  type Album,
  type MediaItem,
} from './media-api';

type QueueItem = {
  file: File;
  status: 'queued' | 'uploading' | 'done' | 'failed';
  error?: string;
};

export function MediaDashboard() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [tenantId, setTenantId] = useState('');
  const [albums, setAlbums] = useState<Album[]>([]);
  const [albumId, setAlbumId] = useState('');
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    void listTenants().then((rows) => {
      setTenants(rows);
      setTenantId(rows[0]?.id ?? '');
    });
  }, []);

  useEffect(() => {
    if (!tenantId) return;
    void listAlbums(tenantId).then((rows) => {
      setAlbums(rows);
      setAlbumId(rows[0]?.id ?? '');
    });
  }, [tenantId]);

  useEffect(() => {
    if (!tenantId || !albumId) {
      setMedia([]);
      return;
    }
    void listMedia(tenantId, albumId).then(setMedia);
  }, [tenantId, albumId]);

  const selectedAlbum = useMemo(
    () => albums.find((album) => album.id === albumId),
    [albumId, albums],
  );

  function enqueue(files: FileList | File[]) {
    setQueue((current) => [
      ...current,
      ...Array.from(files).map((file) => ({ file, status: 'queued' as const })),
    ]);
  }

  async function uploadQueue() {
    for (const item of queue) {
      if (item.status === 'done' || !tenantId || !albumId) continue;
      setQueue((current) =>
        current.map((queueItem) =>
          queueItem.file === item.file ? { ...queueItem, status: 'uploading' } : queueItem,
        ),
      );
      try {
        const uploaded = await uploadMedia(tenantId, albumId, item.file);
        setMedia((current) => [...current, uploaded]);
        setQueue((current) =>
          current.map((queueItem) =>
            queueItem.file === item.file ? { ...queueItem, status: 'done' } : queueItem,
          ),
        );
      } catch (error) {
        setQueue((current) =>
          current.map((queueItem) =>
            queueItem.file === item.file
              ? {
                  ...queueItem,
                  error: error instanceof Error ? error.message : 'Upload failed',
                  status: 'failed',
                }
              : queueItem,
          ),
        );
      }
    }
  }

  async function handleDelete() {
    if (!selected.length) return;
    await deleteMedia(tenantId, selected);
    setMedia((current) => current.filter((item) => !selected.includes(item.id)));
    setSelected([]);
    setMessage('Selected media deleted.');
  }

  async function handleMove(targetAlbumId: string) {
    for (const mediaId of selected) {
      await moveMedia(tenantId, mediaId, targetAlbumId);
    }
    setMedia((current) => current.filter((item) => !selected.includes(item.id)));
    setSelected([]);
    setMessage('Selected media moved.');
  }

  return (
    <div className="grid gap-5">
      <section className="grid gap-3 rounded-md border border-neutral-200 bg-white p-4 shadow-sm md:grid-cols-3">
        <label className="grid gap-2 text-sm font-medium text-neutral-700">
          Site
          <select
            className="h-11 rounded-md border-neutral-300"
            value={tenantId}
            onChange={(event) => setTenantId(event.target.value)}
          >
            {tenants.map((tenant) => (
              <option key={tenant.id} value={tenant.id}>
                {tenant.siteName}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-2 text-sm font-medium text-neutral-700">
          Album
          <select
            className="h-11 rounded-md border-neutral-300"
            value={albumId}
            onChange={(event) => setAlbumId(event.target.value)}
          >
            {albums.map((album) => (
              <option key={album.id} value={album.id}>
                {album.title}
              </option>
            ))}
          </select>
        </label>
        <div className="grid content-end">
          <span className="rounded-md bg-champagne px-3 py-3 text-sm text-ink">
            {selectedAlbum ? `${selectedAlbum.visibility} album` : 'Create an album first'}
          </span>
        </div>
      </section>

      <section
        className="rounded-md border border-dashed border-neutral-300 bg-white p-6 text-center shadow-sm"
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault();
          enqueue(event.dataTransfer.files);
        }}
      >
        <h2 className="font-semibold text-ink">Drop photos or videos</h2>
        <p className="mt-2 text-sm text-neutral-600">
          JPEG, PNG, WebP, MP4, WebM, and MOV are accepted.
        </p>
        <input
          className="mt-4 max-w-full text-sm"
          multiple
          type="file"
          accept="image/jpeg,image/png,image/webp,video/mp4,video/webm,video/quicktime"
          onChange={(event) => event.target.files && enqueue(event.target.files)}
        />
        <div className="mt-4 flex justify-center gap-2">
          <button
            className="rounded-md bg-ink px-4 py-2 text-sm font-semibold text-white disabled:bg-neutral-400"
            disabled={!queue.some((item) => item.status !== 'done') || !albumId}
            onClick={() => void uploadQueue()}
          >
            Upload queue
          </button>
          <button
            className="rounded-md border border-neutral-300 px-4 py-2 text-sm"
            onClick={() => setQueue([])}
          >
            Clear
          </button>
        </div>
        {queue.length ? (
          <div className="mt-4 grid gap-2 text-left">
            {queue.map((item) => (
              <div
                key={`${item.file.name}-${item.file.lastModified}`}
                className="rounded-md bg-neutral-50 px-3 py-2 text-sm text-neutral-700"
              >
                {item.file.name} · {item.status}
                {item.error ? <span className="text-red-700"> · {item.error}</span> : null}
              </div>
            ))}
          </div>
        ) : null}
      </section>

      {selected.length ? (
        <section className="flex flex-wrap items-center gap-2 rounded-md border border-neutral-200 bg-white p-3 shadow-sm">
          <span className="text-sm font-medium text-ink">{selected.length} selected</span>
          <button
            className="rounded-md border border-red-200 px-3 py-2 text-sm text-red-700"
            onClick={() => void handleDelete()}
          >
            Delete
          </button>
          <select
            className="h-10 rounded-md border-neutral-300 text-sm"
            onChange={(event) => event.target.value && void handleMove(event.target.value)}
            defaultValue=""
          >
            <option value="" disabled>
              Move to album
            </option>
            {albums
              .filter((album) => album.id !== albumId)
              .map((album) => (
                <option key={album.id} value={album.id}>
                  {album.title}
                </option>
              ))}
          </select>
          {message ? <span className="text-sm text-neutral-600">{message}</span> : null}
        </section>
      ) : null}

      {media.length ? (
        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {media.map((item) => (
            <article
              key={item.id}
              className="overflow-hidden rounded-md border border-neutral-200 bg-white shadow-sm"
            >
              <button
                className="block aspect-square w-full bg-neutral-100 text-left"
                onClick={() =>
                  setSelected((current) =>
                    current.includes(item.id)
                      ? current.filter((id) => id !== item.id)
                      : [...current, item.id],
                  )
                }
              >
                {item.type === 'image' ? (
                  <img
                    className="h-full w-full object-cover"
                    src={mediaSrc(item.publicUrl)}
                    alt={item.title ?? item.originalFileName}
                  />
                ) : (
                  <video
                    className="h-full w-full object-cover"
                    src={mediaSrc(item.publicUrl)}
                    muted
                  />
                )}
              </button>
              <div className="grid gap-2 p-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate text-sm font-medium text-ink">
                    {item.title ?? item.originalFileName}
                  </span>
                  <input
                    className="rounded border-neutral-300"
                    type="checkbox"
                    checked={selected.includes(item.id)}
                    readOnly
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    className="rounded-md border border-neutral-300 px-3 py-2 text-sm"
                    onClick={() => void setAlbumCover(tenantId, albumId, item.id)}
                  >
                    Set cover
                  </button>
                  <a
                    className="rounded-md border border-neutral-300 px-3 py-2 text-sm"
                    href={mediaSrc(`/api/v1/tenants/${tenantId}/media/${item.id}/download`)}
                  >
                    Download
                  </a>
                </div>
              </div>
            </article>
          ))}
        </section>
      ) : (
        <section className="rounded-md border border-neutral-200 bg-white p-8 text-center">
          <h2 className="font-semibold text-ink">No media yet</h2>
          <p className="mt-2 text-sm text-neutral-600">
            Upload a few images to turn this into a gallery.
          </p>
        </section>
      )}
    </div>
  );
}
