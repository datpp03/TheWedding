export const ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ADMIN: 'ADMIN',
  SUPPORT: 'SUPPORT',
  USER: 'USER',
  GUEST: 'GUEST',
} as const;

export type RoleCode = (typeof ROLES)[keyof typeof ROLES];

export const DEFAULT_ROLE_CODES = Object.values(ROLES);
