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

Planned system parameter behavior: registration and login endpoints must check admin-managed runtime settings before performing mutations. When registration is disabled, `POST /api/v1/auth/register` returns a clear disabled-flow error. When login is disabled, authenticated entry points should be blocked and public/read-only browsing can remain available according to the configured mode.

### User Profile and Handles

- `GET /api/v1/users/handle-check?handle=...`
- `PATCH /api/v1/users/me/handle`

Planned: user handles are globally unique, user-chosen identifiers similar to TikTok IDs. Public album/site routes should include the handle so duplicate album names across different users remain unambiguous.

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
- `GET /api/v1/public/users/:userHandle/sites/:siteSlug`
- `GET /api/v1/public/users/:userHandle/sites/:siteSlug/albums/:albumSlugOrId`

Implemented in Phase 3: tenant CRUD, owner membership creation, slug availability checks, settings and visibility updates, audit log writes for tenant mutations, and public site reads with private/password gates. Authenticated tenant endpoints only return tenants where the user is a member. Public site reads return full content for public sites, gated content for private/password-protected sites until a valid password is supplied, and 404 for missing or inactive sites.

Planned public URL direction: keep existing `/:siteSlug` routes during migration, then introduce canonical handle-based routes such as `/@{userHandle}/{siteSlug}/albums/{albumSlugOrShortId}`.

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
- `POST /api/v1/tenants/:tenantId/media/:mediaId/retry-processing`
- `DELETE /api/v1/tenants/:tenantId/media`
- `GET /api/v1/tenants/:tenantId/media/:mediaId/file`
- `GET /api/v1/tenants/:tenantId/media/:mediaId/download`
- `GET /api/v1/public/sites/:slug/gallery`
- `GET /api/v1/public/tenants/:tenantId/media/:mediaId/file`
- `GET /api/v1/public/tenants/:tenantId/media/:mediaId/download`

Implemented in Phase 4: tenant-scoped album CRUD, album reorder, cover selection, visibility, download controls, single and bulk upload through API multipart form data, media metadata update, media reorder, move, batch delete, authenticated media file serving, public gallery reads, lightbox media file serving, and download permission checks. Uploads validate MIME type, file extension, file size, tenant membership, and album ownership before storage writes. API responses do not expose raw storage keys.

Implemented in Phase 7: uploads create private original media, return `processingStatus=pending`, and enqueue media processing. Media DTOs include `optimizedUrl`, `thumbnailUrl`, `processingFailureReason`, and `processingAttempts`. Image processing creates thumbnail, gallery, and lightbox derivatives; normal display prefers optimized URLs while original downloads stay behind permission-checked download endpoints. Failed processing can be retried with `POST /api/v1/tenants/:tenantId/media/:mediaId/retry-processing`.

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

Planned theme expansion [NEW]:

- `GET /api/v1/tenants/:tenantId/albums/:albumId/theme`
- `PATCH /api/v1/tenants/:tenantId/albums/:albumId/theme`
- `GET /api/v1/admin/theme-settings`
- `PATCH /api/v1/admin/theme-settings`
- `GET /api/v1/contextual-theme/preview`
- `POST /api/v1/admin/contextual-theme-rules`
- `PATCH /api/v1/admin/contextual-theme-rules/:ruleId`

Album-level custom themes, global admin theme defaults, premium theme gates, and contextual theme rules should remain optional and feature-flagged until verified. Location/weather-based context must degrade safely when permission or provider data is unavailable.

### Automated Greetings [NEW]

- `GET /api/v1/tenants/:tenantId/greeting-rules`
- `POST /api/v1/tenants/:tenantId/greeting-rules`
- `PATCH /api/v1/tenants/:tenantId/greeting-rules/:ruleId`
- `DELETE /api/v1/tenants/:tenantId/greeting-rules/:ruleId`
- `GET /api/v1/public/sites/:slug/greetings/active`
- `GET /api/v1/admin/greeting-rules`
- `POST /api/v1/admin/greeting-rules`

Planned: greetings can trigger for birthdays, wedding anniversaries, holidays, proposal anniversaries, and custom dates. Greeting templates must use i18n/l10n keys and must support preview, enable/disable, and audit logging for admin-managed global rules.

### Admin

- `GET /api/v1/admin/stats`
- `GET /api/v1/admin/users`
- `GET /api/v1/admin/users/:id`
- `PATCH /api/v1/admin/users/:id/status`
- `PATCH /api/v1/admin/users/:id/roles`
- `GET /api/v1/admin/tenants`
- `GET /api/v1/admin/tenants/:id`
- `PATCH /api/v1/admin/tenants/:id/status`
- `GET /api/v1/admin/media`
- `PATCH /api/v1/admin/media/:id/moderation`
- `GET /api/v1/admin/audit-logs`
- `GET /api/v1/admin/audit-logs/:id`
- `GET /api/v1/admin/settings`
- `POST /api/v1/admin/settings`
- `GET /api/v1/admin/feature-flags`
- `POST /api/v1/admin/feature-flags`
- `GET /api/v1/admin/system-parameters`
- `PATCH /api/v1/admin/system-parameters`
- `GET /api/v1/admin/entitlements`
- `POST /api/v1/admin/entitlements`
- `DELETE /api/v1/admin/entitlements/:entitlementId`

Implemented in Phase 6: dashboard stats, paginated/filterable/sortable users, tenants, media moderation, audit log explorer, system settings upsert, feature flags upsert, and runtime system parameters. Admin endpoints require authenticated users with `admin.access`; mutation endpoints write audit logs.

System parameters are stored under `runtime.system_parameters`, validated with a schema, cached for short reads, invalidated on update, and fail closed to safe defaults if stored JSON is invalid. Current runtime controls include disabling new registration, disabling login, disabling uploads, disabling downloads, disabling public gallery reads, disabling payment checkout for future payment surfaces, and a maintenance message for disabled flows.

### Plans, Subscriptions, and Payments

- `GET /api/v1/plans`
- `GET /api/v1/subscription/me`
- `POST /api/v1/payments/momo/checkout`
- `POST /api/v1/payments/momo/webhook`
- `GET /api/v1/admin/plans`
- `POST /api/v1/admin/plans`
- `PATCH /api/v1/admin/plans/:planId`
- `GET /api/v1/admin/payments`

Planned: MoMo is the first payment provider behind a provider adapter. Subscriptions and admin-granted entitlements can unlock advanced features and increase media storage quota. [NEW] Plans should support B2C couple packages, B2B studio subscriptions, add-ons such as extra storage/custom domains/premium themes, and future value-added services such as AI and online editing.

### Studio/B2B [NEW]

- `GET /api/v1/studio/profile`
- `PATCH /api/v1/studio/profile`
- `GET /api/v1/studio/clients`
- `POST /api/v1/studio/clients`
- `GET /api/v1/studio/clients/:clientId`
- `PATCH /api/v1/studio/clients/:clientId`
- `POST /api/v1/studio/clients/:clientId/sites`
- `GET /api/v1/studio/clients/:clientId/albums`
- `POST /api/v1/studio/clients/:clientId/delivery-links`

Planned: studio APIs manage client delivery workflows while preserving tenant isolation and explicit ownership checks. Studio branding and higher quota behavior should be plan/entitlement-gated.
