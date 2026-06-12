import { apiClient } from '@/lib/api-client';

export type Album = {
  id: string;
  tenantId: string;
  title: string;
  description: string | null;
  coverMediaId: string | null;
  coverUrl: string | null;
  visibility: 'public' | 'private' | 'password_protected';
  sortOrder: number;
  allowDownload: boolean;
  mediaCount: number;
};

export type MediaItem = {
  id: string;
  tenantId: string;
  albumId: string;
  type: 'image' | 'video';
  originalFileName: string;
  mimeType: string;
  sizeBytes: number;
  publicUrl: string;
  title: string | null;
  description: string | null;
  sortOrder: number;
};

export type PublicGallery = {
  tenantId: string;
  albums: Array<Album & { media: MediaItem[] }>;
};

export function listAlbums(tenantId: string) {
  return apiClient<Album[]>(`/tenants/${tenantId}/albums`);
}

export function createAlbum(tenantId: string, input: Pick<Album, 'title'> & Partial<Album>) {
  return apiClient<Album>(`/tenants/${tenantId}/albums`, {
    body: JSON.stringify(input),
    method: 'POST',
  });
}

export function updateAlbum(tenantId: string, albumId: string, input: Partial<Album>) {
  return apiClient<Album>(`/tenants/${tenantId}/albums/${albumId}`, {
    body: JSON.stringify(input),
    method: 'PATCH',
  });
}

export function deleteAlbum(tenantId: string, albumId: string) {
  return apiClient<{ deleted: boolean }>(`/tenants/${tenantId}/albums/${albumId}`, {
    method: 'DELETE',
  });
}

export function reorderAlbums(tenantId: string, albumIds: string[]) {
  return apiClient<Album[]>(`/tenants/${tenantId}/albums/reorder`, {
    body: JSON.stringify({ albumIds }),
    method: 'PATCH',
  });
}

export function setAlbumCover(tenantId: string, albumId: string, mediaId: string | null) {
  return apiClient<Album>(`/tenants/${tenantId}/albums/${albumId}/cover`, {
    body: JSON.stringify({ mediaId }),
    method: 'PATCH',
  });
}

export function listMedia(tenantId: string, albumId: string) {
  return apiClient<MediaItem[]>(`/tenants/${tenantId}/albums/${albumId}/media`);
}

export function uploadMedia(tenantId: string, albumId: string, file: File) {
  const form = new FormData();
  form.set('albumId', albumId);
  form.set('file', file);
  return apiClient<MediaItem>(`/tenants/${tenantId}/media/upload`, {
    body: form,
    method: 'POST',
  });
}

export function updateMedia(tenantId: string, mediaId: string, input: Partial<MediaItem>) {
  return apiClient<MediaItem>(`/tenants/${tenantId}/media/${mediaId}`, {
    body: JSON.stringify(input),
    method: 'PATCH',
  });
}

export function moveMedia(tenantId: string, mediaId: string, albumId: string) {
  return apiClient<MediaItem>(`/tenants/${tenantId}/media/${mediaId}/move`, {
    body: JSON.stringify({ albumId }),
    method: 'PATCH',
  });
}

export function reorderMedia(tenantId: string, albumId: string, mediaIds: string[]) {
  return apiClient<MediaItem[]>(`/tenants/${tenantId}/media/reorder/${albumId}`, {
    body: JSON.stringify({ mediaIds }),
    method: 'PATCH',
  });
}

export function deleteMedia(tenantId: string, mediaIds: string[]) {
  return apiClient<{ deleted: number }>(`/tenants/${tenantId}/media`, {
    body: JSON.stringify({ mediaIds }),
    method: 'DELETE',
  });
}

export function mediaSrc(url: string) {
  if (/^https?:\/\//.test(url)) return url;
  return `${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000'}${url}`;
}
