export const PERMISSIONS = {
  USER_READ: 'user.read',
  USER_CREATE: 'user.create',
  USER_UPDATE: 'user.update',
  USER_DELETE: 'user.delete',
  TENANT_READ: 'tenant.read',
  TENANT_CREATE: 'tenant.create',
  TENANT_UPDATE: 'tenant.update',
  TENANT_DELETE: 'tenant.delete',
  ALBUM_MANAGE: 'album.manage',
  MEDIA_READ: 'media.read',
  MEDIA_UPLOAD: 'media.upload',
  MEDIA_UPDATE: 'media.update',
  MEDIA_DELETE: 'media.delete',
  MEDIA_DOWNLOAD: 'media.download',
  THEME_MANAGE: 'theme.manage',
  ADMIN_ACCESS: 'admin.access',
  AUDIT_READ: 'audit.read',
  SETTINGS_MANAGE: 'settings.manage',
} as const;

export type PermissionCode = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

export const DEFAULT_PERMISSION_CODES = Object.values(PERMISSIONS);
