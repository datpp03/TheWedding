# Development Log

## 2026-06-29 - Public Album Media URL Fallback And Layout Polish

### Completed

- Investigated public album payload for `5f9f9361-5b41-4f64-bfb0-e71de8ce065c`; media was `processingStatus=ready` but both `publicUrl` and `thumbnailUrl` were `null`, causing the web page to render the `ready` placeholder instead of an image.
- Added a public album media URL fallback that uses `/api/v1/public/tenants/{tenantId}/media/{mediaId}/file` for ready image media when optimized URLs are missing.
- Added service test coverage for ready public images without stored public URLs.
- Refreshed the public album page with a softer hero, closer gallery section, larger image treatment, subtle hover states, and a less rigid layout.

### Tests and Checks

- `pnpm.cmd --filter @the-wedding/api test -- public-albums.service.spec.ts`: pass.
- `pnpm.cmd --filter @the-wedding/api typecheck`: pass.
- `pnpm.cmd --filter @the-wedding/web typecheck`: pass.
- `pnpm.cmd --filter @the-wedding/api lint`: pass.
- `pnpm.cmd --filter @the-wedding/web lint`: pass.
- `pnpm.cmd format:check`: pass.
- `git diff --check`: pass.

## 2026-06-29 - Public Album Featured Detail Filter Alignment

### Completed

- Investigated production 404 where public home showed album `5f9f9361-5b41-4f64-bfb0-e71de8ce065c`, but opening `/albums/5f9f9361-5b41-4f64-bfb0-e71de8ce065c` returned `Album not found`.
- Confirmed the API mismatch: public home filtered only album visibility, while album detail also required the owning tenant/site to be public and active.
- Updated featured album queries to require album public visibility, tenant public visibility, tenant active status, and non-deleted album/tenant records.
- Added service test coverage to ensure featured albums use the same tenant visibility/status policy as detail pages.

### Tests and Checks

- `pnpm.cmd --filter @the-wedding/api test -- public-albums.service.spec.ts`: pass.
- `pnpm.cmd --filter @the-wedding/api test`: pass.
- `pnpm.cmd --filter @the-wedding/api typecheck`: pass.
- `pnpm.cmd --filter @the-wedding/api lint`: pass.
- `pnpm.cmd format:check`: pass.
- `git diff --check`: pass.

## 2026-06-29 - Media Cross-Origin Display Header

### Completed

- Investigated dashboard image display failure where the media file endpoint returned `200 OK` but Chrome blocked the image with `net::ERR_BLOCKED_BY_RESPONSE.NotSameOrigin`.
- Identified Helmet's default `Cross-Origin-Resource-Policy: same-origin` as incompatible with the production split between `thewedding.d-ajt.app` and `thewedding-api.d-ajt.app`.
- Added explicit `Cross-Origin-Resource-Policy: cross-origin` headers to permission-checked media file/download responses while keeping auth, album visibility, and download permission checks unchanged.
- Documented the public album URL format for direct album viewing.

### Tests and Checks

- `pnpm.cmd --filter @the-wedding/api typecheck`: pass.
- `pnpm.cmd --filter @the-wedding/api lint`: pass.
- `pnpm.cmd --filter @the-wedding/api test`: pass.
- `pnpm.cmd format:check`: pass.
- `git diff --check`: pass.

## 2026-06-29 - Media Blur Placeholder Length Guard

### Completed

- Investigated Render media processing failure where R2 successfully stored `thumb_360.webp`, `gallery_1280.webp`, and `lightbox_2048.webp`, but the media item still became `failed`.
- Identified the database update failure: generated inline WebP blur placeholders could exceed the `media.blurHash varchar(200)` column limit.
- Added a length guard so overlong placeholders are stored as `null` while optimized image URLs, thumbnails, dimensions, and media processing status can still be saved.
- Added image processing test coverage to ensure media updates never write a `blurHash` longer than 200 characters.

### Tests and Checks

- `pnpm.cmd --filter @the-wedding/api test -- media-processing.processor.spec.ts`: pass.
- `pnpm.cmd --filter @the-wedding/api lint`: pass.
- `pnpm.cmd --filter @the-wedding/api typecheck`: pass.
- `pnpm.cmd format:check`: pass.
- `git diff --check`: pass.

## 2026-06-29 - Production Upload Quota Query Fix

### Completed

- Investigated Render upload failure with request id `e686e148-4455-4c16-892f-9bec857faff5`.
- Identified PostgreSQL raw query bug: quota checks referenced camelCase columns as `media.sizeBytes` and `media.tenantId`, which PostgreSQL lowercased to missing columns like `media.sizebytes`.
- Quoted the affected Postgres column references in media upload quota checks and scale tenant usage summaries.
- Added a media service test assertion so quota SQL must keep quoted `"sizeBytes"` and `"tenantId"` columns.

### Tests and Checks

- `pnpm.cmd --filter @the-wedding/api test -- media.service.spec.ts`: pass.
- `pnpm.cmd --filter @the-wedding/api typecheck`: pass.

## 2026-06-29 - Early Cloudflare R2 Storage Adapter

### Completed

- Pulled Cloudflare R2 forward from the later Phase 9 queue because production media uploads on Render local disk remained unreliable.
- Added AWS SDK S3 dependencies and implemented `S3CompatibleStorageService` behind the existing `StorageService` boundary.
- Updated `StorageModule` to select local storage by default or the S3-compatible adapter when `STORAGE_PROVIDER=r2`/`s3`.
- Updated media file/download endpoints to read through `StorageService` instead of `LocalStorageService`, so local and R2 objects share permission-checked routes.
- Adjusted media DTO fallback URLs so owner/public views can use checked API endpoints when no public CDN/base URL is configured.
- Added `docs/guides/CLOUDFLARE_R2_SETUP.md` with bucket, access key, Render env, smoke test, and rollback instructions.

### Deferred / Follow-Up

- Direct browser/mobile upload sessions, multipart/resumable uploads, local-to-R2 migration tooling, signed URL endpoints, and CDN/custom-domain derivative delivery remain separate Phase 9 follow-up work.
- Production still needs real Cloudflare R2 credentials configured on Render and manual smoke testing with real images.

### Tests and Checks

- `pnpm.cmd --filter @the-wedding/api typecheck`: pass.
- `pnpm.cmd --filter @the-wedding/api test`: pass.

## 2026-06-20 - Production Media Upload 500 Hardening

### Completed

- Investigated the remaining production media upload `INTERNAL_SERVER_ERROR` after tenant access was fixed.
- Added explicit zero-byte upload validation so malformed/copied multipart requests return `400 File is empty` instead of reaching storage/processing.
- Wrapped local/object storage writes so filesystem or provider failures return `503 Media storage is unavailable` with server-side logs.
- Made media processing enqueue best-effort from the upload service: the original upload is accepted after storage/DB/audit succeeds, while queue/processor failures are logged and can be retried.
- Added service tests for empty files, storage failures, and queue enqueue failures.

### Tests and Checks

