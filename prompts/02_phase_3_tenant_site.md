# Prompt 02: Phase 3 Tenant & Public Site

PLEASE IMPLEMENT THIS PROMPT.

Ban dang lam trong repo `D:\AJT\TheWedding`. Hay bat dau Phase 3.

## Muc Tieu

Xay dung tenant/site foundation: moi cap doi co mot wedding site rieng voi slug public, settings, visibility, SEO/share metadata, membership guard va dashboard quan ly co UX tot.

## Backend Tasks

- Implement tenants module theo Clean Architecture:
  - domain entity/value object/rules.
  - application use cases.
  - TypeORM repository.
  - presentation controllers/DTOs.
- Endpoints:
  - `GET /api/v1/tenants`
  - `POST /api/v1/tenants`
  - `GET /api/v1/tenants/:tenantId`
  - `PATCH /api/v1/tenants/:tenantId`
  - `DELETE /api/v1/tenants/:tenantId`
  - `GET /api/v1/tenants/slug-check?slug=...`
  - `PATCH /api/v1/tenants/:tenantId/settings`
  - `PATCH /api/v1/tenants/:tenantId/visibility`
  - `GET /api/v1/public/sites/:slug`
- Enforce tenant isolation:
  - User phai la owner/member moi duoc CRUD.
  - Public endpoint chi tra data hop le theo visibility/password rules.
- Create tenant member owner on tenant creation.
- Audit tenant create/update/delete/visibility changes.

## Frontend Tasks

- Dashboard tenant onboarding:
  - Empty state dep, tre trung, mobile-first.
  - Create site flow voi slug preview.
  - Slug availability feedback.
- Tenant settings page:
  - Name, couple names, event date, description, visibility.
  - SEO/share metadata fields.
  - Save state/loading/error/success.
- Public route `(public)/[siteSlug]`:
  - Render public wedding site shell tu API.
  - Neu private/password-protected, hien access gate.
- UI direction:
  - Follow `docs/UI_UX_DESIGN.md`.
  - Tre trung, nang dong, phu hop Gen Z.
  - Responsive 320px -> desktop.

## Tests

- Backend unit tests cho tenant access rules.
- Backend e2e/smoke:
  - create tenant.
  - slug duplicate rejected.
  - cross-tenant access denied.
  - public slug returns correct data.
- Frontend smoke:
  - dashboard create site.
  - tenant settings.
  - public site.
- Chay `pnpm format:check`, `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`.

## Docs

- Cap nhat API, roadmap, development log, changelog.
- Neu co env/config moi, cap nhat environment docs.

## Acceptance Criteria

- User login co the tao wedding site va xem public slug page.
- Tenant access guard thuc su chan cross-tenant.
- UI responsive va co loading/empty/error/success states.
- Commit va push len `origin/main`.
