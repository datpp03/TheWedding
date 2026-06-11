# Auth & Security

## Authentication

- Passwords use Argon2id hashing.
- Access tokens are short-lived.
- Refresh tokens are stored only as hashes in `user_sessions`.
- Refresh token rotation is mandatory.
- Refresh token reuse revokes the session family.
- Auth cookies use `HttpOnly`, `Secure`, and `SameSite=Lax` or stricter in production.
- CSRF protection is required for cookie-authenticated mutations.

## Authorization

- RBAC and permission checks are both supported.
- Required decorators: `@CurrentUser()`, `@Public()`, `@Roles()`, `@Permissions()`.
- Required guards: `AuthGuard`, `RolesGuard`, `PermissionsGuard`, `TenantAccessGuard`.

## Tenant Isolation

- Every tenant-scoped query must filter by authorized tenant membership.
- Never trust client-provided `tenantId` until ownership or membership is verified.
- Public routes return only public data and signed/downloadable URLs only when allowed.
- Admin actions are always audited.

## Web and API Security

- Helmet and secure headers.
- Strict CORS whitelist.
- Rate limits for login, password reset, upload, and admin endpoints.
- DTO validation and output sanitization.
- No password, token, or secret logging.
- Correlation/request ID for every request.
- Dependency audit in CI.

## Upload Security

- Validate real MIME type, extension, and size.
- Randomize storage keys.
- Prevent path traversal.
- Keep original media private unless explicitly public.
- Add malware scanning integration when available.