- `pnpm.cmd --filter @the-wedding/api test -- media.service.spec.ts`: pass.
- `pnpm.cmd --filter @the-wedding/api typecheck`: pass.
- `pnpm.cmd --filter @the-wedding/api lint`: pass.

## 2026-06-20 - GitHub Actions Audit Dependency Overrides

### Completed

- Investigated GitHub Actions audit failure for `multer` denial-of-service advisory `GHSA-72gw-mp4g-v24j`.
- Confirmed `@nestjs/platform-express@11.1.26` still depends on `multer@2.1.1`, while the patched advisory version is `multer>=2.2.0`.
- Added root `pnpm.overrides` to pin `multer@2.2.0`.
- Also resolved remaining moderate audit advisories by overriding `postcss@8.5.15` and `js-yaml@4.2.0`.
- Regenerated `pnpm-lock.yaml` and confirmed `pnpm audit --audit-level moderate` reports no known vulnerabilities.

### Tests and Checks

- `pnpm.cmd audit --audit-level moderate`: pass, no known vulnerabilities found.
- `pnpm.cmd format:check`: pass.
- `pnpm.cmd lint`: pass.
- `pnpm.cmd typecheck`: pass.
- `pnpm.cmd test`: pass.
- `pnpm.cmd build`: pass.
- `git diff --check`: pass.

## 2026-06-20 - GitHub Actions Web Lint Fix

### Completed

- Reviewed logs in `logs/logs_75040273481`.
- Identified CI failure in `@the-wedding/web:lint` caused by two `@typescript-eslint/no-unnecessary-type-assertion` errors.
- Removed the unnecessary `Route` assertion from public album links.
- Replaced the login `router.push(... as Route)` cast with `window.location.assign(...)` after successful sign-in, avoiding CI/local typed-route drift while preserving safe internal redirects.

### Tests and Checks

- `pnpm.cmd --filter @the-wedding/web lint`: pass.
- `pnpm.cmd --filter @the-wedding/web typecheck`: pass.

## 2026-06-20 - Production Media Upload Limit And Queue Fallback

### Completed

- Investigated production media upload failures where large phone photos returned `File exceeds upload size limit` and later files returned generic `Internal server error`.
- Changed image validation to honor configured `MAX_UPLOAD_BYTES` instead of the previous hard-coded 15 MB image ceiling.
- Kept video validation on `MAX_VIDEO_UPLOAD_BYTES`.
- Made media processing queue enqueue resilient: if Redis/BullMQ is unavailable or misconfigured, upload returns successfully and processing falls back to inline async processing.
- Added queue/worker error listeners so Redis connection errors are logged as warnings instead of leaking as unexpected runtime failures.

### Tests and Checks

- `pnpm.cmd --filter @the-wedding/api typecheck`: pass.
- `pnpm.cmd --filter @the-wedding/api test`: pass.
- `pnpm.cmd --filter @the-wedding/api lint`: pass.
- Prettier write/check on changed files: pass.

## 2026-06-20 - Tenant Session Refresh After Site Creation

### Completed

- Investigated production album creation failure returning `Tenant access denied`.
- Confirmed the request access token had `tenantIds: []`, so the backend correctly denied access to the newly created tenant.
- Added a frontend auth refresh call immediately after creating a wedding site so the browser receives a fresh access token containing the new tenant membership before album/media actions.

### Tests and Checks

- `pnpm.cmd --filter @the-wedding/web typecheck`: pass.
- `pnpm.cmd --filter @the-wedding/web lint`: pass.
- Prettier write/check on changed files: pass.

## 2026-06-19 - Brevo SMTP Auth Email Configuration

### Completed

- Configured local `.env` for Brevo SMTP using `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASSWORD`, and `SMTP_FROM`.
- Added `AuthMailService` to send password reset and email verification links through SMTP when credentials are configured.
- Wired auth registration and forgot-password flows to send email while preserving non-production dev token responses.
- Updated env validation, `.env.example`, environment docs, and the free-hosting guide for Brevo-compatible SMTP setup.

### Tests and Checks

- `pnpm.cmd --filter @the-wedding/api typecheck`: pass.
- `pnpm.cmd --filter @the-wedding/api test`: pass.
- Prettier write/check on changed code and documentation files: pass.

## 2026-06-18 - Remaining Feature Prompt Backlog

### Completed

- Reviewed current remaining prompts and roadmap/product docs for unfinished items across auth, public discovery, i18n, media delivery, admin operations, and Phase 9 scale.
- Added scoped prompts for SMTP/email production readiness, MFA/TOTP, Google/Facebook OAuth callback exchange and account linking.
- Added scoped prompts for featured album curation, owner opt-in, wish moderation, search metadata consent, pagination/sort, and social/audit export.
- Added scoped prompts for app-wide i18n/l10n, locale persistence, accessibility, responsive UI QA, media security/delivery, R2/S3 readiness, monitoring, role editing, reports, and backup/restore operations.
- Updated the prompt README so future work can run completion slices before the broad Phase 9 scale prompt.

### Files Created or Updated

- `prompts/08a_auth_email_mfa_oauth_completion.md`
- `prompts/08b_public_discovery_moderation_audit_completion.md`
- `prompts/08c_i18n_accessibility_ui_qa_completion.md`
- `prompts/08d_media_security_delivery_completion.md`
- `prompts/08e_admin_operations_monitoring_reports.md`
- `prompts/README.md`
- `docs/CHANGELOG.md`
- `docs/DEVELOPMENT_LOG.md`

### Tests and Checks

- Documentation/prompt-only update. No application code was changed.

## 2026-06-17 - Phase 7A Public Album And Social Expansion

### Design Gate

- Target screens: public home and public album detail.
- Intended emotion: warm, editorial, and guest-friendly for public browsing; calm and encouraging for album social actions.
- First-look hierarchy: public featured album cards appear before login/register prompts.
- Accent colors: rose for primary discovery, teal for privacy/safety cues, amber for social metadata and feedback.
- Spacing and responsive behavior: single-column mobile, two-column tablet, three-column desktop cards; album detail social panel stacks on mobile and sits beside album intro on desktop.
- Interaction states: empty featured sections, empty media/wishes, social pending/success/error feedback, login-required redirect, hover/focus states, and non-blocking reduced-motion-friendly hover.
- i18n/l10n risk: new public UI copy is short and wraps in cards/buttons. Full locale-key extraction for public home/detail remains a follow-up because existing public/auth screens still have hard-coded copy.

### Completed

- Added `ALBUM_VISIBILITY` with `public`, `unlisted`, and `private`.
- Added database migration and entities for OAuth accounts, featured album entries, album wishes, album reactions, album reaction symbols, and album search metadata.
- Added public home and featured album endpoints that return only public albums.
- Added public album detail endpoint that allows public/unlisted direct links and blocks private albums.
- Added authenticated album search that returns public albums only.
- Added authenticated wish/reaction endpoints with rate limits, duplicate rules, symbol validation, and audit events.
- Added owner/member reaction-symbol management endpoints.
- Added Google/Facebook OAuth start/callback routing with safe `returnTo` validation and open-redirect rejection.
- Replaced web root dashboard redirect with a public home page and added public album detail/social UI.
- Added tests for OAuth returnTo validation, album privacy boundaries, featured public query behavior, duplicate wishes, and invalid reaction symbols.

