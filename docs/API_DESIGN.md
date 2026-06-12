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

### Albums, Media, Themes

- `GET /api/v1/albums`
- `POST /api/v1/albums`
- `PATCH /api/v1/albums/:id`
- `DELETE /api/v1/albums/:id`
- `POST /api/v1/albums/reorder`
- `POST /api/v1/media/upload`
- `POST /api/v1/media/bulk-upload`
- `GET /api/v1/media/:id/download`
- `GET /api/v1/themes`
- `POST /api/v1/themes`
- `PATCH /api/v1/themes/:id`
- `POST /api/v1/themes/:id/activate`

### Admin

- `GET /api/v1/admin/dashboard`
- `GET /api/v1/admin/users`
- `GET /api/v1/admin/tenants`
- `GET /api/v1/admin/media`
- `GET /api/v1/admin/audit-logs`
- `GET /api/v1/admin/system-settings`
- `PATCH /api/v1/admin/system-settings`
