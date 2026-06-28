# Roadmap

## Phase 0: Discovery & Architecture

Status: completed as documentation baseline.

- Analyze product requirements.
- Define MVP.
- Design architecture, database, API, security model, and delivery workflow.
- [NEW] Maintain the living product/business/UI execution plan in `docs/PRODUCT_PLAN.md`.

## Product And UI Execution Gate [NEW]

Status: active for every future phase.

- Before implementing a product-facing feature, map it to the business model, target user workflow, feature gate/plan gate, and acceptance criteria in `docs/PRODUCT_PLAN.md`.
- Before implementing or changing a public route/content/metadata/custom-domain/discovery feature, map SEO/GEO requirements in `docs/SEO_GEO_GUIDELINES.md`: index policy, canonical, robots/noindex, sitemap, structured data, Open Graph, i18n metadata, and privacy boundaries.
- Before implementing UI, complete emotional screen analysis, layout/color/spacing/state proposal, and design signoff notes.
- Every UI surface must follow `docs/UI_UX_DESIGN.md`: clear accent color, responsive spacing, card hierarchy, complete interaction states, and i18n/l10n text checks for Vietnamese, English, and Japanese.
- Premium, B2B, contextual, greeting, payment, AI, and storage-heavy features should ship behind feature flags or admin-controlled enablement until verified.

## Phase 1: Project Setup

Status: completed for local scaffold and runtime verification.

- Monorepo, API, web, shared packages, config.
- Docker Compose for PostgreSQL and Redis.
- Env validation and CI templates.
- Local PostgreSQL connection, migration, seed, lint, typecheck, test, build, and smoke run verified.

## Phase 2: Auth & User

Status: completed for MVP auth. Email delivery is still provider-ready but SMTP sending is not implemented.

- Completed: register, login, logout, current user, session list, revoke session, revoke all sessions, refresh token rotation.
- Completed: forgot password, reset password, email verification, CSRF token exchange, route protection for dashboard/admin, auth audit log writes.
- Completed: RBAC payload base through role and permission lookup.
- Completed: auth unit tests and frontend login/register/forgot/reset/verify wiring.
- Later hardening: real SMTP delivery, MFA, persistent browser session restoration, advanced rate limits, and broader e2e security coverage.
- Planned: keep users signed in after closing/reopening the browser or returning through the public home page while the refresh token cookie is still valid. The web app should quietly restore `/auth/me` state or refresh the access token on app boot without redirecting the public home away from discovery, and explicit logout/session revoke/revoke-all must still clear persisted access immediately.

## Phase 3: Tenant/Site

Status: completed for MVP tenant/site foundation.

- Completed: tenant CRUD, owner membership creation, slug availability, public slug route, settings, visibility, SEO/share metadata, and audit log writes.
- Later SEO/GEO hardening: canonical route migration with user handle/custom domain, sitemap generation, structured data, AI crawler policy, and noindex coverage for protected routes.
- Completed: authenticated tenant isolation through membership-scoped repository reads and mutation checks.
- Completed: dashboard onboarding, tenant settings page, public site shell, and private/password access gates with mobile-first loading/error/success states.
- Later hardening: broader e2e coverage against a running PostgreSQL database, public album/media reads, custom domains, and richer theme-driven public site sections.

## Phase 4: Album & Media

Status: completed for MVP album/media.

- Completed: album CRUD, reorder, cover selection, visibility, and allow-download controls.
- Completed: single and bulk upload through API multipart form data, local development storage, randomized storage keys, MIME/extension/size validation, media list, metadata update, reorder, move, batch delete, authenticated file serving, and download permission checks.
- Completed: dashboard album/media management, drag/drop upload queue with retryable failure state, grid view, batch select/delete/move, cover selection, public gallery, responsive media grid, and keyboard lightbox.
- Completed: Phase 4 keeps `StorageService` provider-neutral and follows `docs/STORAGE_STRATEGY.md` for backend-generated keys and future S3-compatible/direct-upload expansion.
- Later hardening: resumable uploads, progress backed by XHR/fetch upload events, virus scanning, thumbnails, optimized variants, signed URLs, and CDN delivery.

## Living User Guide