### Files Created or Updated

- `packages/shared/src/tenant.ts`
- `apps/api/src/database/migrations/1710000009000-PublicAlbumSocialExpansion.ts`
- `apps/api/src/modules/public-albums/**`
- `apps/api/src/modules/auth/**`
- `apps/web/src/app/page.tsx`
- `apps/web/src/app/(public)/albums/[albumId]/page.tsx`
- `apps/web/src/features/public-albums/**`
- `docs/**`

### Tests and Checks

- `pnpm.cmd --filter @the-wedding/api test`: pass
- `pnpm.cmd --filter @the-wedding/api lint`: pass
- `pnpm.cmd --filter @the-wedding/api typecheck`: pass
- `pnpm.cmd --filter @the-wedding/web test`: pass
- `pnpm.cmd --filter @the-wedding/web lint`: pass
- `pnpm.cmd --filter @the-wedding/web typecheck`: pass
- `pnpm.cmd format:check`: pass
- `pnpm.cmd test`: pass
- `pnpm.cmd typecheck`: pass
- `pnpm.cmd lint`: pass
- `pnpm.cmd build`: pass
- Browser smoke: public home at desktop 1280px and mobile 390px had no horizontal overflow and showed featured sections. Album 404 detail state at mobile 390px had no horizontal overflow. No public album fixture existed in the current DB for a full social-panel browser click-through.

### Needs Confirmation

- Whether featured albums should stay algorithmic, become admin-curated, support owner opt-in, or use a hybrid model.
- Whether wishes need owner moderation before public display.
- Whether each user should be limited to one reaction per album or one reaction per symbol per album; current implementation uses one per symbol per album.
- Which age, region, venue, time, and theme fields are safe source data for search and which require owner opt-in.
- Whether OAuth should link existing email/password users during the first provider callback exchange.

## 2026-06-17 - Phase 8 Enterprise Hardening

### Design And QA Gate

- Changed screens: none in this slice. Backend/security hardening and documentation only.
- UI QA rule remains active for the next UI change: every changed screen must document emotional intent, first-look hierarchy, accent color, spacing, component hierarchy, complete loading/empty/error/success states, reduced-motion behavior, and responsive checks for Vietnamese, English, and Japanese.
- Accent color and card hierarchy checks remain mandatory for album, media, plan, client, and admin cards when those screens change.

### Completed

- Added MFA-ready user model fields and migration for future TOTP enrollment.
- Enabled API throttling globally and added tighter route-level limits for auth, upload, bulk upload, and admin endpoints.
- Added request correlation IDs through `x-correlation-id` and included request IDs in API response metadata.
- Added audit metadata redaction before persistence for passwords, tokens, cookies, OTP/MFA values, OAuth authorization codes, provider secrets, and raw sensitive headers.
- Added tenant upload quota enforcement through `TENANT_STORAGE_QUOTA_BYTES` before writing uploaded bytes to storage.
- Expanded runtime parameter assertions and tests for fail-safe defaults, cache invalidation, registration disabled, login disabled, download disabled, public gallery disabled, and payment checkout disabled.
- Added backend tests for invalid CSRF, audit redaction, upload MIME/extension mismatch, tenant quota denial, cross-tenant denial, disabled upload, and refresh token reuse.
- Documented backup/restore for PostgreSQL/Neon and app-managed media storage.

### Files Created or Updated

- `apps/api/src/common/middleware/request-correlation.middleware.ts`
- `apps/api/src/common/security/audit-redaction.ts`
- `apps/api/src/database/migrations/1710000008000-Phase8EnterpriseHardening.ts`
- `apps/api/src/modules/**`
- `.env.example`
- `docs/AUTH_SECURITY.md`
- `docs/DATABASE_DESIGN.md`
- `docs/DEPLOYMENT.md`
- `docs/ENVIRONMENT_VARIABLES.md`
- `docs/ROADMAP.md`
- `docs/TESTING_STRATEGY.md`
- `docs/TROUBLESHOOTING.md`
- `docs/HUONG_DAN_SU_DUNG.md`

### Tests and Checks

- `pnpm.cmd --filter @the-wedding/api test`: pass
- `pnpm.cmd --filter @the-wedding/api typecheck`: pass
- `pnpm.cmd --filter @the-wedding/api lint`: pass

### Release Risk List

- MFA fields are model-only; no user-facing MFA enrollment or challenge is active yet.
- Malware scanning is still planned and uploads rely on type/extension/size/quota checks in this slice.
- `TENANT_STORAGE_QUOTA_BYTES` is a single environment-wide default until Phase 9 plan/entitlement quotas ship.
- Full browser screenshot QA and visual regression checks still need a running app/browser pass before release.
- OAuth, wishes, reactions, and public album discovery security checks remain planned until those modules are implemented.

## 2026-06-17 - Prompt And Plan Optimization For Public Album Expansion

### Completed

- Reviewed current root prompt, prompt README, remaining phase prompts, product plan, roadmap, API/database/security/role/testing/UI docs, overview, changelog, and user guide context.
- Added a scoped Public Album And Social Expansion Track covering public home, featured albums, album privacy, wishes, reactions, Google/Facebook OAuth, redirect back to album after login, authenticated search, and audit redaction.
- Added new prompt `prompts/07a_public_album_social_expansion.md` so future implementation can be split before hardening and not mixed into the broad Phase 9 scale prompt.
- Updated existing prompts with guardrails for privacy, login-required interactions, OAuth `returnTo`, and audit redaction.
- Added "Needs Confirmation" items for ranking, reaction uniqueness, wish moderation, search metadata sources, and OAuth account linking.

### Files Created or Updated

- `prompts/07a_public_album_social_expansion.md`
- `prompts/README.md`
- `prompts/07_phase_8_hardening.md`
- `prompts/08_phase_9_scale_features.md`
- `prompts/09_final_release_qa.md`
- `sieu_prompt_agent_web_anh_cuoi.md`
- `docs/PRODUCT_PLAN.md`
- `docs/ROADMAP.md`
- `docs/API_DESIGN.md`
- `docs/DATABASE_DESIGN.md`
- `docs/AUTH_SECURITY.md`
- `docs/ROLE_PERMISSION.md`
- `docs/ARCHITECTURE.md`
- `docs/PROJECT_OVERVIEW.md`
- `docs/TESTING_STRATEGY.md`
- `docs/UI_UX_DESIGN.md`
- `docs/CHANGELOG.md`
- `docs/DEVELOPMENT_LOG.md`

### Tests and Checks

- Documentation/prompt-only update. No application code was changed.

## 2026-06-16 - Phase 7 Media Processing Advanced

### Design Gate

