import type { PermissionCode, RoleCode } from '@the-wedding/shared';

export type AuthenticatedUser = {
  id: string;
  email: string;
  sessionId?: string;
  roles: RoleCode[];
  permissions: PermissionCode[];
  tenantIds: string[];
};
