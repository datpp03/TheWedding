# Database Design

## Technology

PostgreSQL is the primary database. TypeORM is used for migrations and infrastructure entities. Domain entities remain ORM-free. Neon PostgreSQL Free is the first hosted database target for the low-cost MVP path.

## Core Tables

- `users`: account identity, profile, status, verification state, MFA-ready enrollment fields, and unique public handle.
- `oauth_accounts`: external login identities such as Google or Facebook, linked to a user through verified provider identity rules.
- `user_sessions`: refresh token hashes, device metadata, revocation status.
- `user_login_histories`: login result, IP, user agent, failure reason.
- `password_reset_tokens`, `email_verification_tokens`: one-time hashed tokens.
- `roles`, `permissions`, `user_roles`, `role_permissions`: RBAC and permission model.
- `tenants`, `tenant_members`: wedding sites and membership.
- `albums`: tenant album metadata, visibility, layout, cover, and user-facing slug.
- `album_wishes`: authenticated user wishes/comments attached to an album, with moderation/status fields if public display requires review.
- `album_reactions`: authenticated user reactions attached to an album and a validated album/theme symbol key.
- `album_reaction_symbols`: optional album-level allowed symbol set when the default theme symbols are overridden.
- `album_featured_entries`: curated or computed featured album entries for daily/weekly public discovery.
- `album_search_metadata`: normalized optional metadata for discovery filters such as age range, region, time window, venue/location, and theme, added only when the feature slice defines safe source fields.
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
- Store album visibility with explicit values: `public`, `unlisted`, and `private`.
- Index public discovery by album visibility, featured window, created/published dates, region/time/theme fields when implemented, and moderation/status fields.
- Ensure private and unlisted album rows cannot be returned by search/listing queries unless the repository method explicitly verifies owner/admin access or direct-link access.

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

## Phase 8 Security Hardening Notes

- `users.mfaEnabledAt`, `users.mfaMethod`, and `users.mfaSecretEncrypted` provide MFA-ready storage for a future TOTP enrollment and challenge flow. MFA secrets must be encrypted before persistence and must not be logged or included in audit metadata.
- Uploads enforce tenant quota checks before writing to storage. Phase 8 used `TENANT_STORAGE_QUOTA_BYTES` as the fallback ceiling; Phase 9 API-managed uploads now resolve active tenant/user plan limits plus admin entitlements for storage bytes, photo count, video count, file size, and video-upload access.
- Audit metadata is redacted before it is saved so passwords, tokens, cookies, OTP/MFA values, OAuth authorization codes, provider secrets, and raw sensitive headers are not retained in `audit_logs.metadataJson`.

## Planned System Parameters, Plans, and Public Paths

- `system_settings` should store global switches such as registration disabled, login disabled/read-only mode, upload disabled, download disabled, public gallery disabled, payment disabled, and maintenance banner copy. These settings need validation schemas, cache invalidation, admin-only writes, and audit logs.
- `feature_flags` should remain safe for gradual rollout and per-feature enablement, while subscription/entitlement checks decide whether a user can access premium functionality.
- `plans` define default storage quotas, max file sizes, and advanced features. `subscriptions` link users or tenants to active plans. `entitlements` allow admins to manually unlock features or quota for any user/tenant without requiring payment.
- Payment data should use a provider-agnostic model with `provider`, `providerTransactionId`, `amount`, `currency`, `status`, and raw webhook/event metadata. MoMo is the first provider; more providers should fit the same table/service interface.
- Canonical public album URLs should include the user handle, for example `/@{userHandle}/{siteSlug}/albums/{albumSlugOrShortId}`, so two users can have albums with the same display name without URL ambiguity.
- [NEW] B2C/B2B plans should distinguish couple packages, studio subscriptions, add-ons, and manually granted entitlements without hardcoding plan behavior into controllers.
- [NEW] Admin theme controls, contextual theme rules, and automated greeting rules must write audit logs and have safe defaults when malformed or disabled.