Status: active.

- Vietnamese app usage guide lives at `docs/HUONG_DAN_SU_DUNG.md`.
- Every future phase must update this guide when it changes user-facing behavior, routes, local test accounts, permissions, or known limitations.
- Prompt completion is not considered done until this guide is checked and updated when relevant.

## Internationalization and Localization

Status: started in Phase 5 for the theme dashboard.

- Added locale dictionaries in `apps/web/src/lib/i18n/locales.ts` with stable keys and fallback-to-English/missing-key behavior.
- Extracted new theme dashboard visible text into language keys.
- Initial supported locales: Vietnamese (`vi`), English (`en`), and Japanese (`ja`).
- Add locale selection and persistence where appropriate for authenticated dashboard, admin, auth pages, and public wedding sites.
- Make every future frontend feature add/update translation keys instead of hard-coding visible strings.
- Document fallback behavior, missing-key handling, date/number formatting, and QA checks for all three initial locales.

## Phase 5: Theme Customization

Status: completed for MVP theme customization.

- Completed: shared theme presets, colors, layout, typography, animation, validation, tenant theme create/update/preview/activate/clone/reset, active theme in public site response, audit events, and backend tests.
- Completed: dashboard preset gallery, color swatches, layout/typography controls, live preview, save/activate/reset/clone actions, loading/error/success/dirty states, and responsive layouts.
- Completed: public site applies active theme colors, layout density, radius, and typography.
- Completed: i18n/l10n foundation for new theme UI in `vi`, `en`, and `ja`.
- Later hardening: locale picker/persistence across the whole app, visual regression screenshots in CI, richer public site section theming, and theme CSS sandboxing.
- [NEW] Future expansion: album-level custom theme overrides, premium theme gates, admin global theme defaults, contextual theme rules, and automated greeting visuals.

## Deployment Track: Vercel + Render + Neon

Status: active free-hosting path for current production testing.

- Web runs on Vercel with the custom domain `thewedding.d-ajt.app`.
- API runs on Render with the custom domain `thewedding-api.d-ajt.app`.
- Database runs on Neon PostgreSQL.
- Render and Vercel auto-deploy from `main`.
- Cloudflare R2/S3-compatible adapter is implemented for API-managed uploads; switch production to `STORAGE_PROVIDER=r2` after Cloudflare bucket/access keys are configured and smoke-tested.

## Optional Deployment Track: CI/CD Docker VPS

Status: optional later path if the project moves from Vercel/Render to self-hosted VPS.

- Add or finish a production deployment pipeline following `docs/guides/CI_CD_DOCKER_VPS.md`.
- Target flow: GitHub Actions builds API/Web Docker images, pushes them to Docker Hub or GHCR, the VPS pulls the new images, and Docker Compose restarts containers.
- Keep the existing CI checks as the quality gate before deploy.
- Add image tags for both `latest` and commit SHA so rollback can pin a previous image.
- Document required GitHub Secrets, VPS setup, `.env.production`, registry login, deployment verification, and rollback.

## Phase 6: Admin Dashboard

Status: completed for MVP admin operations.

- Completed: admin stats, users list/detail/status/roles, tenants list/detail/status, media moderation, audit logs, system settings, feature flags, and system parameters API.
- Completed: `admin.access` permission guard enforcement and audit log writes for admin mutations.
- Completed: runtime system parameter controls for disabling new registration, login, upload, download, public gallery, payment checkout placeholder, and maintenance messages.
- Completed: responsive admin UI pages for stats, users, tenants, media moderation, audit logs, settings, feature flags, and system parameters.
- Completed: admin i18n keys for Vietnamese, English, and Japanese.
- Later hardening: richer role editor UX, advanced audit export, admin reports, payment/entitlement admin workflows, and e2e coverage against a running database.
- [NEW] Later admin expansion: global brand/theme controls, premium theme availability, studio account oversight, contextual event/theme configuration, and automated greeting rule management.

## Phase 7: Media Processing Advanced

Status: completed for MVP image processing and retry monitoring.

