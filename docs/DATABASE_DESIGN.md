# Database Design

## Technology

SQL Server is the primary database. TypeORM is used for migrations and infrastructure entities. Domain entities remain ORM-free.

## Core Tables

- `users`: account identity, profile, status, verification state.
- `user_sessions`: refresh token hashes, device metadata, revocation status.
- `user_login_histories`: login result, IP, user agent, failure reason.
- `password_reset_tokens`, `email_verification_tokens`: one-time hashed tokens.
- `roles`, `permissions`, `user_roles`, `role_permissions`: RBAC and permission model.
- `tenants`, `tenant_members`: wedding sites and membership.
- `albums`: tenant album metadata, visibility, layout, cover.
- `media`: photo/video metadata, provider name, backend-generated storage keys, processing state, and user-facing original filename.
- `media_versions`: original, optimized, thumbnail, edited variants, each tied to provider storage keys.
- `themes`: tenant theme presets and customizations.
- `audit_logs`: sensitive actions and admin operations.
- `system_settings`, `feature_flags`: runtime configuration.
- `storage_usage`: tenant storage accounting.

## Conventions

- UUID primary keys using `uniqueidentifier`.
- `createdAt` and `updatedAt` on all core tables.
- `deletedAt` for soft-deletable tables.
- JSON-like settings stored as `nvarchar(max)` and validated by application schemas.
- Index every high-volume tenant lookup by `tenantId`, `albumId`, `createdAt`, and status fields.

## Migration

Initial migration is located in `apps/api/src/database/migrations/1710000000000-InitialSchema.ts`.

## Phase 4 Media Storage Notes

- `albums.coverMediaId`, `albums.visibility`, `albums.allowDownload`, and `albums.sortOrder` drive the MVP album dashboard and public gallery.
- `media.storageProvider` and `media.storageKey` store backend-generated provider metadata only. User filenames are preserved in `media.originalFileName` for display/download names and are not trusted for paths.
- Local development writes originals under keys shaped like `tenants/{tenantId}/media/{mediaId}/original/{random}.{ext}` through the storage adapter.
- Public API media DTOs expose API file URLs, not raw object keys, so tenant, album visibility, and download permissions can be checked before bytes are served.
- `media_versions` currently records the original version. Thumbnail, optimized image, and video preview variants remain planned for Phase 7 processing.

## Seeds

Seed script creates default roles, permissions, and role-permission assignments. Super admin creation reads from `SUPER_ADMIN_EMAIL` and `SUPER_ADMIN_PASSWORD`.
