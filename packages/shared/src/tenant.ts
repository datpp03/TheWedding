export const TENANT_VISIBILITY = {
  PUBLIC: 'public',
  PRIVATE: 'private',
  PASSWORD_PROTECTED: 'password_protected',
} as const;

export type TenantVisibility = (typeof TENANT_VISIBILITY)[keyof typeof TENANT_VISIBILITY];

export const ALBUM_VISIBILITY = {
  PUBLIC: 'public',
  UNLISTED: 'unlisted',
  PRIVATE: 'private',
} as const;

export type AlbumVisibility = (typeof ALBUM_VISIBILITY)[keyof typeof ALBUM_VISIBILITY];

export const TENANT_STATUS = {
  ACTIVE: 'active',
  DISABLED: 'disabled',
  ARCHIVED: 'archived',
} as const;

export type TenantStatus = (typeof TENANT_STATUS)[keyof typeof TENANT_STATUS];
