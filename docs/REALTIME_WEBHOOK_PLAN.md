# Realtime Webhook And Event Platform Plan

This document defines the product and technical direction for making The Wedding feel realtime while keeping tenant isolation, privacy, auditability, and provider security intact.

## Why This Matters

Realtime behavior is important for the wedding product because guests, couples, studios, and admins often act at the same time:

- Guests send wishes and reactions while other guests are viewing the same album.
- Owners moderate wishes and should see new content without refreshing.
- Media uploads move through queued, processing, ready, failed, quarantined, or rejected states.
- Payment status changes after provider callbacks.
- Admin/support users need live health, queue, storage, and failure signals.
- Studio delivery/review workflows need instant client-facing status updates.

Do not treat this as only one webhook endpoint. The platform needs an event backbone with three delivery surfaces:

1. Internal domain events produced by app modules.
2. Inbound webhooks from external providers such as MoMo or future storage/scanner services.
3. Realtime delivery to browsers and optional outbound webhooks to external studio/automation tools.

## Terminology

- **Domain event**: an internal event emitted after an application action succeeds, for example `album.wish.created`.
- **Transactional outbox**: a database-backed event queue written in the same transaction as the business change so events are not lost.
- **Inbound webhook**: an external provider calls the API, for example MoMo payment confirmation.
- **Outbound webhook**: The Wedding calls a user/studio-configured URL, for example sending `media.ready` to a studio CRM.
- **Realtime channel**: a browser subscription using Server-Sent Events (SSE) first, with WebSocket support later if bidirectional low-latency collaboration is needed.

## Recommended Architecture

Start with a modular monolith implementation:

- Add a future `realtime` or `events` backend module under `apps/api/src/modules/`.
- Define shared event names/types in `packages/shared/src` when both API and Web need them.
- Store event records in an outbox table before dispatch.
- Dispatch events through a worker using Redis/BullMQ when `REDIS_URL` is configured, with a safe local inline fallback for development.
- Expose authenticated SSE endpoints for browser realtime updates.
- Add outbound webhook endpoint subscriptions only after internal event contracts are stable.

SSE should be the first browser transport because it is simpler, works well for server-to-client updates, supports reconnect with `Last-Event-ID`, and fits the current product better than full duplex sockets. WebSocket can be added later for collaborative editing, live presence, or bidirectional studio review.

## Event Envelope

Every event should use a stable envelope:

```json
{
  "id": "uuid",
  "type": "media.processing.completed",
  "version": 1,
  "tenantId": "uuid-or-null",
  "albumId": "uuid-or-null",
  "actorUserId": "uuid-or-null",
  "visibility": "private|tenant|public_safe|admin",
  "occurredAt": "2026-07-01T00:00:00.000Z",
  "correlationId": "request-id",
  "idempotencyKey": "provider-or-domain-key",
  "payload": {}
}
```

Rules:

- Never put secrets, cookies, provider tokens, raw signed URLs, raw storage keys, OTP/MFA values, or private EXIF/location data in the payload.
- Public channels may only receive `public_safe` events with safe aggregate/display fields.
- Tenant/user/admin channels must be permission checked before subscription.
- Event `type` and `version` must be treated as API contracts.

## Core Event Catalog

MVP event types:

- `media.upload.accepted`
- `media.processing.started`
- `media.processing.completed`
- `media.processing.failed`
- `media.scan.quarantined`
- `album.wish.created`
- `album.wish.approved`
- `album.wish.hidden`
- `album.wish.rejected`
- `album.reaction.created`
- `album.reaction.deleted`
- `album.featured.changed`
- `tenant.theme.updated`
- `payment.checkout.created`
- `payment.checkout.succeeded`
- `payment.checkout.failed`
- `payment.checkout.cancelled`
- `entitlement.granted`
- `entitlement.revoked`
- `custom_domain.verification.succeeded`
- `custom_domain.verification.failed`
- `studio.client.created`
- `studio.delivery.sent`
- `admin.alert.created`
- `system.health.changed`

## Realtime Channels

