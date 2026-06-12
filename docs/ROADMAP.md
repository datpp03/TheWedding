# Roadmap

## Phase 0: Discovery & Architecture

Status: completed as documentation baseline.

- Analyze product requirements.
- Define MVP.
- Design architecture, database, API, security model, and delivery workflow.

## Phase 1: Project Setup

Status: completed for local scaffold and runtime verification.

- Monorepo, API, web, shared packages, config.
- Docker Compose for SQL Server and Redis.
- Env validation and CI templates.
- Local SQL Server `TheWedding` connection, migration, seed, lint, typecheck, test, build, and smoke run verified.

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
- Later hardening: broader e2e coverage against a running SQL Server, public album/media reads, custom domains, and richer theme-driven public site sections.

## Phase 4: Album & Media

Status: completed for MVP album/media.

- Completed: album CRUD, reorder, cover selection, visibility, and allow-download controls.
- Completed: single and bulk upload through API multipart form data, local development storage, randomized storage keys, MIME/extension/size validation, media list, metadata update, reorder, move, batch delete, authenticated file serving, and download permission checks.
- Completed: dashboard album/media management, drag/drop upload queue with retryable failure state, grid view, batch select/delete/move, cover selection, public gallery, responsive media grid, and keyboard lightbox.
- Completed: Phase 4 keeps `StorageService` provider-neutral and follows `docs/STORAGE_STRATEGY.md` for backend-generated keys and future S3-compatible/direct-upload expansion.
- Later hardening: resumable uploads, progress backed by XHR/fetch upload events, virus scanning, thumbnails, optimized variants, signed URLs, and CDN delivery.

## Phase 5: Theme Customization

- Theme presets, colors, layouts, live preview, save/activate.
- Support modern, energetic theme presets suitable for Gen Z couples while keeping public sites readable and media-focused.

## Phase 6: Admin Dashboard

- User, tenant, media, audit log, settings, reports.

## Phase 7: Media Processing Advanced

- Queue, thumbnails, optimization, video preview, media versions, editor placeholders.
- Add retryable media processing jobs, responsive image/video variants, storage usage accounting, and idempotent worker behavior.

## Phase 8: Enterprise Hardening

- MFA, feature flags, monitoring, backup, security audit, performance optimization.
- Add formal cross-device UI QA, layout-shift checks, and interaction performance checks for critical frontend flows.

## Phase 9: Scale Future

- Payment/subscription, custom domain, CDN, S3-compatible production storage, signed URL upload/download, React Native multipart upload sessions, AI tagging, watermark, analytics.
