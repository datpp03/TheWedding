'use client';

import { useEffect, useState } from 'react';
import { TENANT_VISIBILITY } from '@the-wedding/shared';
import { listTenants, type Tenant } from '@/features/tenants/tenant-api';
import {
  createAlbum,
  deleteAlbum,
  listAlbums,
  reorderAlbums,
  updateAlbum,
  type Album,
  mediaSrc,
} from './media-api';

export function AlbumsDashboard() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [tenantId, setTenantId] = useState('');
  const [albums, setAlbums] = useState<Album[]>([]);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    void listTenants()
      .then((rows) => {
        setTenants(rows);
        setTenantId(rows[0]?.id ?? '');
      })
      .catch((error: unknown) =>
        setMessage(error instanceof Error ? error.message : 'Unable to load sites'),
      )
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!tenantId) return;
    setLoading(true);
    void listAlbums(tenantId)
      .then(setAlbums)
      .catch((error: unknown) =>
        setMessage(error instanceof Error ? error.message : 'Unable to load albums'),
      )
      .finally(() => setLoading(false));
  }, [tenantId]);

  async function handleCreate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!tenantId || !title.trim()) return;
    const album = await createAlbum(tenantId, {
      allowDownload: false,
      title,
      visibility: TENANT_VISIBILITY.PRIVATE,
    });
    setAlbums((current) => [...current, album]);
    setTitle('');
    setMessage('Album created.');
  }

  async function move(albumId: string, direction: -1 | 1) {
    const index = albums.findIndex((album) => album.id === albumId);
    const target = index + direction;
    if (index < 0 || target < 0 || target >= albums.length) return;
    const next = [...albums];
    const currentAlbum = next[index];
    const targetAlbum = next[target];
    if (!currentAlbum || !targetAlbum) return;
    next[index] = targetAlbum;
    next[target] = currentAlbum;
    setAlbums(next);
    setAlbums(
      await reorderAlbums(
        tenantId,
        next.map((album) => album.id),
      ),
    );
  }

  async function patchAlbum(albumId: string, input: Partial<Album>) {
    const album = await updateAlbum(tenantId, albumId, input);
    setAlbums((current) => current.map((item) => (item.id === albumId ? album : item)));
  }

  async function remove(albumId: string) {
    await deleteAlbum(tenantId, albumId);
    setAlbums((current) => current.filter((album) => album.id !== albumId));
    setMessage('Album deleted.');
  }

  return (
    <div className="grid gap-5">
      <section className="rounded-md border border-neutral-200 bg-white p-4 shadow-sm">
        <div className="grid gap-3 md:grid-cols-[1fr_1.4fr] md:items-end">
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
          <form
            className="grid gap-2 sm:grid-cols-[1fr_auto]"
            onSubmit={(event) => void handleCreate(event)}
          >
            <input
              className="h-11 rounded-md border-neutral-300"
              placeholder="Album title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
            <button
              className="h-11 rounded-md bg-ink px-4 text-sm font-semibold text-white"
              disabled={!tenantId}
            >
              New album
            </button>
          </form>
        </div>
        {message ? (
          <p className="mt-3 rounded-md bg-neutral-100 px-3 py-2 text-sm text-neutral-700">
            {message}
          </p>
        ) : null}
      </section>

      {loading ? (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {[0, 1, 2].map((item) => (
            <div key={item} className="h-56 animate-pulse rounded-md bg-neutral-200" />
          ))}
        </div>
      ) : albums.length ? (
        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {albums.map((album, index) => (
            <article
              key={album.id}
              className="overflow-hidden rounded-md border border-neutral-200 bg-white shadow-sm"
            >
              <div className="aspect-[4/3] bg-neutral-100">
                {album.coverUrl ? (
                  <img
                    className="h-full w-full object-cover"
                    src={mediaSrc(album.coverUrl)}
                    alt=""
                  />
                ) : (
                  <div className="grid h-full place-items-center text-sm text-neutral-500">
                    No cover
                  </div>
                )}
              </div>
              <div className="grid gap-3 p-4">
                <input
                  className="h-10 rounded-md border-neutral-300 text-sm font-semibold text-ink"
                  value={album.title}
                  onChange={(event) =>
                    setAlbums((current) =>
                      current.map((item) =>
                        item.id === album.id ? { ...item, title: event.target.value } : item,
                      ),
                    )
                  }
                  onBlur={(event) => void patchAlbum(album.id, { title: event.target.value })}
                />
                <textarea
                  className="min-h-20 rounded-md border-neutral-300 text-sm"
                  placeholder="Description"
                  value={album.description ?? ''}
                  onChange={(event) =>
                    setAlbums((current) =>
                      current.map((item) =>
                        item.id === album.id ? { ...item, description: event.target.value } : item,
                      ),
                    )
                  }
                  onBlur={(event) => void patchAlbum(album.id, { description: event.target.value })}
                />
                <div className="grid gap-2 text-sm text-neutral-700">
                  <label className="flex items-center justify-between gap-3">
                    Visibility
                    <select
                      className="h-9 rounded-md border-neutral-300"
                      value={album.visibility}
                      onChange={(event) =>
                        void patchAlbum(album.id, {
                          visibility: event.target.value as Album['visibility'],
                        })
                      }
                    >
                      <option value="private">Private</option>
                      <option value="public">Public</option>
                    </select>
                  </label>
                  <label className="flex items-center justify-between gap-3">
                    Allow downloads
                    <input
                      className="rounded border-neutral-300"
                      type="checkbox"
                      checked={album.allowDownload}
                      onChange={(event) =>
                        void patchAlbum(album.id, { allowDownload: event.target.checked })
                      }
                    />
                  </label>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    className="rounded-md border border-neutral-300 px-3 py-2 text-sm"
                    onClick={() => void move(album.id, -1)}
                    disabled={index === 0}
                  >
                    Up
                  </button>
                  <button
                    className="rounded-md border border-neutral-300 px-3 py-2 text-sm"
                    onClick={() => void move(album.id, 1)}
                    disabled={index === albums.length - 1}
                  >
                    Down
                  </button>
                  <button
                    className="rounded-md border border-red-200 px-3 py-2 text-sm text-red-700"
                    onClick={() => void remove(album.id)}
                  >
                    Delete
                  </button>
                  <span className="ml-auto rounded-md bg-champagne px-3 py-2 text-sm text-ink">
                    {album.mediaCount} media
                  </span>
                </div>
              </div>
            </article>
          ))}
        </section>
      ) : (
        <section className="rounded-md border border-dashed border-neutral-300 bg-white p-8 text-center">
          <h2 className="font-semibold text-ink">No albums yet</h2>
          <p className="mt-2 text-sm text-neutral-600">
            Create one album, then upload photos and videos from Media.
          </p>
        </section>
      )}
    </div>
  );
}