- Target screen: owner media dashboard and public gallery media tiles.
- Intended emotion: calm and operational for owners, warm and unobtrusive for guests.
- First visible status cue: a compact processing badge on each media card plus a soft amber placeholder when no optimized asset is ready.
- Accent color: amber for queued/processing, emerald for ready, rose for failed/retry.
- Spacing: existing dashboard grid spacing is preserved; badges stay compact so file names, checkbox, and actions do not overflow on mobile cards.
- Async states: queued, processing, ready, failed, retry queued, upload queue states, empty media state, and public-gallery placeholder state.
- Responsive/i18n signoff: labels use locale keys for `vi`, `en`, and `ja`; badge text wraps through compact containers and cards keep stable aspect ratios.

### Completed

- Added BullMQ/Redis media processing service with inline async local fallback when `REDIS_URL` is empty.
- Added Sharp-based image processing for thumbnail, gallery, and lightbox WebP derivatives.
- Kept original media private by default and generated backend-controlled derivative storage keys.
- Added idempotent media version upserts using a unique `mediaId + versionType` constraint.
- Added processing attempts, failure reason tracking, retry endpoint, and storage usage recalculation after processing.
- Updated owner media dashboard with processing badges, placeholders, retry action, optimized thumbnail display, and polling while jobs are active.
- Updated public gallery and public site hero to prefer optimized derivative URLs and avoid loading private originals while processing.
- Added media processing locale keys for Vietnamese, English, and Japanese.
- Added processor and upload queue tests.

### Files Created or Updated

- `packages/shared/src/media.ts`
- `apps/api/src/modules/media/**`
- `apps/api/src/modules/storage/**`
- `apps/api/src/database/migrations/1710000007000-MediaProcessingPipeline.ts`
- `apps/api/src/config/env.validation.ts`
- `apps/web/src/features/media/**`
- `apps/web/src/lib/i18n/locales.ts`
- `docs/ARCHITECTURE.md`
- `docs/DEPLOYMENT.md`
- `docs/ENVIRONMENT_VARIABLES.md`
- `docs/TROUBLESHOOTING.md`
- `docs/ROADMAP.md`
- `docs/CHANGELOG.md`
- `docs/HUONG_DAN_SU_DUNG.md`

### Tests and Checks

- `pnpm.cmd --filter @the-wedding/shared build`: pass
- `pnpm.cmd --filter @the-wedding/api typecheck`: pass
- `pnpm.cmd --filter @the-wedding/web typecheck`: pass
- `pnpm.cmd --filter @the-wedding/shared typecheck`: pass
- `pnpm.cmd --filter @the-wedding/api test`: pass
- `pnpm.cmd --filter @the-wedding/web test`: pass
- `pnpm.cmd --filter @the-wedding/api lint`: pass
- `pnpm.cmd --filter @the-wedding/web lint`: pass

### Technical Risks

- Video preview is metadata-only until the production worker image includes ffmpeg or another approved extraction backend.
- Local inline processing is for development convenience; production should configure Redis and a worker process.
- Phase 9 still needs paid quota enforcement, R2/CDN delivery, signed URLs, and direct upload sessions.

## 2026-06-16 - SaaS Product Plan And Prompt Execution Update

### Completed

- Added a living product plan that integrates the new SaaS business model, B2C packages, B2B studio subscriptions, value-added services, workflows, UI/UX execution process, theme automation, automated greetings, and future execution playbook.
- Linked the product plan into project overview, roadmap, UI/UX design direction, architecture, API planning, database planning, and testing strategy.
- Updated remaining prompts so future agents must read the product plan, follow the UI design gate, and map features to business model, workflow, gates, tests, and docs.
- Updated the root super prompt with the new business direction, UI/UX workflow, custom/admin/contextual theme requirements, automated greetings, B2B studio direction, and roadmap additions.

### Files Created or Updated

- `docs/PRODUCT_PLAN.md`
- `docs/PROJECT_OVERVIEW.md`
- `docs/ROADMAP.md`
- `docs/UI_UX_DESIGN.md`
- `docs/ARCHITECTURE.md`
- `docs/DATABASE_DESIGN.md`
- `docs/API_DESIGN.md`
- `docs/TESTING_STRATEGY.md`
- `docs/CHANGELOG.md`
- `docs/DEVELOPMENT_LOG.md`
- `README.md`
- `prompts/README.md`
- `prompts/06_phase_7_media_processing.md`
- `prompts/07_phase_8_hardening.md`
- `prompts/08_phase_9_scale_features.md`
- `prompts/09_final_release_qa.md`
- `prompts/10_phase_10_cicd_docker_vps.md`
- `sieu_prompt_agent_web_anh_cuoi.md`

### Current Capability

- The project now has a single detailed product execution source for SaaS business direction, workflows, UI requirements, feature planning, and future implementation steps.
- Future prompt runs are instructed to follow the product plan and UI design gate before coding.

### Missing

- This is a documentation and prompt update only. B2B studio, dynamic contextual theme, automated greetings, add-ons, premium gates, and AI utilities remain planned unless a future phase implements them.

### Tests and Checks

- Documentation-only update. Run `git diff --check` and a markdown formatting check if available.

### Technical Risks

- Future phases must avoid implementing contextual weather/location features without opt-in, safe fallback, reduced-motion support, and privacy review.

## 2026-06-12 - Phase 0 and Phase 1 Foundation

### Completed

- Created documentation-first project foundation.
- Created monorepo structure for API, web, shared packages, config, docs, docker, and scripts.
- Added NestJS API skeleton with Clean Architecture module folders.
- Added Next.js App Router skeleton with public, auth, dashboard, and admin route groups.
- Added SQL Server initial migration draft covering required core tables.
- Added Docker Compose with SQL Server and Redis.
- Added GitHub PR, issue, and CI templates.

### Files Created or Updated

- `README.md`, `.env.example`, `.gitignore`, `.editorconfig`, `.prettierrc.json`
- `package.json`, `pnpm-workspace.yaml`, `turbo.json`, `tsconfig.base.json`
- `docs/*.md`
- `apps/api/**`
- `apps/web/**`
- `packages/**`
- `docker/**`, `docker-compose.yml`
- `.github/**`

### Current Capability

- The repository now has a complete foundation for installing dependencies and beginning backend/frontend implementation.
- API and web apps are scaffolds, not completed runtime features.

### Missing

- Node.js, npm, pnpm, and Git are not available in the current terminal PATH.
- Dependency install, lint, typecheck, build, migration execution, and tests have not been run.
- Business use cases are placeholders for future phases.

### Related Config and Env

- Main env file: `.env.example`
- API env validation: `apps/api/src/config/env.validation.ts`
- Database config: `apps/api/src/database/typeorm.config.ts`

### Related Permissions

- `SUPER_ADMIN`, `ADMIN`, `SUPPORT`, `USER`, `GUEST`
- Permission constants are defined in `packages/shared/src/permissions.ts`

### Related APIs

- API route contract is documented in `docs/API_DESIGN.md`.
- Controller implementations are intentionally minimal in Phase 1.

