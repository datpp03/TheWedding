# Development Log

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
