# Prompt 08: Phase 9 Scale & Future Features

PLEASE IMPLEMENT THIS PROMPT.

IMPORTANT PROMPT LIFECYCLE: Chi xoa file prompt nay sau khi hoan thanh tat ca muc trong prompt, pass verification, cap nhat docs, commit va push thanh cong. Neu con bat ky hang muc nao chua xong, giu nguyen file prompt va ghi ro phan con lai.

Ban dang lam trong repo `D:\AJT\TheWedding`. Hay bat dau Phase 9.

## Muc Tieu

Them nen tang cho scale/future: payment/plans, CDN, custom domain, watermark, AI tagging, analytics. Co the chia nho neu qua lon.

## Tasks

- Plans/subscriptions foundation:
  - plan table/model neu can.
  - usage limits.
  - feature gates.
  - payment provider adapter placeholder.
- CDN/storage production readiness:
  - S3-compatible config.
  - signed URLs.
  - cache/CDN docs.
  - direct-to-object-storage upload sessions for web and future React Native clients.
  - multipart upload sessions for large mobile videos.
  - migration path from local storage to object storage if local media already exists.
  - keep provider implementation behind `StorageService`, following `docs/STORAGE_STRATEGY.md`.
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
- All new visible copy must use existing i18n/l10n key patterns and include `vi`, `en`, `ja` translations.

## Tests

- Unit tests for feature gates and usage limits.
- Smoke tests for analytics events and admin visibility.
- Run full verification.

## Docs

- Update architecture, environment variables, deployment, roadmap, changelog, development log.
- Update `docs/HUONG_DAN_SU_DUNG.md` bang tieng Viet de huong dan cac feature moi nhu plan/subscription, custom domain, analytics, watermark, AI tagging, CDN/storage production va upload sessions neu duoc expose ra UI/API.
- Update i18n/l10n locale files and docs for plan names, feature gates, analytics labels, domain statuses, storage messages, and future-feature copy.

## Acceptance Criteria

- Future-scale features have clean interfaces and safe placeholders.
- No half-wired provider secrets are required for local dev.
- Future-feature UI copy is managed through locale keys for Vietnamese, English, and Japanese.
- Commit va push len `origin/main`.