### Related Tables

- See `docs/DATABASE_DESIGN.md` and the initial migration file.

### Tests

- Test scripts are declared but not executed because Node/pnpm are unavailable.

### Technical Risks

- Dependency versions may need adjustment during `pnpm install`.
- SQL Server migration SQL must be tested against an actual SQL Server container.

## 2026-06-12 - Local Repo, SQL Server, Install, and Run Verification

### Completed

- Initialized the workspace as a Git repository on branch `main`.
- Connected Git remote `origin` to `https://github.com/datpp03/TheWedding.git`.
- Installed Node dependencies with pnpm.
- Connected the API to local SQL Server database `TheWedding`.
- Enabled SQL Server Mixed Mode and TCP/IP for local TypeORM/Tedious connectivity.
- Created SQL login/database user `TheWeddingApp` for the `TheWedding` database.
- Ran the initial TypeORM migration successfully.
- Seeded default roles, permissions, role-permission mappings, and `admin@example.com`.
- Started API on `http://localhost:4000` and Web on `http://localhost:3000`.

### Files Created or Updated

- `pnpm-lock.yaml`
- `.env.example`
- `package.json`
- `apps/api/package.json`
- `apps/api/src/app.module.ts`
- `apps/api/src/config/env.validation.ts`
- `apps/api/src/database/data-source.ts`
- `apps/api/src/database/typeorm.config.ts`
- `apps/api/src/common/guards/tenant-access.guard.ts`
- `apps/api/src/types/mssql-msnodesqlv8.d.ts`
- `apps/web/tsconfig.json`
- `apps/web/next.config.mjs`
- `apps/web/eslint.config.mjs`
- `packages/shared/src/index.ts`
- `packages/shared/eslint.config.mjs`
- `packages/ui/src/index.ts`
- `packages/ui/eslint.config.mjs`
- `docs/DEVELOPMENT_LOG.md`
- `docs/CHANGELOG.md`
- `docs/ENVIRONMENT_VARIABLES.md`
- `docs/ROADMAP.md`

### Current Capability

- `pnpm install`, `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm build` pass locally.
- API health endpoint returns HTTP 200 at `/api/v1/health`.
- Auth capabilities endpoint returns HTTP 200 at `/api/v1/auth/capabilities`.
- Web dashboard returns HTTP 200 at `/dashboard`.
- Database contains 20 tables, 5 roles, 18 permissions, and one active super admin user.

### Missing

- No real auth/user/tenant/media use cases yet; these begin in Phase 2 and beyond.
- Jest has no API test files yet and is configured with `--passWithNoTests` for the scaffold phase.
- Next-specific ESLint flat-config integration is not added yet; shared ESLint base is used for now.

### Config/Env

- Local `.env` uses SQL login `TheWeddingApp` and is intentionally gitignored.
- SQL Server local instance was changed to Mixed Mode and TCP/IP port 1433.
- The app database is `TheWedding`.

### Related API

- `GET /api/v1/health`
- `GET /api/v1/auth/capabilities`

### Related Tables

- All initial migration tables listed in `docs/DATABASE_DESIGN.md`.

### Tests and Checks

- `pnpm lint`: pass
- `pnpm typecheck`: pass
- `pnpm test`: pass
- `pnpm build`: pass
- SQL migration: pass
- Seed script: pass
- HTTP smoke tests: pass

### Technical Risks

- Local SQL Server was modified from Windows-only auth to Mixed Mode. This is appropriate for the current TypeORM/Tedious setup but should be reviewed before production.
- `msnodesqlv8` support remains available in config, but TypeORM was verified against SQL auth because Windows Auth through TypeORM hangs with the current driver option shape.

## 2026-06-12 - Phase 2 Auth and User Foundation

### Completed

- Implemented database-backed user registration and login.
- Added HttpOnly cookie auth with short-lived access token and refresh token rotation.
- Stored refresh token secrets only as Argon2 hashes in `user_sessions`.
- Added refresh token reuse detection that revokes the session family.
- Added current user, session list, revoke one session, revoke all sessions, refresh, and logout APIs.
- Added global access token guard with `@Public()` support.
- Added TypeORM entities and repository methods for `users`, `user_sessions`, `user_login_histories`, roles, and permissions.
- Added frontend login and register forms wired to the API.
- Added dashboard auth status with current user fetch and sign out action.
- Added Jest unit tests for auth registration, duplicate registration, failed login, refresh rotation, and refresh reuse handling.

### Files Created or Updated

- `apps/api/src/modules/auth/application/auth.service.ts`
- `apps/api/src/modules/auth/application/auth-token.service.ts`
- `apps/api/src/modules/auth/application/auth.types.ts`
- `apps/api/src/modules/auth/application/auth.service.spec.ts`
- `apps/api/src/modules/auth/infrastructure/typeorm-auth.repository.ts`
- `apps/api/src/modules/auth/infrastructure/user-session.orm-entity.ts`
- `apps/api/src/modules/auth/infrastructure/user-login-history.orm-entity.ts`
- `apps/api/src/modules/auth/presentation/*`
- `apps/api/src/modules/users/infrastructure/user.orm-entity.ts`
- `apps/api/src/modules/permissions/infrastructure/*`
- `apps/api/jest.config.cjs`
- `apps/api/tsconfig.json`
- `apps/web/src/features/auth/*`
- `apps/web/src/app/(auth)/login/page.tsx`
- `apps/web/src/app/(auth)/register/page.tsx`
- `apps/web/src/components/app-shell.tsx`
- `apps/web/src/lib/api-client.ts`
- `docs/DEVELOPMENT_LOG.md`
- `docs/CHANGELOG.md`
- `docs/API_DESIGN.md`
- `docs/AUTH_SECURITY.md`
- `docs/ROADMAP.md`

### Current Capability

- Users can register and are assigned the `USER` role.
- Users can login from the web app and access `/dashboard`.
- API can identify the current user from `access_token` cookie or Bearer token.
- API can rotate refresh tokens using the `refresh_token` cookie.
- Users can list/revoke sessions and sign out.

### Missing

- Forgot/reset password and email verification endpoints are still planned.
- CSRF token exchange is documented but not yet implemented.
- Audit log writes are represented by login history for auth events; the full audit-log module remains planned.
- Route protection on frontend is still light; dashboard currently shows sign-in status but does not server-redirect anonymous users.

### Tests and Checks

- API auth unit tests: pass.
- API lint/typecheck: pass during implementation.
- Web lint/typecheck: pass during implementation.

### Technical Risks

- Cookie security uses environment-aware settings; production deployment must set HTTPS and a strict CORS origin list.
- Refresh token family revocation is implemented for one active session row per rotated token. Future multi-device/session-family behavior should be covered by e2e tests.

## 2026-06-12 - UI/UX Direction Added To Plan

### Completed

- Added a formal UI/UX design direction for youthful, energetic, Gen Z-friendly frontend work.
- Added mobile-first responsive requirements for phones, tablets, and desktop screens.
- Added smooth UX requirements for loading, empty, error, success, touch, animation, and media-heavy flows.
- Linked the UI/UX direction into product overview, roadmap phases, and testing strategy.

