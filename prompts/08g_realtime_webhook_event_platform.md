# Prompt 08G: Realtime Webhook And Event Platform

PLEASE IMPLEMENT THIS PROMPT.

IMPORTANT PROMPT LIFECYCLE: Chi xoa file prompt nay sau khi hoan thanh tat ca muc trong prompt, pass verification, cap nhat docs, commit va push thanh cong. Neu con bat ky hang muc nao chua xong, giu nguyen file prompt va ghi ro phan con lai.

TRUOC KHI BAT DAU: Doc `AGENTS.md` va `docs/SYSTEM_MAP.md` de biet cau truc thu muc, file lien quan, va quy tac ban giao. Neu muc `## Carryover Khan Cap Tu Prompt Truoc` ben duoi co noi dung, xu ly cac muc do TRUOC.

Taste Skill Frontend Rule: Khi task cham frontend/UI/layout/component/form/dashboard/admin/public page/redesign/accessibility/responsive QA, doc `docs/ai/taste-skill-integration.md` va `.cursor/rules/taste-skill-frontend.mdc` truoc khi code; audit man hinh hien tai va giu nguyen API/props/state/permission/routing/business logic neu task chi la UI.

## Carryover Khan Cap Tu Prompt Truoc

- None.

Ban dang lam trong repo `D:\AJT\TheWedding`. Hay xay dung nen tang realtime/webhook theo `docs/REALTIME_WEBHOOK_PLAN.md`.

## Docs Phai Doc Truoc Khi Sua

- `docs/REALTIME_WEBHOOK_PLAN.md`
- `docs/PRODUCT_PLAN.md`
- `docs/ROADMAP.md`
- `docs/ARCHITECTURE.md`
- `docs/API_DESIGN.md`
- `docs/DATABASE_DESIGN.md`
- `docs/AUTH_SECURITY.md`
- `docs/ROLE_PERMISSION.md`
- `docs/STORAGE_STRATEGY.md`
- `docs/TESTING_STRATEGY.md`
- `docs/SEO_GEO_GUIDELINES.md`
- `docs/HUONG_DAN_SU_DUNG.md`

## Muc Tieu

Them event backbone de app co the chay realtime mot cach an toan:

- Internal domain events khong bi mat khi transaction thanh cong.
- Browser nhan update realtime qua SSE truoc, WebSocket chi them sau neu can bidirectional.
- Inbound webhook nhu MoMo co signature verification, replay protection, va idempotency.
- Outbound webhook cho studio/automation co HMAC signing, retry, dead-letter, va replay UI.
- Public realtime khong duoc leak private/unlisted/admin/signed-media data.

## Scope

Recommended implementation boundaries:

- Backend module moi: `apps/api/src/modules/realtime` hoac `apps/api/src/modules/events`.
- Shared event constants/types in `packages/shared/src` neu Web can dung.
- Database migrations for event outbox and webhook delivery tables.
- Authenticated SSE endpoints under `/api/v1/realtime/...`.
- Event publishing hooks in media processing, public social, payment, entitlement, theme, custom domain, studio, and admin health where currently implemented.
- Web client helpers/components only where the first realtime UX is exposed.

Khong thay the audit logs bang realtime events. Audit logs la compliance/security record; realtime events la delivery/UX/automation pipeline.

## Tasks

- Event contract:
  - Define stable event envelope with id, type, version, tenantId, albumId, actorUserId, visibility, occurredAt, correlationId, idempotencyKey, and payload.
  - Add redaction/safe-payload helpers so event payloads never include secrets, cookies, raw object keys, signed URLs, OTP/MFA values, provider tokens, or private EXIF/location data.
  - Version event names and document compatibility rules.
- Transactional outbox:
  - Add `event_outbox` migration/entity/repository/service.
  - Write domain events in the same transaction or safe application boundary as business mutations.
  - Add dispatcher with retries, attempt count, next attempt, and dead-letter/failed state.
  - Use BullMQ/Redis when available and safe local fallback when not configured.
- Browser realtime:
  - Implement SSE first with reconnect/cursor support (`Last-Event-ID` or equivalent).
  - Add channel authorization for `user:{userId}`, `tenant:{tenantId}`, `album:{albumId}`, `public-album:{albumIdOrSlug}`, `admin:ops`, and `studio:{studioId}` as implemented.
  - Public album channel must resolve album visibility and send only `public_safe` fields.
  - Add graceful fallback/polling if realtime is disabled.
- Inbound webhooks:
  - Implement signed MoMo webhook path only if provider signature docs/credentials are available; otherwise keep endpoint gated and document blocker.
  - Enforce timestamp tolerance, replay protection, unique provider event id, and idempotency.
  - Convert verified inbound provider events into internal domain events.
- Outbound webhooks:
  - Add endpoint model/API for admin/studio-configured outbound webhooks if scope permits.
  - Store only hashed/encrypted endpoint secrets where appropriate; never echo secrets after creation.
  - HMAC-sign delivery payloads with timestamp and event id.
  - Add retry/backoff, disabled endpoint state, delivery logs, and admin replay.
  - Gate outbound webhook access by studio/admin plan entitlement and feature flag.
