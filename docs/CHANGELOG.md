# Changelog

All notable changes to this project will be documented in this file.

## Unreleased

### Added

- Phase 7 media processing pipeline with BullMQ/Redis integration, local inline fallback, Sharp image derivatives, media version upserts, retry/failure tracking, and storage usage recalculation.
- Owner media dashboard processing badges for queued, processing, ready, failed, and retry states with polling for active jobs.
- Public gallery optimized-derivative display with processing placeholders so original media remains private by default.
- Media processing i18n/l10n keys for Vietnamese, English, and Japanese.
- [NEW] Living product plan covering SaaS business model, B2C packages, B2B studio subscriptions, value-added services, workflows, UI/UX execution gates, theme automation, automated greetings, and future execution playbook.
- [NEW] Product/UI execution requirements in roadmap, UI/UX docs, testing strategy, API/database planning, and remaining implementation prompts.
- [NEW] Public album and social expansion plan covering public home, featured albums by day/week, album privacy levels, wishes, reactions, Google/Facebook OAuth, return-to-album login, advanced album search, and audit redaction.
- [NEW] Prompt `07a_public_album_social_expansion.md` for the next scoped product-facing expansion before hardening.
- Phase 6 admin dashboard MVP with stats, users, tenants, media moderation, audit log explorer, settings, feature flags, and system parameters screens.
- Admin API endpoints protected by `admin.access` plus audit logging for admin mutations.
- Runtime system parameters for disabling registration, login, uploads, downloads, public gallery, future payment checkout, and maintenance messages.
- Backend enforcement for disabled registration/login/upload/download/public-gallery flows.
- Admin i18n keys for Vietnamese, English, and Japanese.
- Permission guard tests, disabled-flow tests, and admin i18n smoke coverage.
- Phase 8 backend hardening with MFA-ready user fields, request correlation IDs, global and route-level throttling, audit metadata redaction, tenant upload quota checks, and backup/restore documentation.
- Security tests for invalid CSRF, audit redaction, MIME/extension mismatch, tenant quota denial, runtime parameter fail-safe defaults/cache invalidation, payment-disabled assertion, cross-tenant denial, and refresh token reuse.
- Phase 7A public album expansion with public home, featured public albums, direct-link unlisted album detail, authenticated wishes/reactions, reaction symbol validation, OAuth-safe returnTo routing, authenticated album search, and social/audit tests.
- Remaining-work prompt set for auth/email/MFA/OAuth, public discovery/moderation/audit, i18n/accessibility UI QA, media security/delivery, and admin operations/monitoring.
- Phase 9 scale foundation with shared B2C/B2B plan catalog, add-on catalog, feature flag mapping, entitlement gate logic, user public handles, tenant quota summaries, analytics events, greeting rule placeholder, idempotent MoMo payment-event storage, and admin Scale UI.
- Database migration for `user_public_handles`, `plan_subscriptions`, `entitlements`, `payment_events`, `custom_domains`, `studio_profiles`, `studio_clients`, `analytics_events`, and `greeting_rules`.
- Locale keys for the new admin Scale surface in Vietnamese, English, and Japanese.
- SEO/GEO guideline document covering canonical URLs, robots/noindex, sitemap, structured data, AI crawler policy, public route privacy, media metadata, and verification.
- Prompt handoff rules now require each `VIEC_CAN_LAM.md` item to include detailed execution instructions, prerequisites, exact places to configure/check, verification steps, and related docs.
- SMTP auth email delivery using configured host/user/password/from settings for password reset and email verification links.
- S3-compatible Cloudflare R2 storage adapter for API-managed media uploads, reads, deletes, and public derivative URL generation when a public base URL is configured.
- Cloudflare R2 setup guide for bucket creation, access keys, Render env configuration, smoke tests, and rollback.

### Changed

