export const ALBUM_REPOSITORY = Symbol('ALBUM_REPOSITORY');

export interface AlbumRepository {
  findByTenant(tenantId: string): Promise<unknown[]>;
  reorder(tenantId: string, orderedAlbumIds: string[]): Promise<void>;
}
