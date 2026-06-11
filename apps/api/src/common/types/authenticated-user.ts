import type { PermissionCode, RoleCode } from '@the-wedding/shared';

export type AuthenticatedUser = {
  id: string;
  email: string;
  roles: RoleCode[];
  permissions: PermissionCode[];
  tenantIds: string[];
};