- Completed: BullMQ/Redis-backed `MediaProcessingService` with local inline fallback when Redis is not configured.
- Completed: upload flow now stores private originals, marks media queued, enqueues processing, and returns processing status to the UI.
- Completed: Sharp image processing for thumbnail, gallery, and lightbox WebP derivatives with backend-generated storage keys.
- Completed: idempotent `media_versions` upsert through unique `mediaId + versionType`, retry/failure reason tracking, and storage usage recalculation after processing.
- Completed: owner media grid shows queued, processing, ready, and failed/retry states with polling; public gallery prefers optimized derivatives and uses placeholders while processing.
- Completed: media processing copy is available in Vietnamese, English, and Japanese locale keys.
- Completed: admin media dashboard can inspect processing status.
- Current limitation: video preview is metadata-only until a production worker image includes ffmpeg or another media extraction backend.
- Later expansion: online editing hooks, AI quality optimization, malware scanning, R2/CDN publication, and paid quota enforcement remain planned for Phase 8/9.

## Public Album And Social Expansion Track [NEW]

Status: Phase 7A implemented for MVP public discovery, social interactions, OAuth-safe redirect foundation, authenticated search, and audit tracing. Remaining items are noted below.

### Expansion Phase 1: Security And Extensible Structure [NEW]

- Completed: album privacy levels are `public`, `unlisted`, and `private`.
- Completed: public discovery reads only `public` albums.
- Completed: `unlisted` albums are accessible by direct album link and excluded from home/search listings.
- Completed: `private` albums are hidden from public detail/discovery and remain owner/admin scoped.
- Completed: migration/model/API contracts for wishes, reactions, reaction symbols, featured entries, OAuth identities, and search metadata.
- Completed: sensitive values stay covered by Phase 8 audit redaction.

### Expansion Phase 2: Public Home And Featured Albums [NEW]

- Completed: first web page is a public home page, not the login page.
- Completed: public home shows featured albums for today and week.
- Planned: public home should detect an existing authenticated session and show signed-in navigation/action state without leaking private tenant/admin data or making auth-only content indexable.
- Define deterministic ranking or admin curation rules for featured albums.
- Completed: current deterministic ranking uses algorithmic recency with table support for later admin/owner curation.
- Completed: responsive featured album cards and empty state.
- Completed: login/register remain secondary actions.

### Expansion Phase 3: Album Wishes And Reactions [NEW]

- Completed: authenticated users can send one active wish per album.
- Completed: authenticated users can react once per allowed symbol per album.
- Completed: unauthenticated users redirect to login and return to the exact album/action context.
- Completed: rate limits, duplicate rules, and audit hooks. Full owner moderation UI remains planned.

### Expansion Phase 4: Google/Facebook OAuth And Return-To-Album [NEW]

- Completed: Google/Facebook OAuth routes validate safe `returnTo` and reject open redirects.
- Completed: provider start redirects are available when client IDs are configured.
- Remaining: provider callback exchange/account linking is disabled until verified-email linking rules are confirmed.

### Expansion Phase 5: Advanced Album Search [NEW]

- Completed: after login, users can call authenticated album search by approved optional metadata criteria.
- Completed: search does not reveal private or unlisted albums.
- Document which metadata fields are owner-provided, inferred, optional, or pending confirmation.
- Add pagination, sorting, and safe query limits.

### Expansion Phase 6: Audit Log And Activity Administration [NEW]

- Record security/admin-relevant events for OAuth login, failed interaction attempts, wish/reaction moderation, featured album curation, privacy changes, and search abuse signals.
- Use audit logs for security, statistics, and administration without recording sensitive data.
- Add admin filtering for the new event types where useful.
- Document retention and redaction rules before exposing export/reporting.

## Phase 8: Enterprise Hardening

