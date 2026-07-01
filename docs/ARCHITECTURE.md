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
- `(public)`: planned public home entry with featured public albums for today/week and secondary auth navigation.
- `(public)/[@userHandle]/[siteSlug]`: planned canonical public path so user-selected handles personalize album URLs and prevent duplicate album-name ambiguity across users.
- `(auth)`: login, register, forgot/reset password.
- `(dashboard)`: owner workflows for sites, albums, media, themes, settings.
- `(admin)`: system management, audit logs, feature flags, reports.
- [NEW] `(studio)`: future B2B workspace for studios/photographers to manage clients, delivery albums, branding, and professional subscriptions.

## Integration Boundaries

- Database: PostgreSQL through TypeORM infrastructure repositories. Neon PostgreSQL is the first hosted free-tier target.
- Storage: adapter interface with local development storage and S3-compatible production providers. See `docs/STORAGE_STRATEGY.md`.
- Queue: BullMQ/Redis powers Phase 7 media processing. `REDIS_URL` enables the real queue/worker path; local development without Redis falls back to an inline async processor through the same `MediaProcessingService` interface.
- Mail: provider interface for verification and password reset flows.
- Payments: provider adapter planned with MoMo first, keeping checkout/webhook logic outside subscription domain rules.
- Realtime/webhooks: planned event backbone with transactional outbox, signed inbound provider webhooks, authorized SSE browser channels, and signed outbound webhooks. See `docs/REALTIME_WEBHOOK_PLAN.md`.
- Scale foundation: `apps/api/src/modules/scale` owns plan catalog exposure, user public handles, tenant usage summaries, admin entitlements, payment-event idempotency, custom-domain/studio/greeting placeholders, and analytics events. Business rules that are shared with web live in `packages/shared/src/scale.ts`.
- OAuth: Google and Facebook login should extend the existing auth/session boundary with provider adapters and validated return paths.
- Runtime settings: admin-managed system parameters and feature flags should be read through an application service with caching, invalidation, permission checks, and audit logging.
- [NEW] Album discovery/social: public home, featured albums, wishes, reactions, and advanced search should sit behind album/media application services so privacy and tenant ownership checks are shared rather than duplicated in controllers.
- [NEW] Context providers: weather, location, holiday calendar, and event calendars must stay behind adapters so contextual themes can fall back safely when external data is unavailable.
- [NEW] Greeting automation: scheduled/event-triggered greetings should use a rules service separated from static tenant content, with audit logs for admin-managed rules and i18n/l10n templates for visible text.
- [NEW] Studio/B2B: studio profiles, clients, and delivery workflows should extend the tenant model through explicit ownership/membership relationships instead of bypassing tenant isolation.

## Media Processing Pipeline

Phase 7 keeps original uploads private and creates backend-controlled derivative keys under:

```txt
tenants/{tenantId}/media/{mediaId}/versions/{profile}.webp
```

The API stores the original media row as `processingStatus=pending`, enqueues a processing job, then the processor updates status to `processing`, writes image profiles for thumbnail, gallery, and lightbox usage, upserts `media_versions`, recalculates `storage_usage`, and marks the media `ready`. Failed jobs store `processingFailureReason` and increment `processingAttempts`; the owner dashboard can retry them.

Image processing uses Sharp today. Video preview is currently metadata-only unless the production worker image adds ffmpeg or another media extraction backend. The worker is intentionally pluggable so later online editing, AI quality optimization, malware scanning, and R2/CDN publication can attach behind the same processing boundary.

## Phase 9 Scale Boundary

The scale module is a foundation layer, not a fully enabled commerce system. It resolves plan limits and feature access through shared catalog constants, active feature flags, and admin-granted entitlements. Controllers expose only safe public reads, authenticated user handle/tenant summaries, and admin-only mutation endpoints.

Production providers remain gated for payment and advanced media delivery: MoMo checkout/webhook signature verification, signed upload/download URL endpoints, multipart mobile uploads, CDN-first public derivative delivery, and local-to-object migration are still separate provider implementations behind existing boundaries. The S3-compatible/R2 storage adapter is available for API-managed uploads.

Realtime/event delivery remains planned until the event backbone is implemented. Browser realtime should start with authorized SSE channels and a reconnect cursor; outbound webhooks should stay disabled until endpoint signing, retry, dead-letter, replay, and privacy tests exist.
