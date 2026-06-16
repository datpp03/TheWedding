# Database Design

## Technology

PostgreSQL is the primary database. TypeORM is used for migrations and infrastructure entities. Domain entities remain ORM-free. Neon PostgreSQL Free is the first hosted database target for the low-cost MVP path.

## Core Tables

- `users`: account identity, profile, status, verification state, and unique public handle.
- `user_sessions`: refresh token hashes, device metadata, revocation status.
- `user_login_histories`: login result, IP, user agent, failure reason.
- `password_reset_tokens`, `email_verification_tokens`: one-time hashed tokens.
- `roles`, `permissions`, `user_roles`, `role_permissions`: RBAC and permission model.
- `tenants`, `tenant_members`: wedding sites and membership.
- `albums`: tenant album metadata, visibility, layout, cover, and user-facing slug.
- `media`: photo/video metadata, provider name, backend-generated storage keys, processing state, and user-facing original filename.
- `media_versions`: original, optimized, thumbnail, edited variants, each tied to provider storage keys.
- `themes`: tenant theme presets and customizations.
- `audit_logs`: sensitive actions and admin operations.
- `system_settings`, `feature_flags`: runtime configuration and feature availability controls.
- `storage_usage`: tenant storage accounting.
- `plans`, `plan_features`, `subscriptions`: plan catalog, premium feature gates, renewal state, and storage quota tiers.
- `payments`, `payment_events`: provider-agnostic payment records and webhook/event history, starting with MoMo.
- `entitlements`: admin-granted or subscription-granted feature unlocks and quota overrides for users or tenants.

## Planned SaaS, Studio, And Automation Tables [NEW]

The following tables are planned for future phases and should be added only when the corresponding feature slice is implemented:

- `studio_profiles`: studio/photographer business profile, branding settings, subscription link, and owner user.
- `studio_clients`: client records owned by a studio profile, optionally linked to tenant/site records.
- `studio_client_albums`: delivery/review relationship between studio clients and tenant albums when a studio manages multiple projects.
- `theme_system_settings`: admin-managed global theme defaults, primary brand colors, premium theme availability, and safe fallback config.
- `contextual_theme_rules`: day/night, weather, season, holiday, festival, event, and location-aware theme rules.
- `greeting_rules`: birthday, wedding anniversary, holiday, proposal anniversary, and custom greeting schedules.
- `greeting_events`: generated greeting occurrences, delivery status, and audit/debug metadata.

Design constraints:

- Keep couple-owned tenants and studio-managed clients isolated by explicit membership/ownership checks.
- Store contextual theme and greeting config as structured JSON validated by application schemas.
- Keep location/weather usage opt-in and never required for public gallery reads.
- Use feature flags or system parameters for contextual themes, automated greetings, and B2B studio rollout.

## Conventions

- UUID primary keys using PostgreSQL `uuid`.
- `createdAt` and `updatedAt` on all core tables.
- `deletedAt` for soft-deletable tables.
- JSON-like settings stored as `text` and validated by application schemas.
- Index every high-volume tenant lookup by `tenantId`, `albumId`, `createdAt`, and status fields.
- Keep `users.publicHandle` globally unique and mutable only through a validated profile/settings flow.
- Keep album slugs unique within the owning tenant or append a short stable album id when duplicate names would collide.

## Migration

Initial migration is located in `apps/api/src/database/migrations/1710000000000-InitialSchema.ts`.

## Phase 4 Media Storage Notes

- `albums.coverMediaId`, `albums.visibility`, `albums.allowDownload`, and `albums.sortOrder` drive the MVP album dashboard and public gallery.
- `media.storageProvider` and `media.storageKey` store backend-generated provider metadata only. User filenames are preserved in `media.originalFileName` for display/download names and are not trusted for paths.
- Local development writes originals under keys shaped like `tenants/{tenantId}/media/{mediaId}/original/{random}.{ext}` through the storage adapter.
- Public API media DTOs expose API file URLs, not raw object keys, so tenant, album visibility, and download permissions can be checked before bytes are served.
- `media_versions` records the original version plus generated derivatives.

## Phase 7 Media Processing Notes

- `media.processingStatus` moves through `pending`, `processing`, `ready`, and `failed`.
- `media.processingFailureReason` stores the latest failure summary for diagnosis and retry UI.
- `media.processingAttempts` increments when processing starts so operations can monitor repeated failures.
- `media_versions` has a unique `mediaId + versionType` constraint so retries update existing derivative rows instead of creating duplicates.
- Image version types currently include `thumbnail`, `gallery`, and `lightbox`; `video_preview` is metadata-only until a production worker adds frame extraction.
- `storage_usage` is recalculated after processing completes and includes derivative bytes, preparing the model for Phase 9 plan/storage enforcement.

## Planned System Parameters, Plans, and Public Paths

- `system_settings` should store global switches such as registration disabled, login disabled/read-only mode, upload disabled, download disabled, public gallery disabled, payment disabled, and maintenance banner copy. These settings need validation schemas, cache invalidation, admin-only writes, and audit logs.
- `feature_flags` should remain safe for gradual rollout and per-feature enablement, while subscription/entitlement checks decide whether a user can access premium functionality.
- `plans` define default storage quotas, max file sizes, and advanced features. `subscriptions` link users or tenants to active plans. `entitlements` allow admins to manually unlock features or quota for any user/tenant without requiring payment.
- Payment data should use a provider-agnostic model with `provider`, `providerTransactionId`, `amount`, `currency`, `status`, and raw webhook/event metadata. MoMo is the first provider; more providers should fit the same table/service interface.
- Canonical public album URLs should include the user handle, for example `/@{userHandle}/{siteSlug}/albums/{albumSlugOrShortId}`, so two users can have albums with the same display name without URL ambiguity.
- [NEW] B2C/B2B plans should distinguish couple packages, studio subscriptions, add-ons, and manually granted entitlements without hardcoding plan behavior into controllers.
- [NEW] Admin theme controls, contextual theme rules, and automated greeting rules must write audit logs and have safe defaults when malformed or disabled.

## Seeds

Seed script creates default roles, permissions, and role-permission assignments. Super admin creation reads from `SUPER_ADMIN_EMAIL` and `SUPER_ADMIN_PASSWORD`.