Recommended channels:

- `user:{userId}`: personal dashboard updates, payment status, direct notifications.
- `tenant:{tenantId}`: owner/team updates for albums, media, themes, quota, entitlements.
- `album:{albumId}`: owner/member album moderation and media state.
- `public-album:{albumIdOrSlug}`: public-safe wish/reaction/media-ready updates for public albums only.
- `admin:ops`: admin-only health, queue, failed jobs, storage, payment/webhook failures.
- `studio:{studioId}`: studio client delivery and review updates.

Subscription endpoints must authorize every channel. Public album channels must resolve privacy first and must not expose unlisted/private content through discovery.

## Webhook Security

Inbound webhooks:

- Verify provider signature before reading business meaning from the payload.
- Require timestamp tolerance and replay protection.
- Store provider event id with a unique idempotency key.
- Return safe status codes; do not expose internal stack traces.
- Log redacted audit events with request id and provider id.

Outbound webhooks:

- Each endpoint gets its own secret.
- Sign payload using HMAC with timestamp, event id, and body hash.
- Retry with exponential backoff and jitter.
- Stop delivery or mark endpoint disabled after repeated failures.
- Provide admin/studio replay controls with audit logs.
- Never send private media bytes, raw storage keys, or signed URLs unless a future feature explicitly creates a scoped, short-lived, permission-checked delivery.

## Suggested Tables

Add only when the implementation prompt runs:

- `event_outbox`: event envelope, status, attempts, next attempt, dispatched timestamp.
- `realtime_subscriptions` or in-memory subscription registry: active browser connections if persistence is needed.
- `webhook_endpoints`: owner/studio/admin configured outbound endpoints, secret hash, status, event filters.
- `webhook_deliveries`: per-event delivery attempts, response status, error summary, retry schedule.
- Extend `payment_events` for verified inbound provider events if needed instead of duplicating payment history.

## Feature Gates And Plans

Suggested gating:

- Free/basic: dashboard polling fallback, no outbound webhooks.
- Couple paid plans: realtime upload status, live wishes/reactions, payment status.
- Couple Premium: live event wall/slideshow and advanced guest interaction updates.
- Studio plans: outbound webhook integrations, delivery/review status, client notifications.
- Admin/support: always available for operations, behind `admin.access`.

All realtime and outbound webhook features should be guarded by feature flags/system parameters until verified.

## Implementation Slices

1. Event envelope and transactional outbox.
2. Internal dispatcher and event logging/admin visibility.
3. SSE browser subscriptions for user/tenant/admin channels.
4. Media processing and dashboard upload realtime updates.
5. Public album safe realtime wishes/reactions.
6. Signed inbound MoMo webhook and payment status events.
7. Outbound webhook endpoint management, signing, retries, and replay UI.
8. Studio delivery and automation integrations.
9. WebSocket or managed realtime provider only if SSE is not enough.

## Tests And QA

Required coverage:

- Event schema versioning and redaction tests.
- Outbox idempotency and retry tests.
- Channel authorization and tenant isolation tests.
- Public channel privacy tests for public/unlisted/private albums.
- Inbound webhook signature, replay, timestamp, and duplicate tests.
- Outbound webhook signing, retry, disabled endpoint, and replay tests.
- Browser reconnect tests using `Last-Event-ID` or equivalent cursor behavior.
- Responsive UI smoke tests for realtime badges, toasts, live feed, error/reconnect states.

## Expansion Ideas

- Live wedding wall for venue screens: new photos, wishes, and reactions appear in a moderated slideshow.
- Realtime guestbook timeline with owner approval.
- Owner mobile notification center for new wishes, failed uploads, and payment status.
- Studio CRM integration through outbound webhooks, Zapier, Make, or n8n.
- Webhook replay/debug console for support.
- Collaborative album curation where studio and couple review selections together.
- AI event triggers: run highlight selection after `media.processing.completed`.
- Smart upgrade nudges when realtime quota/usage events show a tenant near limits.
- Custom domain health alerts pushed to admin and studio dashboards.
