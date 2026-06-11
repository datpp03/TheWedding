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
- `media`: photo/video metadata, storage keys, processing state.
- `media_versions`: original, optimized, thumbnail, edited variants.
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

## Seeds

Seed script creates default roles, permissions, and role-permission assignments. Super admin creation reads from `SUPER_ADMIN_EMAIL` and `SUPER_ADMIN_PASSWORD`.
