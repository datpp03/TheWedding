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

- Register, login, logout, refresh token rotation.
- Password reset, email verification, session management.
- RBAC base and audit log base.

## Phase 3: Tenant/Site

- Tenant CRUD, slug routing, public site page, settings, visibility.
- Tenant ownership and membership guards.

## Phase 4: Album & Media

- Album CRUD, media upload, bulk upload, gallery, lightbox, download permission.

## Phase 5: Theme Customization

- Theme presets, colors, layouts, live preview, save/activate.

## Phase 6: Admin Dashboard

- User, tenant, media, audit log, settings, reports.

## Phase 7: Media Processing Advanced

- Queue, thumbnails, optimization, video preview, media versions, editor placeholders.

## Phase 8: Enterprise Hardening

- MFA, feature flags, monitoring, backup, security audit, performance optimization.

## Phase 9: Scale Future

- Payment/subscription, custom domain, CDN, AI tagging, watermark, analytics.
