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
- Access and refresh cookie lifetimes now follow `ACCESS_TOKEN_EXPIRES_IN` and `REFRESH_TOKEN_EXPIRES_IN`. The access token remains short-lived; the refresh cookie is persistent until its configured TTL or explicit revoke/logout.
- CSRF protection is implemented for non-public mutations with a double-submit token from `GET /api/v1/auth/csrf`.
- Public auth mutations such as login, register, forgot password, reset password, verify email, refresh, and logout are explicitly public. The frontend still sends CSRF headers for mutations where available.
- Password reset and email verification tokens use `tokenId.secret`; only the secret hash is stored in PostgreSQL.
- Development/local responses can expose reset or verification tokens for QA speed. Production never returns reset or verification tokens in API payloads.
- Password reset, email verification, and resend verification send SMTP email when `MAIL_PROVIDER=smtp` and SMTP host/from are configured. Provider errors are logged without raw tokens.
- TOTP MFA is implemented using the existing `users.mfaEnabledAt`, `users.mfaMethod`, and `users.mfaSecretEncrypted` fields. MFA secrets are AES-GCM encrypted using server secret material, are not logged, and are only shown to the user during enrollment.
- Login and OAuth for users with MFA enabled create a short-lived MFA challenge and do not issue full session cookies until a valid OTP is submitted.

## OAuth Login [NEW]

- Google and Facebook login reuse the existing session, cookie, CSRF, and audit model instead of creating a parallel auth path.
- OAuth account linking requires verified provider email. Existing password accounts are not silently merged; users must sign in first and link the provider from account settings.
- OAuth callback handling preserves a `returnTo` path for album wish/reaction flows only when it is a relative same-origin path or an explicitly allowlisted app URL.
- Reject external or malformed `returnTo` values to prevent open redirect vulnerabilities.
- Do not expose provider access tokens, refresh tokens, authorization codes, or provider secrets in frontend URLs, API responses, logs, or audit metadata.
- OAuth state is HMAC-signed, includes a nonce and short expiry, and preserves only a validated safe `returnTo`. Provider callback exchange, userinfo fetch, verified-email login, safe new-user creation, explicit link, and unlink guard are implemented.

## Implemented Auth Endpoints

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/logout`
- `POST /api/v1/auth/refresh`
- `GET /api/v1/auth/csrf`
- `POST /api/v1/auth/forgot-password`
- `POST /api/v1/auth/reset-password`
- `POST /api/v1/auth/verify-email`
- `POST /api/v1/auth/resend-verification`
- `POST /api/v1/auth/mfa/enrollment/start`
- `POST /api/v1/auth/mfa/enrollment/verify`
- `POST /api/v1/auth/mfa/challenge`
- `DELETE /api/v1/auth/mfa`
- `GET /api/v1/auth/oauth/linked/accounts`
- `DELETE /api/v1/auth/oauth/linked/:provider`
- `GET /api/v1/auth/me`
- `GET /api/v1/auth/sessions`
- `DELETE /api/v1/auth/sessions/:sessionId`
- `DELETE /api/v1/auth/sessions`

## Auth Audit Events

- `auth.register`
- `auth.login`
- `auth.email_verification_requested`
- `auth.oauth_login_started`
- `auth.oauth_login_completed`
- `auth.oauth_login_failed`
- `auth.oauth_link_started`
- `auth.oauth_link_completed`
- `auth.oauth_link_failed`
- `auth.oauth_unlinked`
- `auth.mfa_enrollment_started`
- `auth.mfa_enrollment_failed`
- `auth.mfa_enabled`
- `auth.mfa_challenge_created`
- `auth.mfa_challenge_failed`
- `auth.mfa_challenge_completed`
- `auth.mfa_disable_failed`
- `auth.mfa_disabled`
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

## Realtime And Webhook Security [NEW]

- Browser realtime subscriptions must be authorized server-side for every requested channel; never trust a channel name sent by the client.
- Public realtime channels may only send public-safe approved fields and must not expose private/unlisted albums, pending moderation content, payment/admin data, raw storage keys, signed URLs, provider payloads, emails, cookies, tokens, OTP/MFA values, or private EXIF/location.
- Inbound provider webhooks must verify signature, timestamp tolerance, replay protection, and idempotency before changing application state.
- Outbound webhooks must sign payloads with per-endpoint secrets, use bounded retry/dead-letter behavior, and never echo endpoint secrets after creation.
- Event payloads stored in an outbox or delivery log must be redacted before persistence, following the audit metadata redaction policy.
