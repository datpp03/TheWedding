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
- Auth cookies are set with `Path=/` so the frontend can perform route protection and API requests consistently.
- CSRF protection is implemented for non-public mutations with a double-submit token from `GET /api/v1/auth/csrf`.
- Public auth mutations such as login, register, forgot password, reset password, verify email, refresh, and logout are explicitly public. The frontend still sends CSRF headers for mutations where available.
- Password reset and email verification tokens use `tokenId.secret`; only the secret hash is stored in SQL Server.
- Development/local responses can expose reset or verification tokens because SMTP delivery is not wired yet. Production must not expose these tokens in responses.

## Implemented Auth Endpoints

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/logout`
- `POST /api/v1/auth/refresh`
- `GET /api/v1/auth/csrf`
- `POST /api/v1/auth/forgot-password`
- `POST /api/v1/auth/reset-password`
- `POST /api/v1/auth/verify-email`
- `GET /api/v1/auth/me`
- `GET /api/v1/auth/sessions`
- `DELETE /api/v1/auth/sessions/:sessionId`
- `DELETE /api/v1/auth/sessions`

## Auth Audit Events

- `auth.register`
- `auth.login`
- `auth.refresh`
- `auth.logout`
- `auth.password_reset_requested`
- `auth.password_reset_completed`
- `auth.email_verified`
- `auth.session_revoked`
- `auth.sessions_revoked`

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
