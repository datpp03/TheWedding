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

- `(public)/[siteSlug]`: public wedding site, albums, gallery, lightbox.
- `(auth)`: login, register, forgot/reset password.
- `(dashboard)`: owner workflows for sites, albums, media, themes, settings.
- `(admin)`: system management, audit logs, feature flags, reports.

## Integration Boundaries

- Database: SQL Server through TypeORM infrastructure repositories.
- Storage: adapter interface with local development storage and S3-compatible production providers. See `docs/STORAGE_STRATEGY.md`.
- Queue: BullMQ/Redis planned for async media processing.
- Mail: provider interface for verification and password reset flows.