- Integrations:
  - Media: publish upload accepted, processing started/completed/failed, scan quarantined/rejected.
  - Public social: publish wish created/approved/hidden/rejected and reaction created/deleted.
  - Payment: publish checkout created/succeeded/failed/cancelled after verified provider event.
  - Entitlement: publish grant/revoke to user/tenant channels.
  - Admin ops: publish health/queue/storage/payment/webhook failures to admin-only channel.
- UX:
  - Add realtime connection states where exposed: connected, reconnecting, offline/fallback, error.
  - Dashboard upload/media state should update without manual refresh if implemented.
  - Public album wish/reaction counts may update live only when public-safe.
  - Admin webhook delivery logs should be dense, operational, and noindex.
  - All visible copy must use i18n keys in `vi`, `en`, and `ja`.

## Security And Privacy

- Every subscription must be permission-checked; never trust channel names from the client.
- Public channels must never reveal private/unlisted albums, pending moderation content, user emails, tenant IDs that are not already public-safe, raw storage keys, signed URLs, payment/admin data, or provider payloads.
- Inbound webhooks must reject unsigned, stale, duplicate, or malformed events.
- Outbound delivery must not retry forever; use bounded retries and clear disabled/dead-letter states.
- Admin/reporting/realtime debug routes must be `noindex`, excluded from sitemap, and not exposed through public metadata.

## Tests

- Event envelope validation and payload redaction tests.
- Outbox idempotency/retry/dead-letter tests.
- SSE channel authorization tests for user, tenant, album, public album, admin ops, and studio channels where implemented.
- Public/unlisted/private album realtime privacy tests.
- Inbound webhook signature/replay/idempotency tests if MoMo webhook is implemented.
- Outbound webhook signing/retry/disable/replay tests if outbound delivery is implemented.
- Web smoke tests for realtime connection states and fallback polling where UI is exposed.
- SEO/GEO smoke for noindex/no sitemap on realtime/admin webhook debug routes.
- Run verification phu hop: `pnpm format:check`, `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`.

## Docs

Update:

- `docs/REALTIME_WEBHOOK_PLAN.md`
- `docs/ARCHITECTURE.md`
- `docs/API_DESIGN.md`
- `docs/DATABASE_DESIGN.md`
- `docs/AUTH_SECURITY.md`
- `docs/ROLE_PERMISSION.md` if new permissions are added.
- `docs/ENVIRONMENT_VARIABLES.md` if webhook secrets/providers/env are added.
- `docs/DEPLOYMENT.md` if SSE/WebSocket/proxy/Redis behavior changes.
- `docs/TESTING_STRATEGY.md`
- `docs/SEO_GEO_GUIDELINES.md` if realtime routes affect robots/noindex/sitemap policy.
- `docs/HUONG_DAN_SU_DUNG.md` in Vietnamese for realtime behavior, webhook setup, delivery logs, and troubleshooting.
- `docs/ROADMAP.md`, `docs/CHANGELOG.md`, `docs/DEVELOPMENT_LOG.md`.

## Ban Giao Sau Prompt (Bat Buoc)

Theo `AGENTS.md` muc 3, sau khi hoan tat (hoac dung do con viec):

- Tao/cap nhat task file trong `viec-can-lam/` cho webhook provider credentials, MoMo sandbox/production config, external endpoint QA, realtime browser QA, va bat ky product decision nao con cho. Dung `viec-can-lam/_TEMPLATE.md`, dat vao dung muc do, roi cap nhat `viec-can-lam/README.md` nhu muc luc link/trang thai.
- Neu con loi chua sua hoac viec phai lam ngay, tao/cap nhat file trong `viec-can-lam/00_khan_cap/`, roi chen tom tat + link vao prompt ke tiep trong thu tu `prompts/README.md` duoi `## Carryover Khan Cap Tu Prompt Truoc`.
- Tao/cap nhat file y tuong trong `y-tuong-nang-cap/` neu phat hien trong qua trinh lam, roi cap nhat `y-tuong-nang-cap/README.md`.
- Cap nhat `docs/SYSTEM_MAP.md` neu them module/route/table/doc moi.

## Acceptance Criteria

- Event backbone and outbox exist, or any deferred slice is explicitly documented and gated.
- Browser realtime uses authorized channels and has reconnect/fallback behavior.
- Media/social/admin/payment events that are implemented use the shared event contract.
- Inbound webhook path verifies signatures/replay/idempotency before changing state, or remains disabled with clear docs.
- Outbound webhooks are signed, retried, observable, and gated, or remain documented placeholders.
- Public realtime never leaks private/unlisted/admin/payment/signed-media data.
- Docs, tests, i18n, and handoff files are updated.
- `viec-can-lam/`, `viec-can-lam/README.md` va `y-tuong-nang-cap/README.md` da duoc cap nhat; moi task file trong `viec-can-lam/` co huong dan thuc hien chi tiet.
- Commit va push len `origin/main`.
