# Roadmap

## Phase 0: Discovery & Architecture

Status: completed as documentation baseline.

- Analyze product requirements.
- Define MVP.
- Design architecture, database, API, security model, and delivery workflow.

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
- Later hardening: real SMTP delivery, MFA, advanced rate limits, and broader e2e security coverage.

## Phase 3: Tenant/Site

Status: completed for MVP tenant/site foundation.

- Completed: tenant CRUD, owner membership creation, slug availability, public slug route, settings, visibility, SEO/share metadata, and audit log writes.
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

## Priority Phase: CI/CD Docker VPS

Status: do before Phase 6 so the project can be viewed remotely on a VPS while development continues.

- Add a production deployment pipeline following `docs/guides/CI_CD_DOCKER_VPS.md`.
- Target flow: GitHub Actions builds API/Web Docker images, pushes them to Docker Hub or GHCR, the VPS pulls the new images, and Docker Compose restarts containers.
- Keep the existing CI checks as the quality gate before deploy.
- Add image tags for both `latest` and commit SHA so rollback can pin a previous image.
- Document required GitHub Secrets, VPS setup, `.env.production`, registry login, deployment verification, and rollback.

## Phase 6: Admin Dashboard

- User, tenant, media, audit log, settings, feature flags, reports.
- Add a runtime System Parameters screen for admins to manage feature gates without redeploying:
  - disable new user registration.
  - disable login globally and allow public/read-only browsing only.
  - toggle upload, download, public gallery, payment, and other feature availability.
  - audit every setting change and expose clear user-facing messages for disabled flows.

## Phase 7: Media Processing Advanced

- Queue, thumbnails, optimization, video preview, media versions, editor placeholders.
- Add retryable media processing jobs, responsive image/video variants, storage usage accounting, and idempotent worker behavior.
- Target image flow: user uploads the original, backend validates and resizes/compresses it, storage keeps the private original plus optimized versions, and the frontend displays the compressed/optimized asset by default.

## Phase 8: Enterprise Hardening

- MFA, feature flags, monitoring, backup, security audit, performance optimization.
- Add formal cross-device UI QA, layout-shift checks, and interaction performance checks for critical frontend flows.
- Audit UI strings for i18n/l10n coverage and verify Vietnamese, English, and Japanese layouts do not overflow.
- Harden system parameter behavior with cache invalidation, fail-safe defaults, permission checks, audit logs, and tests for registration/login/read-only mode toggles.

## Phase 9: Scale Future

- Payment/subscription, custom domain, CDN, Cloudflare R2/S3-compatible production storage, signed URL upload/download, React Native multipart upload sessions, AI tagging, watermark, analytics.
- Use Cloudflare R2 as the first production object-storage target, while keeping the adapter S3-compatible for future provider swaps.
- Add documentation and guided setup steps for registering Cloudflare, creating an R2 bucket, generating credentials, configuring env vars, and validating uploads when this implementation step begins.
- Add subscription plans and premium feature gates that can unlock advanced utilities and increase photo/video storage quota.
- Add a payment provider adapter with MoMo as the first real provider; keep the interface ready for more providers later.
- Let admins manually unlock or revoke premium rights, storage quota boosts, and feature entitlements for any user or tenant.
- Add unique user public handles similar to TikTok IDs and make canonical public album URLs include the handle, for example `/@{userHandle}/{siteSlug}/albums/{albumSlugOrShortId}`.
