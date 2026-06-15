# Architecture

## Style

The platform starts as a Modular Monolith using Clean Architecture + DDD boundaries. Modules communicate through application services and explicit interfaces, keeping future microservice extraction possible without introducing distributed complexity early.

## Monorepo

```txt
apps/api        NestJS backend
apps/web        Next.js frontend
packages/shared Cross-app types/constants/utils
packages/ui     Shared React UI primitives
packages/config Shared lint and TypeScript config
docs            Product and engineering documentation
docker          Runtime Dockerfiles and local services
scripts         Operational helpers
```

## Backend Layers

Each domain module uses:

- `domain`: entities, value objects, domain services, repository interfaces.
- `application`: use cases, command/query services, transactions, authorization orchestration.
- `infrastructure`: TypeORM entities, repositories, storage/mail/queue providers.
- `presentation`: controllers, DTOs, mappers, request/response concerns.

Controllers must not contain business logic or direct database access.

## Frontend Areas

- `(public)/[siteSlug]`: current public wedding site, albums, gallery, lightbox.
- `(public)/[@userHandle]/[siteSlug]`: planned canonical public path so user-selected handles personalize album URLs and prevent duplicate album-name ambiguity across users.
- `(auth)`: login, register, forgot/reset password.
- `(dashboard)`: owner workflows for sites, albums, media, themes, settings.
- `(admin)`: system management, audit logs, feature flags, reports.

## Integration Boundaries

- Database: PostgreSQL through TypeORM infrastructure repositories. Neon PostgreSQL is the first hosted free-tier target.
- Storage: adapter interface with local development storage and S3-compatible production providers. See `docs/STORAGE_STRATEGY.md`.
- Queue: BullMQ/Redis planned for async media processing.
- Mail: provider interface for verification and password reset flows.
- Payments: provider adapter planned with MoMo first, keeping checkout/webhook logic outside subscription domain rules.
- Runtime settings: admin-managed system parameters and feature flags should be read through an application service with caching, invalidation, permission checks, and audit logging.
