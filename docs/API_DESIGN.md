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
- `GET /api/v1/auth/oauth/google`
- `GET /api/v1/auth/oauth/google/callback`
- `GET /api/v1/auth/oauth/facebook`
- `GET /api/v1/auth/oauth/facebook/callback`

Implemented in Phase 2: register, login, logout, refresh, capabilities, CSRF token exchange, forgot password, reset password, verify email, me, sessions, revoke one session, revoke all sessions.

Implemented in Phase 7A: Google/Facebook OAuth start and callback routes validate safe `returnTo` state and reject open redirects. Provider authorization redirects are available when client IDs are configured. Callback token exchange/account linking is intentionally held behind a `ServiceUnavailableException` until account-linking rules are confirmed.

Local development note: forgot password and register responses may include development-only reset/verification tokens while SMTP delivery is not wired. Production must deliver these tokens by email and must not return them in API payloads.

Planned system parameter behavior: registration and login endpoints must check admin-managed runtime settings before performing mutations. When registration is disabled, `POST /api/v1/auth/register` returns a clear disabled-flow error. When login is disabled, authenticated entry points should be blocked and public/read-only browsing can remain available according to the configured mode.

OAuth behavior [NEW]: Google and Facebook login routes reuse the existing auth module and validate `returnTo` as a relative same-origin path or an explicitly allowlisted app URL. Provider tokens, authorization codes, cookies, and secrets must never be returned in API payloads or audit metadata. Full provider callback exchange and account linking still need confirmation before activation.

### User Profile and Handles

- `GET /api/v1/users/handle-check?handle=...`
- `PATCH /api/v1/users/me/handle`

Planned: user handles are globally unique, user-chosen identifiers similar to TikTok IDs. Public album/site routes should include the handle so duplicate album names across different users remain unambiguous.

### Public Home, Featured Albums, And Search [NEW]

- `GET /api/v1/public/home`
- `GET /api/v1/public/albums/featured?window=today|week`
- `GET /api/v1/albums/search?ageMin=...&ageMax=...&region=...&from=...&to=...&venue=...&theme=...`

Implemented in Phase 7A: the web root uses public home data instead of redirecting to login. Public home and featured endpoints return only albums with `visibility=public`. Link-only/unlisted albums can be opened by direct album link but do not appear in public home, featured lists, or authenticated search. Authenticated album search supports safe optional metadata filters and returns only public albums. Private albums are never discoverable outside owner/admin contexts.

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

Implemented in Phase 7A: album visibility is explicit and uses `public`, `unlisted`, and `private`. Public albums can be discovered. Unlisted albums require a direct link and are excluded from public listing endpoints. Private albums require owner membership or an authorized admin/support context.

### Album Wishes And Reactions [NEW]

- `GET /api/v1/public/albums/:albumId/wishes`
- `POST /api/v1/albums/:albumId/wishes`
- `DELETE /api/v1/albums/:albumId/wishes/:wishId`
- `GET /api/v1/public/albums/:albumId/reactions`
- `POST /api/v1/albums/:albumId/reactions`
- `DELETE /api/v1/albums/:albumId/reactions/:reactionId`
- `GET /api/v1/tenants/:tenantId/albums/:albumId/reaction-symbols`
- `PATCH /api/v1/tenants/:tenantId/albums/:albumId/reaction-symbols`

Implemented in Phase 7A: wish/reaction mutations require an authenticated user. Anonymous users are redirected to login with a safe `redirect=/albums/:albumId?intent=...` path and return to the same album after login. Reaction symbols are album-configured with safe defaults. The API validates symbol keys, applies route-level rate limits, enforces one active wish per user per album, enforces one reaction per user per symbol per album, and exposes only safe display data on public reads.

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

- `GET /api/v1/scale/catalog` (public): returns the B2C/B2B plan catalog, add-ons, and required feature flag keys.
- `GET /api/v1/scale/handles/availability?handle=...` (public): validates and checks a public user handle.
- `GET /api/v1/scale/me`: returns the authenticated user's handle and tenant scale summaries.
- `PATCH /api/v1/scale/me/handle`: updates the authenticated user's globally unique public handle.
- `GET /api/v1/scale/tenants/:tenantId/summary`: returns plan, quota, usage, enabled gated features, and canonical handle-based album URL template for a tenant the user can access.
- `POST /api/v1/scale/analytics/events` (public-safe): records `gallery_view` or `media_download` only when the album is public or the authenticated user owns the tenant.
- `GET /api/v1/scale/admin/overview`: admin-only operational counts and the scale catalog.
- `POST /api/v1/scale/admin/entitlements`: admin-only manual feature/storage entitlement grant or revoke.
- `POST /api/v1/scale/admin/payment-events`: admin-only MoMo payment event placeholder with provider/event idempotency.
- `POST /api/v1/scale/admin/greeting-rules`: admin-only greeting rule foundation with audit logging.

Implemented in Phase 9 foundation: B2C couple package catalog, B2B studio subscription catalog, add-on catalog, feature flag mapping, admin-granted entitlements, user public handles, tenant quota summaries, API-managed media upload gates based on active tenant/user plan plus entitlements, analytics events, greeting rule placeholder, and idempotent payment-event storage.

Still gated/deferred: real MoMo checkout and signed webhook verification, customer self-service plan purchase, R2-backed direct upload sessions, and public route redirects to canonical handle URLs. Do not expose a public payment webhook until MoMo signature validation and replay protection are implemented.

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
