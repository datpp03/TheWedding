export const MEDIA_REPOSITORY = Symbol('MEDIA_REPOSITORY');

export interface MediaRepository {
  findByAlbum(tenantId: string, albumId: string): Promise<unknown[]>;
  markProcessingFailed(mediaId: string, reason: string): Promise<void>;
}
