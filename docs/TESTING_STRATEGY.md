# Testing Strategy

## Backend

- Unit test domain rules and application use cases.
- Unit test guards, decorators, and security helpers.
- Integration test repositories with PostgreSQL-compatible test database.
- E2E test auth, tenant access, media upload, and admin permissions.

## Frontend

- Smoke test public gallery, auth forms, dashboard pages, and admin pages.
- Smoke test public home page, daily/weekly featured album sections, and login/register navigation from the public entry.
- Test form validation with Zod schemas.
- Test gallery/lightbox interactions once media UI is implemented.
- Test anonymous wish/reaction clicks redirect to login and return to the exact album after successful auth.
- Responsive QA for 320px, 360px, 390px, 414px, 768px, 1024px, and desktop widths.
- Verify no text overlap, horizontal overflow, broken touch targets, or layout shift in primary user flows.
- Check loading, empty, error, success, hover, focus, disabled, and active states for interactive UI.
- Use browser screenshots for major UI changes, especially public gallery, dashboard, upload, theme preview, and admin screens.
- [NEW] For each UI feature, verify the design signoff note exists: emotional intent, first-look hierarchy, accent color, spacing, component states, and responsive behavior.
- [NEW] Validate card hierarchy for album, media, plan, client, and admin cards: thumbnail/image, title, subtitle, metadata, and primary action.

## SEO/GEO

- Public routes have tests or smoke checks for canonical URLs, title/description, Open Graph metadata, structured data, and sitemap eligibility.
- Private, unlisted/link-only, auth, dashboard, admin, payment/OAuth callback, signed media, and raw storage routes are excluded from sitemap and marked noindex where applicable.
- Sitemap generation must query only public/indexable data after permission/privacy filtering.
- Structured data must match visible, owner-approved content and must not include private EXIF/location, raw storage keys, tokens, audit metadata, or unapproved user-generated content.
- GEO checks confirm public pages have crawlable, answerable content and AI crawler policy is documented in robots.txt before launch.
- Locale checks include metadata and `hreflang`/alternate URLs when locale routing exists.
- Prompt 09 local smoke covered the built web `/`, `/robots.txt`, and `/sitemap.xml`; a future CI smoke should automate canonical/Open Graph/JSON-LD and privacy filtering with public/unlisted/private fixtures.

## Security

- Login brute-force and lockout behavior.
- Unauthorized and cross-tenant access denial.
- Album privacy enforcement for public, unlisted/link-only, and private visibility.
- OAuth `returnTo` validation and open-redirect rejection for Google/Facebook login flows.
- OAuth provider callback tests must cover signed state validation, verified-email-only profiles, safe new-user creation, existing-email no-silent-merge, authenticated account linking, and unlink guard when no alternate login method exists.
- MFA tests must cover TOTP enrollment, invalid OTP, login challenge without full session, challenge completion, disable MFA, and expired/invalid challenge behavior.
- Persistent session tests must cover refresh cookie persistence according to `REFRESH_TOKEN_EXPIRES_IN`, access cookie short TTL, silent refresh on app boot/public home/dashboard visits, logout, revoke current session, revoke all sessions, expired refresh, and refresh-token reuse.
- Authenticated-only wish/reaction mutations and rate-limit behavior.
- Invalid file upload denial.
- Expired token and refresh token reuse.
- Download permission checks.
- Audit log redaction: passwords, tokens, cookies, OTP codes, OAuth authorization codes, and provider secrets must not appear in logs or metadata.
- Realtime/event payload redaction: public streams and webhook payloads must not include private/unlisted album data, signed URLs, raw storage keys, provider secrets, cookies, OTP/MFA values, private EXIF/location, or admin/payment data.
- Inbound webhook tests must cover signature verification, timestamp tolerance, replay protection, duplicate provider-event idempotency, malformed payloads, and safe error responses.
- Outbound webhook tests must cover HMAC signing, bounded retry/backoff, disabled endpoint state, dead-letter behavior, audited replay, and redacted delivery logs.
- Phase 8 automated coverage includes invalid CSRF rejection, refresh token reuse family revocation, upload MIME/extension mismatch denial, tenant quota denial, cross-tenant denial, disabled registration/login/upload/download/public-gallery/payment assertions, fail-safe runtime setting defaults, and audit metadata redaction.

## Phase 8 UI QA Checklist

- For every changed screen, record the design signoff: emotional intent, first-look hierarchy, accent color, section spacing, component hierarchy, interaction states, and responsive behavior.
- Reject white/gray-only surfaces; verify purposeful accent color in actions, active states, links, or highlights.
- Validate album, media, plan, client, and admin cards for image/thumbnail, title, subtitle, useful metadata, and primary action.
- Smoke test Vietnamese, English, and Japanese strings at 320px, 360px, 390px, 414px, 768px, 1024px, and desktop widths.
- Verify loading, empty, error, success, hover, focus, active, disabled, and reduced-motion states where the changed screen has async work or animation.

## Product And Business Rules [NEW]

- Plan gates enforce storage, media count, premium themes, custom domain, privacy/security, B2B, and add-on access.
- Admin-granted entitlements override plans only within documented limits and write audit logs.
- Realtime features must use authorized channels, reconnect/fallback states, and plan/feature gates for live event wall or outbound webhooks.
- Public album realtime must include only public-safe approved data and must not reveal pending moderation, unlisted/private albums, raw tenant internals, or signed media.
- Studio/B2B users cannot access clients or albums outside their studio membership.
- Contextual themes work without location/weather permission and provide opt-out/reduced-motion behavior.
- Automated greetings trigger only within the configured date/time window and use locale keys for visible text.
- Phase 9 foundation automated coverage includes plan/add-on classification, storage boost resolution, premium theme gates requiring feature flags, public handle normalization, contextual theme safe fallback, greeting schedule windows, media upload storage quota enforcement, photo-count quota enforcement, and video-upload feature gate denial.
- Public featured albums include only public albums.
- Advanced album search never returns private albums and never returns unlisted albums without direct-link access.
- Reaction symbol validation uses album/theme-approved keys rather than arbitrary user-submitted markup.
- Phase 7A automated coverage includes OAuth `returnTo` open-redirect rejection, public/unlisted/private album boundaries, duplicate wish denial, invalid reaction symbol denial, and public featured query constraints.
- Prompt 08A automated coverage includes production token hiding for reset/verification flows, MFA challenge/enrollment/disable service behavior, OAuth verified-email/no-silent-merge/link/unlink rules, signed OAuth state validation, cookie TTL from env, and auth i18n key completeness.

## Current Verification Status

Prompt 09 executed the full local automated suite with Node.js and `pnpm.cmd`: format check, lint, typecheck, tests, and build passed. Clean DB migration and browser screenshot QA still require a real PostgreSQL/browser environment.
