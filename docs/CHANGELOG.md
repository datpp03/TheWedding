# Changelog

All notable changes to this project will be documented in this file.

## Unreleased

### Added

- Internal Taste Skill frontend integration guide in `docs/ai/taste-skill-integration.md` plus Cursor rule `.cursor/rules/taste-skill-frontend.mdc` for contextual UI/design work without changing runtime business logic.
- `y-tuong-nang-cap/` idea backlog with one file per upgrade idea, grouped by guest interaction, media experience, product/revenue, and operations/quality, plus a reusable idea template.
- `viec-can-lam/` task backlog with per-item runbooks split by urgency (`00_khan_cap`, `01_uu_tien`, `02_co_the_doi`, `03_quyet_dinh_san_pham`, `99_da_xu_ly`) plus a reusable task template.
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
- Prompt handoff rules now require each task file in `viec-can-lam/` to include detailed execution instructions, prerequisites, exact places to configure/check, verification steps, and related docs.
- SMTP auth email delivery using configured host/user/password/from settings for password reset and email verification links.
- S3-compatible Cloudflare R2 storage adapter for API-managed media uploads, reads, deletes, and public derivative URL generation when a public base URL is configured.
- Cloudflare R2 setup guide for bucket creation, access keys, Render env configuration, smoke tests, and rollback.
- Persistent browser session restoration task in the auth roadmap and 08A prompt, covering browser close/reopen, hard refresh, homepage auth-state restoration, and logout/revoke regression requirements.
- Phase 9 media upload usage gates now enforce active tenant/user plan limits plus admin entitlements for storage quota, photo/video counts, max file size, and video-upload access before storage writes.
- Dashboard sidebar language switcher for Vietnamese, English, and Japanese with persisted local preference.
- Windows local control panel for starting/stopping API and Web dev servers, viewing logs/errors, opening local URLs, and running verification commands from one terminal menu.
- Public album slugs with a title-derived readable prefix plus stable short id suffix, including database backfill for existing albums.
- Prompt `08f_public_site_visual_redesign_ui_qa.md` with a detailed plan to redesign the public wedding site UI, responsive states, accessibility, and SEO/GEO privacy checks.
- Realtime/webhook plan and prompt covering event outbox, SSE browser updates, signed inbound provider webhooks, signed outbound webhooks, retry/dead-letter behavior, and privacy-safe event payloads.
- Prompt 08A auth completion: TOTP MFA enrollment/challenge/disable, Google/Facebook OAuth callback exchange/link/unlink, verified-email-only OAuth user creation, no-silent-merge guard for existing accounts, and account security UI in dashboard settings.
- Auth tests for production token hiding, MFA flows, OAuth verified-email/linking rules, signed OAuth state, env-driven auth cookie TTL, and auth i18n key coverage.
- Prompt 09 release SEO hardening: Next.js `robots.txt` and `sitemap.xml` metadata routes, shared canonical URL helper, public home/site/album canonical/Open Graph metadata, and public album JSON-LD for indexable albums.
- Public home, public album card, and public album social-panel copy now has Vietnamese, English, and Japanese i18n keys.

### Changed

- Final release scope now explicitly accepts Phase 9 as a safe foundation release with unfinished scale capabilities kept behind placeholders, gates, admin-only controls, or follow-up prompts; Cloudflare R2 remains documented as integrated for API-managed uploads but still requires production credential setup and smoke tests before relying on it.
- Frontend prompt and documentation workflow now requires Taste Skill rule review before UI, layout, component, form, dashboard, public page, redesign, accessibility, or responsive QA work.
- Prompt handoff now uses `viec-can-lam/README.md` and `y-tuong-nang-cap/README.md` as folder indexes; root-level handoff files were removed after their contents moved into structured folders.
- `viec-can-lam/README.md` is now a concise index linking to task files in `viec-can-lam/`; AGENTS and prompt handoff rules now require future prompts to create/update task files instead of adding long runbooks to the root file.
- Uploads now return queued media instead of marking originals ready immediately; normal display prefers optimized images when processing completes.
- Media storage accounting now includes generated derivatives in preparation for Phase 9 plan/storage enforcement.
- [NEW] Expanded future scale prompts to include B2C SaaS plans, B2B studio workflows, add-ons, admin theme control, dynamic contextual themes, automated greetings, and UI design-gate verification.
- [NEW] Updated prompt order so public album/social/OAuth/search/audit work is separated from the broader Phase 9 scale prompt.
- Reordered the remaining prompt workflow around the active Vercel + Render + Neon deployment path.
- Expanded the recommended prompt order so unfinished cross-phase work can be completed before broad Phase 9 scale features.
- Marked Docker VPS CI/CD as an optional later deployment track instead of the next required phase.
- Cloudflare R2 activation is now available for API-managed uploads after bucket/access key setup and smoke tests; direct upload sessions, multipart uploads, migration tooling, and CDN hardening remain deferred.
- Clarified that production can switch from `STORAGE_PROVIDER=local` to `r2` once the R2 guide is completed and verified.
- Replaced the Phase 8 static tenant upload quota path with Phase 9 plan/entitlement-aware upload policy for API-managed media uploads.
- The web root now renders public album discovery instead of redirecting users to the dashboard/login flow.
- R2 and MoMo env placeholders are documented and validated as optional values, while production remains on local storage and no public payment webhook is exposed yet.
- Product plan, roadmap, testing strategy, UI/UX rules, agent rules, and prompt workflow now require SEO/GEO checks for public-facing route/content/metadata work.
- `viec-can-lam/_TEMPLATE.md` now provides a concrete task template so future handoff notes are actionable mini-runbooks instead of short task labels.
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
- `/dashboard/themes` now follows the selected dashboard locale instead of a hard-coded Vietnamese locale, and its editor form stays single-column until wider screens to avoid cramped controls beside the sidebar.
- Starting Web from the local control panel now opens `http://localhost:3000` automatically.
- Starting Web from the local control panel now clears stale `apps/web/.next` first, and the menu includes a manual Web cache clear action for corrupted Next dev chunks.
- Local control panel now includes an API migration action, and album slug backfill now normalizes Vietnamese titles into readable ASCII slugs.
- Public album cards now link to slug URLs, while legacy UUID album URLs continue to resolve and redirect to the slug when available.
- Prompt workflow now includes a dedicated public wedding site visual redesign pass before broad Phase 9 scale features.
- Prompt workflow now includes a dedicated realtime webhook/event platform pass before broad Phase 9 scale features.
- Refresh-token cookies now use `REFRESH_TOKEN_EXPIRES_IN`, access-token cookies use `ACCESS_TOKEN_EXPIRES_IN`, and the web client silently refreshes auth state on app/public-home/dashboard boot when the refresh cookie is still valid.
- Auth, dashboard, and admin route groups now declare noindex robots metadata; public home can show signed-in navigation without exposing private tenant/admin data or redirecting away from discovery.
- SMTP auth email delivery supports `SMTP_REPLY_TO` and unauthenticated local SMTP relays, while production reset/verification tokens remain hidden from API payloads.
- README first-run instructions now include migration/seed/test steps and the Windows `pnpm.cmd` workaround.
- Deployment/env docs now include `NEXT_PUBLIC_APP_URL` for production canonical, robots, sitemap, and Open Graph URL generation.

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
