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

- Tenant CRUD, slug routing, public site page, settings, visibility.
- Tenant ownership and membership guards.
- Establish the first full UI/UX pass using `docs/UI_UX_DESIGN.md`: youthful visual direction, mobile-first responsive shell, smooth empty/loading/error states.

## Phase 4: Album & Media

- Album CRUD, media upload, bulk upload, gallery, lightbox, download permission.
- Build responsive gallery, upload, and lightbox interactions that feel smooth on phones, tablets, and desktop screens.

## Phase 5: Theme Customization

- Theme presets, colors, layouts, live preview, save/activate.
- Support modern, energetic theme presets suitable for Gen Z couples while keeping public sites readable and media-focused.

## Phase 6: Admin Dashboard

- User, tenant, media, audit log, settings, reports.

## Phase 7: Media Processing Advanced

- Queue, thumbnails, optimization, video preview, media versions, editor placeholders.

## Phase 8: Enterprise Hardening

- MFA, feature flags, monitoring, backup, security audit, performance optimization.
- Add formal cross-device UI QA, layout-shift checks, and interaction performance checks for critical frontend flows.

## Phase 9: Scale Future

- Payment/subscription, custom domain, CDN, AI tagging, watermark, analytics.
