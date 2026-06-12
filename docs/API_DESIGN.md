# API Design

## Versioning

All HTTP endpoints are under `/api/v1`.

## Success Response

```json
{
  "success": true,
  "data": {},
  "message": "OK",
  "meta": {}
}
```

## Error Response

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input",
    "details": []
  }
}
```

## MVP Endpoint Groups

### Auth

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/logout`
- `POST /api/v1/auth/refresh`
- `GET /api/v1/auth/capabilities`
- `GET /api/v1/auth/csrf`
- `POST /api/v1/auth/forgot-password`
- `POST /api/v1/auth/reset-password`
- `POST /api/v1/auth/verify-email`
- `GET /api/v1/auth/me`
- `GET /api/v1/auth/sessions`
- `DELETE /api/v1/auth/sessions/:sessionId`
- `DELETE /api/v1/auth/sessions`

Implemented in Phase 2: register, login, logout, refresh, capabilities, CSRF token exchange, forgot password, reset password, verify email, me, sessions, revoke one session, revoke all sessions.

Local development note: forgot password and register responses may include development-only reset/verification tokens while SMTP delivery is not wired. Production must deliver these tokens by email and must not return them in API payloads.

### Tenants and Public Sites

- `GET /api/v1/tenants`
- `POST /api/v1/tenants`
- `GET /api/v1/tenants/slug-check?slug=...`
- `GET /api/v1/tenants/:tenantId`
- `PATCH /api/v1/tenants/:tenantId`
- `PATCH /api/v1/tenants/:tenantId/settings`
- `PATCH /api/v1/tenants/:tenantId/visibility`
- `DELETE /api/v1/tenants/:tenantId`
- `GET /api/v1/public/sites/:slug`
- `GET /api/v1/public/sites/:slug/albums`
- `GET /api/v1/public/sites/:slug/albums/:albumId/media`

Implemented in Phase 3: tenant CRUD, owner membership creation, slug availability checks, settings and visibility updates, audit log writes for tenant mutations, and public site reads with private/password gates. Authenticated tenant endpoints only return tenants where the user is a member. Public site reads return full content for public sites, gated content for private/password-protected sites until a valid password is supplied, and 404 for missing or inactive sites.

### Albums and Media

- `GET /api/v1/tenants/:tenantId/albums`
- `POST /api/v1/tenants/:tenantId/albums`
- `PATCH /api/v1/tenants/:tenantId/albums/reorder`
- `PATCH /api/v1/tenants/:tenantId/albums/:albumId`
- `PATCH /api/v1/tenants/:tenantId/albums/:albumId/cover`
- `DELETE /api/v1/tenants/:tenantId/albums/:albumId`
- `GET /api/v1/tenants/:tenantId/albums/:albumId/media`
- `POST /api/v1/tenants/:tenantId/media/upload`
- `POST /api/v1/tenants/:tenantId/media/bulk-upload`
- `PATCH /api/v1/tenants/:tenantId/media/reorder/:albumId`
- `PATCH /api/v1/tenants/:tenantId/media/:mediaId`
- `PATCH /api/v1/tenants/:tenantId/media/:mediaId/move`
- `DELETE /api/v1/tenants/:tenantId/media`
- `GET /api/v1/tenants/:tenantId/media/:mediaId/file`
- `GET /api/v1/tenants/:tenantId/media/:mediaId/download`
- `GET /api/v1/public/sites/:slug/gallery`
- `GET /api/v1/public/tenants/:tenantId/media/:mediaId/file`
- `GET /api/v1/public/tenants/:tenantId/media/:mediaId/download`

Implemented in Phase 4: tenant-scoped album CRUD, album reorder, cover selection, visibility, download controls, single and bulk upload through API multipart form data, media metadata update, media reorder, move, batch delete, authenticated media file serving, public gallery reads, lightbox media file serving, and download permission checks. Uploads validate MIME type, file extension, file size, tenant membership, and album ownership before storage writes. API responses do not expose raw storage keys.

### Themes

- `GET /api/v1/theme-presets`
- `POST /api/v1/theme-preview`
- `GET /api/v1/tenants/:tenantId/themes`
- `GET /api/v1/tenants/:tenantId/themes/active`
- `POST /api/v1/tenants/:tenantId/themes`
- `PATCH /api/v1/tenants/:tenantId/themes/:themeId`
- `PATCH /api/v1/tenants/:tenantId/themes/:themeId/activate`
- `POST /api/v1/tenants/:tenantId/themes/:themeId/clone`
- `POST /api/v1/tenants/:tenantId/themes/reset?presetId=...`

Implemented in Phase 5: shared theme presets, tenant-scoped create/update/preview, activate, clone, reset, active theme bootstrap, and audit log writes for create/update/activate/clone/reset. All tenant theme mutations verify tenant membership through the tenants application service. Public site reads include `activeTheme` when one exists; otherwise the web client falls back to the default preset.

### Admin

- `GET /api/v1/admin/dashboard`
- `GET /api/v1/admin/users`
- `GET /api/v1/admin/tenants`
- `GET /api/v1/admin/media`
- `GET /api/v1/admin/audit-logs`
- `GET /api/v1/admin/system-settings`
- `PATCH /api/v1/admin/system-settings`