## Planned Public Album, OAuth, And Interaction Tables [NEW]

- `oauth_accounts` should store provider name, provider subject/id, linked user id, verified email snapshot when available, timestamps, and status. Do not store access tokens or refresh tokens unless a later feature explicitly needs offline provider access and has encrypted storage plus rotation.
- `album_wishes` should store album id, tenant id, user id, safe display name snapshot, message body, moderation status, created/updated timestamps, and soft delete fields.
- `album_reactions` should store album id, tenant id, user id, symbol key, created/updated timestamps, and uniqueness constraints based on the confirmed product rule.
- `album_reaction_symbols` should store allowed symbol keys per album/theme, using validated keys and safe icon metadata rather than arbitrary HTML.
- `album_featured_entries` should support daily/weekly windows, source (`algorithm`, `admin`, `owner_opt_in`), score/order, and audit-friendly metadata without exposing private signals.
- `album_search_metadata` should be optional and owner-controlled where privacy-sensitive. Search should not infer or expose age, region, venue, or event dates without a documented source and consent rule.

Audit log metadata for these features must not store passwords, raw tokens, cookies, OTP codes, OAuth authorization codes, provider secrets, or raw sensitive request headers.

## Phase 7A Public Album And Social Notes

- Migration `1710000009000-PublicAlbumSocialExpansion.ts` adds `oauth_accounts`, `album_featured_entries`, `album_wishes`, `album_reactions`, `album_reaction_symbols`, and `album_search_metadata`.
- `album_wishes` enforces one active wish per user per album.
- `album_reactions` enforces one active reaction per user, album, and symbol key.
- `album_reaction_symbols` stores validated symbol keys and display glyph labels per album. If no rows exist, the API falls back to a safe default symbol set.
- `album_featured_entries` supports future admin/owner curation. Current featured ranking falls back to deterministic algorithmic ordering of public albums by recency.
- `album_search_metadata` is optional and owner-opt-in-ready. Search currently returns public albums only and does not expose private or unlisted albums.
- `oauth_accounts` stores provider identity metadata only. Provider access/refresh tokens are not stored in this slice.

## Phase 9 Scale Foundation Notes

- Migration `1710000010000-Phase9ScaleFoundation.ts` adds `user_public_handles`, `plan_subscriptions`, `entitlements`, `payment_events`, `custom_domains`, `studio_profiles`, `studio_clients`, `analytics_events`, and `greeting_rules`.
- `user_public_handles.handle` is globally unique and validated as a TikTok-like public id for canonical album URLs such as `/@{userHandle}/{siteSlug}/albums/{albumSlugOrShortId}`.
- `plan_subscriptions` stores active plan state for either a tenant or user. Plan behavior is resolved from shared catalog constants, not hardcoded in controllers.
- `entitlements` lets admins manually grant/revoke feature keys or storage boosts for a `tenant` or `user`. Entitlement mutations write audit logs.
- Media upload policy is resolved in the application layer from `plan_subscriptions`, `entitlements`, enabled feature flags, and current `media` usage before any object is written to local/R2 storage.
- `payment_events` uses a unique `(provider, providerEventId)` index for idempotent MoMo event handling. It is an internal placeholder until signed webhook verification is added.
- `custom_domains` stores verification status and token foundation only; DNS validation and routing are still deferred.
- `studio_profiles` and `studio_clients` provide B2B client-management foundations without bypassing tenant isolation.
- `analytics_events` stores safe gallery view/download facts and must not be used to expose private or unlisted albums.
- `greeting_rules` stores global/tenant/user greeting rules with locale template keys, enable/disable state, and schedule fields.

## Seeds

Seed script creates default roles, permissions, and role-permission assignments. Super admin creation reads from `SUPER_ADMIN_EMAIL` and `SUPER_ADMIN_PASSWORD`.
