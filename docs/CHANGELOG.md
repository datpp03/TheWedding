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
- Phase 6 admin dashboard MVP with stats, users, tenants, media moderation, audit log explorer, settings, feature flags, and system parameters screens.
- Admin API endpoints protected by `admin.access` plus audit logging for admin mutations.
- Runtime system parameters for disabling registration, login, uploads, downloads, public gallery, future payment checkout, and maintenance messages.
- Backend enforcement for disabled registration/login/upload/download/public-gallery flows.
- Admin i18n keys for Vietnamese, English, and Japanese.
- Permission guard tests, disabled-flow tests, and admin i18n smoke coverage.

### Changed

- Uploads now return queued media instead of marking originals ready immediately; normal display prefers optimized images when processing completes.
- Media storage accounting now includes generated derivatives in preparation for Phase 9 plan/storage enforcement.
- [NEW] Expanded future scale prompts to include B2C SaaS plans, B2B studio workflows, add-ons, admin theme control, dynamic contextual themes, automated greetings, and UI design-gate verification.
- Reordered the remaining prompt workflow around the active Vercel + Render + Neon deployment path.
- Marked Docker VPS CI/CD as an optional later deployment track instead of the next required phase.
- Deferred Cloudflare R2 activation to Phase 9 until the S3/R2 adapter, signed URLs/upload sessions, tests, docs, and smoke tests are complete.
- Clarified that production should keep `STORAGE_PROVIDER=local` before R2 is implemented and verified.

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