### Files Created or Updated

- `docs/UI_UX_DESIGN.md`
- `docs/PROJECT_OVERVIEW.md`
- `docs/ROADMAP.md`
- `docs/TESTING_STRATEGY.md`
- `docs/DEVELOPMENT_LOG.md`
- `docs/CHANGELOG.md`

### Tests and Checks

- Documentation-only change; formatting check is sufficient.

## 2026-06-12 - Phase 2 Auth Completion

### Completed

- Added password reset token entity/repository support using hashed one-time token secrets.
- Added email verification token entity/repository support using hashed one-time token secrets.
- Added audit log TypeORM repository and wired auth security events into audit logs.
- Added CSRF token endpoint and CSRF validation inside the access-token guard for non-public mutations.
- Added backend endpoints for forgot password, reset password, verify email, and CSRF token exchange.
- Added frontend forgot password, reset password, and email verification screens.
- Added dashboard/admin route protection through Next middleware.
- Updated auth API client to fetch and send CSRF tokens for mutations.
- Extended auth unit coverage from 4 to 8 cases.

### Files Created or Updated

- `.env.example`
- `apps/api/src/config/env.validation.ts`
- `apps/api/src/modules/audit-logs/**`
- `apps/api/src/modules/auth/**`
- `apps/web/src/app/(auth)/**`
- `apps/web/src/features/auth/**`
- `apps/web/src/lib/api-client.ts`
- `apps/web/src/middleware.ts`
- `docs/API_DESIGN.md`
- `docs/AUTH_SECURITY.md`
- `docs/ENVIRONMENT_VARIABLES.md`
- `docs/DEVELOPMENT_LOG.md`
- `docs/CHANGELOG.md`
- `docs/ROADMAP.md`

### Current Capability

- Users can request a password reset without email enumeration.
- Users can reset password with a valid one-time token; sessions are revoked after reset.
- Users can verify email with a valid one-time token.
- Local development returns reset/verification tokens in API payloads because SMTP delivery is not wired yet.
- Dashboard/admin routes redirect anonymous visitors to login with a preserved redirect path.

### Tests and Checks

- API auth unit tests: 8 passing.
- API lint/typecheck: pass during implementation.
- Web lint/typecheck: pass during implementation.

### Technical Risks

- SMTP delivery is not implemented yet; production must deliver reset/verification tokens by email and must not expose development tokens in responses.
- Middleware checks cookie presence for route protection; API remains the source of truth for token validity.

## 2026-06-12 - Phase 3 Tenant and Public Site Foundation

### Completed

- Implemented the tenants module with domain rules, TypeORM entities/repository, application use cases, DTOs, and controllers.
- Added tenant CRUD, slug availability, settings, visibility, and public site endpoints.
- Created the owner tenant member row when a tenant is created.
- Added membership-scoped tenant reads/mutations and public visibility/password gating.
- Added audit log writes for tenant create, update, settings, visibility, and delete operations.
- Added dashboard tenant onboarding with slug preview and availability feedback.
- Added tenant settings UI for identity, visibility, SEO, share metadata, and site settings.
- Connected public `/(public)/[siteSlug]` to the public site API with private/password access gates.
- Added backend unit tests for tenant access and public visibility rules.

### Files Created or Updated

- `apps/api/src/modules/tenants/**`
- `apps/web/src/features/tenants/**`
- `apps/web/src/app/(dashboard)/dashboard/page.tsx`
- `apps/web/src/app/(dashboard)/dashboard/settings/page.tsx`
- `apps/web/src/app/(public)/[siteSlug]/page.tsx`
- `docs/API_DESIGN.md`
- `docs/ROADMAP.md`
- `docs/DEVELOPMENT_LOG.md`
- `docs/CHANGELOG.md`

### Current Capability

- Logged-in users can create wedding sites and manage their own tenant settings.
- Tenant creation creates an owner membership row for isolation and future collaboration.
- Duplicate slugs are rejected, and the dashboard gives availability feedback before submit.
- Public slug pages render site shell data when public, and show access gates for private/password-protected sites.

### Tests and Checks

- API tenant domain unit tests added.
- Full workspace checks were run during implementation; see the final task summary for exact pass/fail status.

### Technical Risks

- Public album/media endpoints remain planned for Phase 4.
- Password-protected public access currently uses a query parameter gate suitable for MVP smoke testing; a short-lived access token or signed cookie should replace this before production sharing.

## 2026-06-12 - Planning Updates for Prompt Lifecycle and App Storage

### Completed

- Added a prompt lifecycle rule to every prompt file: only delete a prompt after every item in that prompt is complete, verified, documented, committed, and pushed.
- Removed the previously planned external-drive integration path.
- Clarified that media uploads should use app-managed storage: local filesystem for development and S3-compatible object storage for production readiness.
- Added `docs/STORAGE_STRATEGY.md` to guide local storage, production object storage, CDN delivery, signed URLs, media processing, and future React Native iOS/Android upload sessions.

## 2026-06-12 - Phase 4 Album and Media MVP

### Completed

- Implemented album CRUD, reorder, cover selection, visibility, and allow-download controls.
- Implemented media single upload, bulk upload, listing, metadata update, reorder, move, batch delete, authenticated file serving, public gallery file serving, and download permission checks.
- Added local filesystem storage adapter behind `StorageService` using backend-generated randomized keys and path traversal protection.
- Added upload validation for MIME type, file extension, and size before storage writes.
- Added audit log writes for album mutations and media upload/update/reorder/move/delete/download events.
- Built album dashboard, media dashboard with drag/drop queue and batch actions, public gallery, and keyboard lightbox.
- Confirmed Phase 4 follows `docs/STORAGE_STRATEGY.md`: local dev storage now, provider-neutral boundary, no trusted user filenames in storage paths, and raw storage keys kept out of API DTOs.

### Files Created or Updated

- `apps/api/src/modules/albums/**`
- `apps/api/src/modules/media/**`
- `apps/api/src/modules/storage/**`
- `apps/web/src/features/media/**`
- `apps/web/src/app/(dashboard)/dashboard/albums/page.tsx`
- `apps/web/src/app/(dashboard)/dashboard/media/page.tsx`
- `apps/web/src/app/(public)/[siteSlug]/page.tsx`
- `docs/API_DESIGN.md`
- `docs/DATABASE_DESIGN.md`
- `docs/ROADMAP.md`
- `docs/CHANGELOG.md`
- `docs/DEVELOPMENT_LOG.md`

### Tests and Checks

- `pnpm.cmd --filter @the-wedding/api typecheck`: pass
- `pnpm.cmd --filter @the-wedding/web typecheck`: pass
- `pnpm.cmd --filter @the-wedding/api test`: pass
- `pnpm.cmd --filter @the-wedding/web test`: pass, script currently reports no web tests yet
- `pnpm.cmd --filter @the-wedding/api lint`: pass
- `pnpm.cmd --filter @the-wedding/web lint`: pass
- `pnpm.cmd --filter @the-wedding/api build`: pass
- `pnpm.cmd --filter @the-wedding/web build`: pass

