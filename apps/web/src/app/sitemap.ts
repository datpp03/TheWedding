import type { MetadataRoute } from 'next';
import type { ApiResponse } from '@the-wedding/shared';
import type { PublicHome } from '@/features/public-albums/public-album-api';
import { absoluteAppUrl, getApiBaseUrl } from '@/lib/seo';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [
    {
      url: absoluteAppUrl('/'),
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1,
    },
  ];

  const home = await fetchPublicHomeForSitemap();
  const publicAlbums = new Map(
    [...(home?.featuredToday ?? []), ...(home?.featuredWeek ?? [])]
      .filter((album) => album.visibility === 'public')
      .map((album) => [album.slug || album.id, album]),
  );

  for (const [albumSlugOrId] of publicAlbums) {
    entries.push({
      url: absoluteAppUrl(`/albums/${albumSlugOrId}`),
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    });
  }

  return entries;
}

async function fetchPublicHomeForSitemap() {
  const response = await fetch(`${getApiBaseUrl()}/api/v1/public/home`, {
    cache: 'no-store',
  }).catch(() => null);

  if (!response?.ok) {
    return null;
  }

  const payload = (await response.json()) as ApiResponse<PublicHome>;
  return payload.success ? payload.data : null;
}
