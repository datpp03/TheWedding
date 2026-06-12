# Auth & Security

## Authentication

- Passwords use Argon2id hashing.
- Access tokens are short-lived JWTs.
- Access tokens are sent in the `access_token` HttpOnly cookie, and Bearer token fallback is supported for API clients.
- Refresh tokens are sent in the `refresh_token` HttpOnly cookie.
- Refresh tokens use the format `sessionId.secret`; only the secret hash is stored in `user_sessions`.
- Refresh token rotation is implemented.
- Refresh token reuse revokes the session family.
- Auth cookies use `HttpOnly`, environment-aware `Secure`, and `SameSite=Lax`.
- CSRF protection is required for cookie-authenticated mutations.

## Implemented Auth Endpoints

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/logout`
- `POST /api/v1/auth/refresh`
- `GET /api/v1/auth/me`
- `GET /api/v1/auth/sessions`
- `DELETE /api/v1/auth/sessions/:sessionId`
- `DELETE /api/v1/auth/sessions`

## Authorization

- RBAC and permission checks are both supported.
- Required decorators: `@CurrentUser()`, `@Public()`, `@Roles()`, `@Permissions()`.
- Required guards: `AccessTokenGuard`, `RolesGuard`, `PermissionsGuard`, `TenantAccessGuard`.
- Phase 2 access tokens include role codes, permission codes, and tenant IDs.

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
