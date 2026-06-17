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
- `album.featured.manage`
- `album.wish.moderate`
- `album.reaction.moderate`
- `media.read`, `media.upload`, `media.update`, `media.delete`, `media.download`
- `theme.manage`
- `admin.access`
- `audit.read`
- `settings.manage`
- `feature_flags.manage`
- `system_parameters.manage`
- `plan.manage`, `subscription.manage`, `payment.read`
- `entitlement.manage`

## Enforcement

Use roles for broad access and permissions for specific capabilities. Tenant ownership/membership must still be checked even when a user has a general `USER` role.

System parameter, feature flag, plan, payment, and entitlement changes are sensitive admin operations. They must require explicit permissions, write audit logs, and never bypass tenant ownership checks for user-facing resources.

## Phase 6 Admin Enforcement

- All `/api/v1/admin/*` endpoints require authentication and the `admin.access` permission through the global permission guard.
- `SUPER_ADMIN` and seeded admin roles must include `admin.access` before the admin dashboard can load.
- Non-admin users receive permission denial before any admin data is returned.
- Admin mutations for user status/roles, tenant status, media moderation, system settings, feature flags, and system parameters write audit log entries with actor, entity, IP, user agent, and metadata where available.
- Runtime system parameters enforce disabled registration/login/upload/download/public-gallery states in the backend, not only in the UI.

## Public Album Interaction Enforcement [NEW]

- Sending album wishes and reactions requires authentication, but does not require an admin permission for normal users.
- Moderating wishes/reactions, featuring albums, or overriding public discovery metadata requires explicit admin/support permission and audit logging.
- Public discovery must enforce album privacy before permission shortcuts: `public` can be listed, `unlisted` requires a direct link, and `private` requires owner or authorized admin/support access.
- Phase 7A exposes owner/member reaction-symbol management through tenant-scoped album access. Dedicated admin moderation/curation UI remains planned; current moderation events are written as audit entries where interaction mutations occur.
