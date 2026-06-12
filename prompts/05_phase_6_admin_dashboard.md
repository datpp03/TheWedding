# Prompt 05: Phase 6 Admin Dashboard

PLEASE IMPLEMENT THIS PROMPT.

Ban dang lam trong repo `D:\AJT\TheWedding`. Hay bat dau Phase 6.

## Muc Tieu

Xay dung admin dashboard cho quan ly users, tenants, media, audit logs, system settings, feature flags va dashboard stats.

## Backend Tasks

- Implement admin endpoints:
  - dashboard stats.
  - users list/detail/update status/roles.
  - tenants list/detail/status.
  - media moderation/list.
  - audit logs list/filter/detail.
  - system settings read/update.
  - feature flags read/update.
- Enforce `ADMIN_ACCESS` va permission guard.
- Audit all admin actions.
- Add pagination, filtering, sorting cho data-heavy endpoints.

## Frontend Tasks

- Admin shell and navigation.
- Dashboard stats.
- Users table/detail actions.
- Tenants table/detail actions.
- Media moderation table/grid.
- Audit log explorer.
- Settings/feature flags forms.
- Responsive admin UX:
  - Desktop data tables.
  - Tablet/mobile fallback with stacked rows/cards/action menus.
  - No overflow on small screens.

## Tests

- Permission denial tests.
- Admin access success tests.
- Pagination/filter tests.
- Frontend smoke for admin pages.
- Run full verification.

## Docs

- Update API, role/permission docs, roadmap, development log, changelog.

## Acceptance Criteria

- Super admin can manage core resources.
- Non-admin users are denied.
- Admin UI is usable on desktop and has mobile fallback.
- Commit va push len `origin/main`.