- Uploads now return queued media instead of marking originals ready immediately; normal display prefers optimized images when processing completes.
- Media storage accounting now includes generated derivatives in preparation for Phase 9 plan/storage enforcement.
- [NEW] Expanded future scale prompts to include B2C SaaS plans, B2B studio workflows, add-ons, admin theme control, dynamic contextual themes, automated greetings, and UI design-gate verification.
- [NEW] Updated prompt order so public album/social/OAuth/search/audit work is separated from the broader Phase 9 scale prompt.
- Reordered the remaining prompt workflow around the active Vercel + Render + Neon deployment path.
- Expanded the recommended prompt order so unfinished cross-phase work can be completed before broad Phase 9 scale features.
- Marked Docker VPS CI/CD as an optional later deployment track instead of the next required phase.
- Cloudflare R2 activation is now available for API-managed uploads after bucket/access key setup and smoke tests; direct upload sessions, multipart uploads, migration tooling, and CDN hardening remain deferred.
- Clarified that production can switch from `STORAGE_PROVIDER=local` to `r2` once the R2 guide is completed and verified.
- Added `TENANT_STORAGE_QUOTA_BYTES` as the default per-tenant upload ceiling before Phase 9 plan/entitlement quota expansion.
- The web root now renders public album discovery instead of redirecting users to the dashboard/login flow.
- R2 and MoMo env placeholders are documented and validated as optional values, while production remains on local storage and no public payment webhook is exposed yet.
- Product plan, roadmap, testing strategy, UI/UX rules, agent rules, and prompt workflow now require SEO/GEO checks for public-facing route/content/metadata work.
- `VIEC_CAN_LAM.md` now includes a concrete item template so future handoff notes are actionable mini-runbooks instead of short task labels.
- Mail environment docs and host guide now use `SMTP_PASSWORD`, `SMTP_SECURE`, and `SMTP_FROM` consistently for Brevo-compatible SMTP setup.
- Creating a wedding site from the dashboard now refreshes the auth session so newly granted tenant access is available before creating albums or uploading media.
- Media image uploads now honor configured `MAX_UPLOAD_BYTES` instead of a hard-coded 15 MB ceiling, and media processing falls back to inline mode if the Redis queue is unavailable.
- Media uploads now reject empty multipart files with a clear `400 File is empty`, map storage write failures to `503 Media storage is unavailable`, and accept the upload even if async media processing enqueue fails so processing can be retried.
- Media file/download endpoints now read through the `StorageService` boundary, allowing local filesystem and R2-backed objects to share the same permission-checked API routes.
- Media quota queries now quote PostgreSQL camelCase columns correctly, fixing production upload failures caused by `media.sizebytes does not exist`.
- Media image processing now skips overlong inline blur placeholders instead of writing values longer than the `media.blurHash` column limit, fixing production failures after R2 derivatives are generated.
- Media file/download responses now explicitly allow cross-origin resource embedding so the web app can display permission-checked API images from the separate API domain.
- Public home featured albums now use the same public tenant visibility/status filter as album detail pages, preventing visible cards from opening to `Album not found`.
- Public album detail now falls back to permission-checked public media file URLs when processed media lacks stored optimized URLs, and the album page layout has a softer hero/gallery presentation.
- Removed unnecessary typed-route assertions that caused GitHub Actions web lint to fail on Linux CI; login now uses a browser redirect after successful sign-in to avoid typed-route cast drift.
- Added pnpm security overrides for `multer`, `postcss`, and `js-yaml` so GitHub Actions audit no longer reports known moderate/high vulnerabilities.

## 0.1.0 - 2026-06-12

### Added

- Phase 0 documentation foundation.
- Phase 1 monorepo scaffold.
- API and web app skeletons.
- Shared package skeletons.
- SQL Server initial schema migration draft.
- Docker Compose for SQL Server and Redis.
- GitHub Flow templates and CI workflow.

### Changed

- Added local SQL Server configuration for database `TheWedding`.
- Added TypeORM support for SQL auth and optional Windows Auth config.
- Updated migration scripts to run reliably on Windows through Node.
- Added flat ESLint configs for workspace packages.
- Updated package exports and TypeScript config so lint, typecheck, and build pass.

### Verified

- Installed dependencies with pnpm.
- Ran initial migration and seed against local SQL Server.
- Verified API and Web with HTTP smoke tests.
- Added Phase 2 auth unit coverage for register, login failure, refresh rotation, and refresh token reuse detection.

### Added

- Database-backed auth and user foundation.
- JWT access tokens in HttpOnly cookies.
- Refresh token rotation with hashed refresh secrets in `user_sessions`.
- Session listing and revocation endpoints.
- Frontend login/register forms connected to the API.
- Dashboard auth status and sign out action.
- UI/UX design direction for youthful Gen Z-friendly visuals, smooth interactions, and responsive layouts across phone, tablet, and desktop sizes.
- Forgot password, reset password, email verification, CSRF token exchange, auth audit log writes, and dashboard/admin route protection.
- Auth unit coverage for one-time reset and verification token reuse rejection.
- Phase 3 tenant/site foundation with tenant CRUD, owner membership creation, slug availability checks, settings, visibility, SEO/share metadata, audit logs, dashboard onboarding, tenant settings UI, public slug rendering, and private/password access gates.
- Planning notes for app-managed media storage and prompt lifecycle cleanup rules.
- Long-term storage strategy covering local dev storage, S3-compatible production storage, CDN, signed URLs, processing, and future React Native upload sessions.
- Phase 4 album/media MVP with tenant-scoped album CRUD, reorder, cover selection, visibility and download controls, local storage adapter, validated single/bulk uploads, media list/update/reorder/move/batch delete, authenticated/public file endpoints, public gallery, and lightbox.
- Backend media tests for invalid upload rejection, cross-tenant denial, and download permission checks.
- Phase 5 theme customization MVP with shared presets, tenant theme create/update/preview/activate/clone/reset, active public-site theme rendering, theme audit logs, responsive theme dashboard, live preview, and backend theme tests.
- i18n/l10n foundation for the new theme UI with stable `vi`, `en`, and `ja` locale keys and fallback behavior.
- Planning updates for Cloudflare R2 production storage, backend image resize/compression before optimized display, admin-managed system parameters, subscription/payment foundation with MoMo first, admin entitlement unlocks, storage quota upgrades, and user-handle-based public album URLs.
- Early-priority CI/CD Docker VPS foundation with GitHub Actions deploy workflow, production Docker Compose template, VPS env example, Docker Hub/GHCR support, secrets guidance, verification, and rollback.
- Vietnamese migration guide for reconfiguring host/VPS, SQL Server database, local media storage, Cloudflare R2 storage, CI/CD secrets, smoke tests, DNS, and rollback.
