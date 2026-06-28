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
- Password reset and email verification tokens use `tokenId.secret`; only the secret hash is stored in PostgreSQL.
- Development/local responses can expose reset or verification tokens because SMTP delivery is not wired yet. Production must not expose these tokens in responses.
- Phase 8 adds MFA-ready user fields (`mfaEnabledAt`, `mfaMethod`, `mfaSecretEncrypted`) so TOTP enrollment can be implemented without another identity-table redesign. No MFA challenge is enabled until the OTP enrollment/verification flow ships.

## OAuth Login [NEW]

- Google and Facebook login should reuse the existing session, cookie, CSRF, and audit model instead of creating a parallel auth path.
- OAuth account linking must require verified provider identity rules and should avoid silently merging accounts unless the email is verified and the flow is explicitly safe.
- OAuth callback handling preserves a `returnTo` path for album wish/reaction flows only when it is a relative same-origin path or an explicitly allowlisted app URL.
- Reject external or malformed `returnTo` values to prevent open redirect vulnerabilities.
- Do not expose provider access tokens, refresh tokens, authorization codes, or provider secrets in frontend URLs, API responses, logs, or audit metadata.
- Phase 7A implements safe OAuth start/callback routing and state validation. Provider callback exchange/account linking remains disabled until verified-email linking rules are confirmed.

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
- `auth.oauth_login_started` [planned]
- `auth.oauth_login_completed` [planned]
- `auth.oauth_login_failed` [planned]
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

## Album Privacy And Interaction Security [NEW]

- Album visibility must be explicit: `public`, `unlisted`, or `private`.
- Public home, featured, search, and timeline queries may return only public albums.
- Unlisted albums must require a direct link and must not be returned by public discovery queries.
- Private albums require owner membership or an authorized admin/support context.
- Wish and reaction mutations require an authenticated user.
- If an anonymous user starts a wish/reaction action, the frontend should send them to login with a validated `returnTo` path and restore the album context after successful login.
- Wishes and reactions have route-level rate limits and clear duplicate rules: one active wish per user per album, and one active reaction per user per symbol per album.
- Reaction symbols must be validated keys from the album/theme configuration or the safe default set, not arbitrary user-submitted markup.

## Web and API Security

- Helmet and secure headers.
- Strict CORS whitelist.
- Rate limits for login, password reset, upload, and admin endpoints.
- Global throttling is enabled for API traffic, with tighter route-level limits on auth, upload, bulk upload, and admin endpoints.
- DTO validation and output sanitization.
- No password, token, or secret logging.
- No OAuth authorization code, provider token, cookie, OTP, raw reset token, or sensitive request header logging.
- Audit metadata is redacted before persistence for password, token, cookie, OTP/MFA, OAuth authorization code, provider secret, and raw sensitive header fields.
- Correlation/request ID is attached to every request through `x-correlation-id` and returned in successful response metadata and error response metadata.
- Dependency audit in CI.

## Upload Security

- Validate real MIME type, extension, and size.
- Enforce per-media-type upload size limits: 15 MB for images and 150 MB for videos in the current API upload flow.
- Reject suspicious MIME/extension mismatches before writing to storage.
- Enforce `TENANT_STORAGE_QUOTA_BYTES` before API-managed uploads write bytes to storage.
- Randomize storage keys.
- Prevent path traversal.
- Keep original media private unless explicitly public.
- Signed URL TTL remains planned for Phase 9 signed URL endpoints. The S3-compatible/R2 adapter is available for API-managed uploads, while protected media still uses permission-checked API endpoints by default. Target default TTL is 900 seconds for future signed media URLs.
- Add malware scanning integration when available.
