# Role Permission

## Default Roles

- `SUPER_ADMIN`: unrestricted system access.
- `ADMIN`: system management except destructive platform ownership operations.
- `SUPPORT`: support access with limited user/tenant visibility.
- `USER`: tenant owner/member workflows.
- `GUEST`: invited or public visitor access.

## Default Permissions

- `user.read`, `user.create`, `user.update`, `user.delete`
- `tenant.read`, `tenant.create`, `tenant.update`, `tenant.delete`
- `album.manage`
- `media.read`, `media.upload`, `media.update`, `media.delete`, `media.download`
- `theme.manage`
- `admin.access`
- `audit.read`
- `settings.manage`

## Enforcement

Use roles for broad access and permissions for specific capabilities. Tenant ownership/membership must still be checked even when a user has a general `USER` role.
