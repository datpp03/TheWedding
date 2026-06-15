# Prompt 08: Phase 9 Scale & Future Features

PLEASE IMPLEMENT THIS PROMPT.

IMPORTANT PROMPT LIFECYCLE: Chi xoa file prompt nay sau khi hoan thanh tat ca muc trong prompt, pass verification, cap nhat docs, commit va push thanh cong. Neu con bat ky hang muc nao chua xong, giu nguyen file prompt va ghi ro phan con lai.

Ban dang lam trong repo `D:\AJT\TheWedding`. Hay bat dau Phase 9.

## Muc Tieu

Them nen tang cho scale/future: payment/plans, Cloudflare R2 production storage, CDN, custom domain, watermark, AI tagging, analytics, user public handles. Co the chia nho neu qua lon.

## Tasks

- Plans/subscriptions foundation:
  - plan table/model neu can.
  - usage limits.
  - feature gates.
  - storage quota upgrades for photo/video uploads.
  - advanced utility unlocks for premium users.
  - admin-granted entitlements so admin can manually unlock/revoke premium rights, storage boosts, or features for any user/tenant.
  - payment provider adapter with MoMo as the first provider and placeholders/interfaces for later providers.
  - MoMo checkout/webhook flow with idempotent payment event handling if implementing the real provider in this phase.
- CDN/storage production readiness:
  - Do not require the owner to enable or subscribe to Cloudflare R2 before the adapter is implemented and verified.
  - Keep production on `STORAGE_PROVIDER=local` until this phase delivers the R2 path end to end.
  - Cloudflare R2 as the first production provider through S3-compatible config.
  - Vietnamese setup guide for Cloudflare account registration, R2 bucket creation, access key generation, env configuration, CORS if direct uploads are exposed, and smoke testing.
  - signed URLs.
  - cache/CDN docs.
  - direct-to-object-storage upload sessions for web and future React Native clients.
  - multipart upload sessions for large mobile videos.
  - migration path from local storage to object storage if local media already exists.
  - keep provider implementation behind `StorageService`, following `docs/STORAGE_STRATEGY.md`.
  - preserve target flow: original upload -> backend resize/compress -> store original and optimized versions in R2 -> frontend displays optimized media.
- User public handle and album URL foundation:
  - unique user public handle, similar to TikTok ID.
  - handle availability check and profile/settings update.
  - canonical public album URLs include the user handle, e.g. `/@{userHandle}/{siteSlug}/albums/{albumSlugOrShortId}`.
  - old public routes redirect or continue during migration.
  - duplicate album display names are allowed across users and resolved by handle plus stable album slug/id.
- Custom domain foundation:
  - domain model.
  - verification status.
  - deployment docs.
- Watermark foundation:
  - tenant setting.
  - processing hook.
- AI tagging foundation:
  - interface/adapter.
  - tag storage.
  - opt-in setting.
- Analytics foundation:
  - gallery views/download events.
  - basic dashboard stats.

## UX

- Keep all new feature surfaces clear, mobile responsive, and aligned with `docs/UI_UX_DESIGN.md`.
- Gate unavailable premium/future features gracefully without frustrating users.
- Show storage quota and premium unlock states clearly in dashboard/admin surfaces.
- Handle payment pending/success/failure/cancel states cleanly for MoMo.
- All new visible copy must use existing i18n/l10n key patterns and include `vi`, `en`, `ja` translations.

## Tests

- Unit tests for feature gates and usage limits.
- Unit tests for entitlement overrides, storage quota checks, MoMo webhook idempotency if implemented, and handle uniqueness.
- Smoke tests for analytics events and admin visibility.
- Run full verification.

## Docs

- Update architecture, environment variables, deployment, roadmap, changelog, development log.
- Update `docs/HUONG_DAN_SU_DUNG.md` bang tieng Viet de huong dan cac feature moi nhu plan/subscription, MoMo payment, admin entitlement unlocks, user handle/album URLs, custom domain, analytics, watermark, AI tagging, Cloudflare R2/CDN/storage production va upload sessions neu duoc expose ra UI/API.
- Update i18n/l10n locale files and docs for plan names, feature gates, analytics labels, domain statuses, storage messages, and future-feature copy.

## Acceptance Criteria

- Future-scale features have clean interfaces and safe placeholders.
- No half-wired provider secrets are required for local dev.
- Cloudflare R2 setup and MoMo setup are documented before requiring real credentials.
- R2 is only enabled in Render after adapter code, env validation, upload/download smoke tests, and rollback docs are complete.
- Admin can unlock premium/storage entitlements manually if this phase implements entitlement UI/API.
- Public album URL planning/implementation includes user handle to avoid cross-user duplicate-name ambiguity.
- Future-feature UI copy is managed through locale keys for Vietnamese, English, and Japanese.
- Commit va push len `origin/main`.