- Status: partially completed for backend security foundations and documentation.
- Completed: MFA-ready user model fields and migration, global/request-specific rate limiting, request correlation IDs, audit metadata redaction, tenant upload quota checks, stricter upload abuse tests, invalid CSRF tests, runtime system parameter fail-safe/cache invalidation tests, and backup/restore documentation.
- Remaining: production monitoring dashboard, malware scanning integration, full browser responsive screenshot matrix, and OAuth/wish/reaction checks after those modules are implemented.
- MFA, feature flags, monitoring, backup, security audit, performance optimization.
- Add formal cross-device UI QA, layout-shift checks, and interaction performance checks for critical frontend flows.
- Audit UI strings for i18n/l10n coverage and verify Vietnamese, English, and Japanese layouts do not overflow.
- Harden system parameter behavior with cache invalidation, fail-safe defaults, permission checks, audit logs, and tests for registration/login/read-only mode toggles.
- [NEW] Add UI/UX gate enforcement to QA: every changed screen must document first-look hierarchy, accent color, spacing, card hierarchy, responsive behavior, and all loading/empty/error/success states.
- [NEW] Include OAuth redirect, album privacy, public discovery, wish/reaction authorization, and audit redaction checks once the expansion track is implemented.

## Phase 9: Scale Future

- Status: foundation partially implemented; production providers and large upload/storage flows remain gated.
- Completed foundation: shared B2C/B2B plan catalog, add-on catalog, feature flag mapping, plan/entitlement gate logic, admin entitlement grant API/UI, user public handle API, tenant scale summary, API-managed media upload enforcement for plan storage/photo/video/file-size/video gates, analytics events, greeting rule placeholder, idempotent MoMo payment-event storage, studio/custom-domain placeholder tables, admin Scale page, and S3-compatible/R2 storage adapter for API-managed uploads.
- Payment/subscription, custom domain, CDN, Cloudflare R2/S3-compatible production storage, signed URL upload/download, React Native multipart upload sessions, AI tagging, watermark, analytics.
- Cloudflare R2 adapter can be enabled early for API-managed uploads after bucket/access key setup and production smoke tests. Direct upload sessions, multipart upload, CDN-first derivative delivery, migration tooling, and rollback automation remain Phase 9 follow-up work.
- Use Cloudflare R2 as the first production object-storage target, while keeping the adapter S3-compatible for future provider swaps.
- Add documentation and guided setup steps for registering Cloudflare, creating an R2 bucket, generating credentials, configuring env vars, and validating uploads when this implementation step begins.
- Add subscription plans and premium feature gates that can unlock advanced utilities and increase photo/video storage quota.
- Add a payment provider adapter with MoMo as the first real provider; keep the interface ready for more providers later.
- Let admins manually unlock or revoke premium rights, storage quota boosts, and feature entitlements for any user or tenant.
- Add unique user public handles similar to TikTok IDs and make canonical public album URLs include the handle, for example `/@{userHandle}/{siteSlug}/albums/{albumSlugOrShortId}`.
- Add advanced album discovery/search foundations only after privacy rules and authenticated search boundaries are defined.
- [NEW] Formalize B2C SaaS packages by storage, media count, video support, premium themes, custom domains, privacy/security, and analytics.
- [NEW] Add B2B studio subscription foundations: studio profile, client list, client album delivery workflow, studio branding, and higher storage quotas.
- [NEW] Add value-added service gates for extra storage, custom domain, premium themes, watermark, online editing, AI classification/search/quality optimization, and advanced security.
- [NEW] Add admin controls for global theme defaults and premium theme availability if not completed earlier.
- [NEW] Add contextual theme and automated greeting foundations behind feature flags, with opt-out controls and safe fallbacks when location/weather data is unavailable.
- Remaining before Phase 9 can be called production-complete: real MoMo checkout and signed webhook verification, signed URL/upload sessions, multipart uploads, local-to-R2 migration, CDN/public derivative delivery hardening, canonical public handle routes/redirects, full studio client workflow, watermark processing hook, AI tag adapter, and browser responsive smoke screenshots.

## Post-MVP Growth Track [NEW]

Status: planned after the core SaaS foundation is stable.

- Rich B2B studio workspace: team members, client pipeline, approval/review flow, delivery status, and professional reporting.
- Dynamic contextual themes: day/night, weather, season, holiday, festival, and event-aware presentation with reduced-motion support.
- Automated greetings: birthdays, wedding anniversaries, Valentine, Tet, proposal anniversaries, and custom celebration rules.
- Premium theme marketplace and seasonal theme packs.
- Online photo/video editing, AI highlight selection, AI search, and image quality optimization.