### Technical Risks

- Upload progress in the web MVP is queue-status based; precise byte progress should be added with an upload transport that exposes progress events.
- Local storage file serving is suitable for development. Production should use private object storage, signed URLs, CDN-backed optimized derivatives, and malware scanning before broad public uploads.

## 2026-06-12 - Phase 5 Theme Customization MVP

### Completed

- Replaced simple theme name constants with shared preset objects, theme settings, validation helpers, and default preset fallback.
- Implemented the themes backend module with TypeORM repository, application service, DTOs, and controller endpoints.
- Added tenant-scoped theme list, active theme bootstrap, create, update, preview, activate, clone, and reset.
- Enforced tenant membership on theme reads/mutations through the tenants application service.
- Added audit log writes for theme create/update/activate/clone/reset.
- Extended public site reads to include `activeTheme` and updated the public site shell to apply colors, typography, radius, hero style, and media density.
- Built the theme dashboard with preset gallery, swatches, color inputs, layout selectors, typography/style controls, live preview, save/activate/reset/clone actions, loading/error/success/dirty states, and responsive controls.
- Started i18n/l10n foundation for new theme UI with stable keys and `vi`, `en`, `ja` dictionaries.
- Added backend theme tests for validation, tenant access denial, activation audit, and reset behavior.

### Files Created or Updated

- `packages/shared/src/theme.ts`
- `apps/api/src/modules/themes/**`
- `apps/api/src/modules/tenants/**`
- `apps/web/src/features/themes/**`
- `apps/web/src/lib/i18n/locales.ts`
- `apps/web/src/app/(dashboard)/dashboard/themes/page.tsx`
- `apps/web/src/app/(public)/[siteSlug]/page.tsx`
- `docs/API_DESIGN.md`
- `docs/ROADMAP.md`
- `docs/CHANGELOG.md`
- `docs/HUONG_DAN_SU_DUNG.md`
- `docs/UI_UX_DESIGN.md`

### Tests and Checks

- `pnpm.cmd format`: pass
- `pnpm.cmd typecheck`: pass
- `pnpm.cmd test`: pass

### Technical Risks

- Theme custom CSS is stored but not surfaced in the editor yet; production use should sandbox or restrict custom CSS before exposing it broadly.
- Web smoke tests are not automated yet; the current web test script still reports no web tests.
- Locale selection/persistence is not app-wide yet; Phase 5 only localizes the new theme UI.

## 2026-06-15 - Planning Update for R2, System Parameters, Payments, and User Handles

### Completed

- Updated the roadmap and implementation prompts to make Cloudflare R2 the first production object-storage target behind the S3-compatible `StorageService` boundary.
- Added the target image flow: original upload, backend validation, resize/compression, private original storage, optimized derivatives in R2, and frontend display from compressed versions.
- Added admin-managed system parameters for disabling registration, disabling login into read-only/public browsing mode, and toggling upload/download/payment/public-gallery behavior.
- Added subscription/payment planning with MoMo as the first payment provider, storage quota upgrades, premium feature gates, and admin-granted entitlements.
- Added user-chosen public handles and handle-based public album URL planning so duplicate album names across users remain unambiguous.

### Files Created or Updated

- `docs/PROJECT_OVERVIEW.md`
- `docs/ROADMAP.md`
- `docs/STORAGE_STRATEGY.md`
- `docs/DATABASE_DESIGN.md`
- `docs/API_DESIGN.md`
- `docs/ROLE_PERMISSION.md`
- `docs/ENVIRONMENT_VARIABLES.md`
- `docs/ARCHITECTURE.md`
- `docs/DEPLOYMENT.md`
- `docs/CHANGELOG.md`
- `prompts/05_phase_6_admin_dashboard.md`
- `prompts/06_phase_7_media_processing.md`
- `prompts/07_phase_8_hardening.md`
- `prompts/08_phase_9_scale_features.md`
- `prompts/09_final_release_qa.md`
- `sieu_prompt_agent_web_anh_cuoi.md`

### Tests and Checks

- Documentation-only planning update. No code verification was required.

## 2026-06-15 - Early CI/CD Docker VPS Foundation

### Completed

- Added `docs/guides/` as the documentation folder for operational and usage guides.
- Added `.github/workflows/deploy-docker-vps.yml` so CI/CD can run before the remaining feature phases and deploy progress to a VPS.
- Added `docker-compose.prod.yml` for production container startup through pulled registry images.
- Added `docker/production.env.example` as the VPS `.env.production` template.
- Added a Vietnamese CI/CD guide for GitHub Actions building API/Web Docker images, pushing to Docker Hub or GHCR, deploying through VPS pull, and restarting containers with Docker Compose.
- Moved CI/CD to a priority phase before Phase 6 in the roadmap and prompt order so remote progress previews can start early.
- Linked the guide from README and deployment documentation.

### Files Created or Updated

- `.github/workflows/deploy-docker-vps.yml`
- `docker-compose.prod.yml`
- `docker/production.env.example`
- `docs/guides/README.md`
- `docs/guides/CI_CD_DOCKER_VPS.md`
- `docs/ROADMAP.md`
- `docs/DEPLOYMENT.md`
- `docs/PROJECT_OVERVIEW.md`
- `README.md`
- `prompts/README.md`
- `prompts/10_phase_10_cicd_docker_vps.md`
- `docs/CHANGELOG.md`
- `docs/DEVELOPMENT_LOG.md`

### Tests and Checks

- `git diff --check`: pass after documentation/workflow updates.

## 2026-06-15 - Host, Database, and Media Storage Migration Guide

### Completed

- Added a Vietnamese guide with accents for reconfiguring the system when moving VPS/host, SQL Server database, and image/video storage.
- Covered SQL Server backup/restore, local storage volume copy, Cloudflare R2/S3-compatible reconfiguration, `.env.production`, CI/CD secrets, smoke tests, DNS/reverse proxy updates, rollback, and common errors.
- Linked the guide from the guide index and deployment documentation.

### Files Created or Updated

- `docs/guides/HUONG_DAN_DI_DOI_HOST_DATABASE_STORAGE.md`
- `docs/guides/README.md`
- `docs/DEPLOYMENT.md`
- `docs/CHANGELOG.md`
- `docs/DEVELOPMENT_LOG.md`

### Tests and Checks

- `pnpm.cmd exec prettier --check docs/guides/HUONG_DAN_DI_DOI_HOST_DATABASE_STORAGE.md docs/guides/README.md docs/DEPLOYMENT.md`: pass
- `git diff --check`: pass

## 2026-06-16 - Prompt Workflow and R2 Deferral Update

### Completed

