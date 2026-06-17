import { apiClient } from '@/lib/api-client';
import type { MediaItem } from '@/features/media/media-api';

export type PublicAlbumCard = {
  id: string;
  tenantId: string;
  tenantSlug: string;
  title: string;
  description: string | null;
  coverUrl: string | null;
  mediaCount: number;
  reactionCount: number;
  source: string;
  visibility: 'public' | 'unlisted' | 'private';
  wishCount: number;
};

export type Wish = {
  id: string;
  albumId: string;
  displayName: string;
  message: string;
  createdAt: string;
};

export type ReactionSummary = {
  glyph: string;
  symbolKey: string;
  count: number;
};

export type PublicAlbumDetail = PublicAlbumCard & {
  allowDownload: boolean;
  media: Array<
    Pick<
      MediaItem,
      | 'albumId'
      | 'id'
      | 'originalFileName'
      | 'processingStatus'
      | 'publicUrl'
      | 'tenantId'
      | 'thumbnailUrl'
      | 'title'
      | 'type'
    >
  >;
  reactions: ReactionSummary[];
  symbols: Array<Pick<ReactionSummary, 'glyph' | 'symbolKey'>>;
  wishes: Wish[];
};

export type PublicHome = {
  featuredToday: PublicAlbumCard[];
  featuredWeek: PublicAlbumCard[];
  source: string;
};

export function createWish(albumId: string, message: string) {
  return apiClient<Wish>(`/albums/${albumId}/wishes`, {
    body: JSON.stringify({ message }),
    method: 'POST',
  });
}

export function createReaction(albumId: string, symbolKey: string) {
  return apiClient<ReactionSummary[]>(`/albums/${albumId}/reactions`, {
    body: JSON.stringify({ symbolKey }),
    method: 'POST',
  });
}
