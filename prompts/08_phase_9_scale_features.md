# Prompt 08: Phase 9 Scale & Future Features

PLEASE IMPLEMENT THIS PROMPT.

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

## Tests

- Unit tests for feature gates and usage limits.
- Smoke tests for analytics events and admin visibility.
- Run full verification.

## Docs

- Update architecture, environment variables, deployment, roadmap, changelog, development log.

## Acceptance Criteria

- Future-scale features have clean interfaces and safe placeholders.
- No half-wired provider secrets are required for local dev.
- Commit va push len `origin/main`.