- Reordered the remaining prompt workflow around the active Vercel + Render + Neon deployment path.
- Moved Docker VPS CI/CD to an optional later track instead of the next required prompt.
- Deferred Cloudflare R2 activation until Phase 9 implements the S3/R2 adapter, signed URL/upload sessions, docs, tests, and smoke tests.
- Clarified that production should keep `STORAGE_PROVIDER=local` during the current free-hosting smoke-test stage.

### Files Created or Updated

- `prompts/README.md`
- `prompts/08_phase_9_scale_features.md`
- `prompts/09_final_release_qa.md`
- `docs/ROADMAP.md`
- `docs/STORAGE_STRATEGY.md`
- `docs/guides/FREE_HOSTING_VERCEL_RENDER_NEON.md`
- `docs/CHANGELOG.md`
- `docs/DEVELOPMENT_LOG.md`

### Tests and Checks

- Documentation-only planning update.

## 2026-06-16 - Phase 6 Admin Dashboard MVP

### Completed

- Implemented admin API endpoints for stats, users, tenants, media moderation, audit logs, system settings, feature flags, and system parameters.
- Registered the permission guard globally and enforced `admin.access` on `/api/v1/admin/*`.
- Added runtime system parameter validation, cache invalidation, fail-safe defaults, and backend enforcement for registration, login, upload, download, and public gallery disabling.
- Added admin audit logging for user status/role changes, tenant status changes, media moderation, settings, feature flags, and system parameters.
- Replaced admin placeholder pages with responsive admin UI screens and mobile card fallbacks.
- Added admin locale keys for `vi`, `en`, and `ja`.
- Added tests for permission denial/success, disabled registration/login/upload behavior, and admin i18n coverage.

### Files Created or Updated

- `apps/api/src/modules/admin/**`
- `apps/api/src/modules/settings/**`
- `apps/api/src/modules/auth/**`
- `apps/api/src/modules/media/**`
- `apps/api/src/common/guards/permissions.guard.spec.ts`
- `apps/web/src/features/admin/**`
- `apps/web/src/app/(admin)/admin/**`
- `apps/web/src/lib/i18n/locales.ts`
- `docs/API_DESIGN.md`
- `docs/ROLE_PERMISSION.md`
- `docs/ROADMAP.md`
- `docs/CHANGELOG.md`
- `docs/HUONG_DAN_SU_DUNG.md`

### Tests and Checks

- `pnpm.cmd --filter @the-wedding/api typecheck`: pass
- `pnpm.cmd --filter @the-wedding/web typecheck`: pass
- `pnpm.cmd --filter @the-wedding/api test`: pass
- `pnpm.cmd --filter @the-wedding/web test`: pass

### Technical Risks

- Admin role editing is available through the API; the current MVP UI focuses on status operations and list moderation.
- Payment checkout disabling is stored as a runtime parameter now and will be enforced when payment checkout endpoints are implemented.

## 2026-06-18 - Prompt 08 Phase 9 Scale Foundation

### Design Gate

- Emotion: operational, premium, and revenue-aware for admins/support.
- First-look hierarchy: scale metrics and B2C/B2B plan catalog appear before manual unlock controls.
- Accent color: rose for catalog/highlights, teal for admin unlock controls, amber for add-on cards.
- Layout: responsive card grids on desktop/tablet, stacked cards/forms on mobile, no white/gray-only surface.
- States: loading/error notice, saved notice, disabled/busy submit state, i18n keys for all visible copy.

### Completed

- Added shared scale catalog and rules in `packages/shared/src/scale.ts`: B2C plans, B2B studio tiers, add-ons, feature flag keys, plan limit resolution, feature gate checks, public handle normalization, contextual theme fallback resolver, and greeting schedule helper.
- Added `apps/api/src/modules/scale` with safe public catalog/handle checks, authenticated handle and tenant summary endpoints, admin overview, admin entitlement grants, admin payment-event idempotency placeholder, analytics events, and greeting rule foundation.
- Added migration `1710000010000-Phase9ScaleFoundation.ts` for user handles, plan subscriptions, entitlements, payment events, custom domains, studio profiles/clients, analytics events, and greeting rules.
- Added `/admin/scale` UI with plan cards, add-on cards, feature gate list, metrics, and manual entitlement unlock form.
- Added locale keys for the Scale UI in `vi`, `en`, and `ja`.
- Added optional env validation/examples for R2/S3 signed URL settings, upload limits, and MoMo placeholders.
- Added unit coverage for plan/add-on classification, storage boosts, premium theme gates, handle validation, contextual theme fallback, and greeting windows.

### Deferred / Carryover

- Real MoMo checkout, redirect, and signed public webhook verification are not implemented.
- R2/S3 `StorageService` adapter, signed URLs, direct upload sessions, multipart mobile uploads, local-to-R2 migration, and production smoke tests remain deferred.
- Canonical public handle routes/redirects are planned but not exposed in Next.js routes yet.
- Studio delivery workflow, DNS custom-domain verification, watermark processing hook, AI tag adapter/storage UI, contextual theme UI, and greeting scheduler remain gated placeholders.
- Full browser responsive screenshot QA for `/admin/scale` still needs an authenticated admin session and running app.

### Tests and Checks

- `pnpm.cmd --filter @the-wedding/shared typecheck`: pass
- `pnpm.cmd --filter @the-wedding/shared build`: pass
- `pnpm.cmd --filter @the-wedding/api typecheck`: pass
- `pnpm.cmd --filter @the-wedding/web typecheck`: pass
- `pnpm.cmd format:check`: pass
- `pnpm.cmd lint`: pass
- `pnpm.cmd typecheck`: pass
- `pnpm.cmd test`: pass
- `pnpm.cmd build`: pass after rerun with elevated permission because Next standalone needs Windows symlink permission.

## 2026-06-18 - SEO/GEO Planning And Prompt Rules

### Completed

- Added `docs/SEO_GEO_GUIDELINES.md` as the source of truth for SEO and Generative Engine Optimization.
- Added rules for canonical URLs, robots/noindex, sitemap eligibility, structured data, Open Graph metadata, i18n metadata, AI crawler policy, media alt/caption handling, and privacy-first indexing.
- Linked SEO/GEO requirements into `AGENTS.md`, product plan, project overview, roadmap, UI/UX guidelines, testing strategy, system map, prompt README, and active prompt files.
- Clarified that private, unlisted/link-only, auth, dashboard, admin, callback, signed media, raw storage, and sensitive metadata must not be indexable or AI-facing.

### Tests and Checks

- Documentation/prompt-only update; ran Prettier check on changed markdown files.

## 2026-06-18 - VIEC_CAN_LAM Detailed Handoff Rule

### Completed

- Updated `AGENTS.md` so every future `VIEC_CAN_LAM.md` item must include detailed execution guidance, not only a task title.
- Updated `prompts/README.md` and all active prompts (`08a` through `10`) so prompt handoff requires mini-runbooks in `VIEC_CAN_LAM.md`.
- Added a concrete writing template to `VIEC_CAN_LAM.md` covering preparation, steps, configuration/check locations, completion criteria, and related docs.

### Tests and Checks

- Documentation/prompt-only update; ran Prettier check on changed markdown files.
