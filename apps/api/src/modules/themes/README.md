# Themes Module

Owns theme presets, tenant customizations, active theme selection, preview, clone, and reset behavior.

## Phase 5 Capability

- Presets live in `packages/shared/src/theme.ts` with stable preset ids and translation keys.
- `ThemesService` validates theme JSON/settings at the application layer before persistence.
- Tenant access is enforced by calling `TenantsService.get()` before tenant theme reads and mutations.
- Mutations write audit events for `theme.created`, `theme.created_activated`, `theme.updated`, `theme.activated`, `theme.cloned`, and `theme.reset`.
- Public site reads include an active theme through the tenant repository. If no row exists, the frontend applies `DEFAULT_THEME_PRESET_ID`.

## Endpoint Summary

- `GET /api/v1/theme-presets`
- `POST /api/v1/theme-preview`
- `GET /api/v1/tenants/:tenantId/themes`
- `GET /api/v1/tenants/:tenantId/themes/active`
- `POST /api/v1/tenants/:tenantId/themes`
- `PATCH /api/v1/tenants/:tenantId/themes/:themeId`
- `PATCH /api/v1/tenants/:tenantId/themes/:themeId/activate`
- `POST /api/v1/tenants/:tenantId/themes/:themeId/clone`
- `POST /api/v1/tenants/:tenantId/themes/reset?presetId=...`
