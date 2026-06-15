# Prompt 06: Phase 7 Media Processing Advanced

PLEASE IMPLEMENT THIS PROMPT.

IMPORTANT PROMPT LIFECYCLE: Chi xoa file prompt nay sau khi hoan thanh tat ca muc trong prompt, pass verification, cap nhat docs, commit va push thanh cong. Neu con bat ky hang muc nao chua xong, giu nguyen file prompt va ghi ro phan con lai.

Ban dang lam trong repo `D:\AJT\TheWedding`. Hay bat dau Phase 7.

## Muc Tieu

Them media processing pipeline: BullMQ + Redis, thumbnails, optimization, media versions, video preview placeholders va retry monitoring.

Storage/processing direction phai theo `docs/STORAGE_STRATEGY.md`.

Target image flow: user uploads the original image, backend validates it, backend resizes/compresses it, storage keeps the private original plus optimized versions, and frontend displays the compressed/optimized version by default.

## Backend Tasks

- Add BullMQ/Redis integration.
- Implement media processing service interface concrete implementation.
- Create jobs for:
  - image thumbnail generation.
  - image optimization.
  - image resize/compression profiles for gallery, lightbox, and thumbnail usage.
  - video preview placeholder/metadata extraction where feasible.
  - media version rows.
- Update `media.processingStatus`.
- Add retry/failure reason tracking.
- Make jobs idempotent so retry does not create duplicate/corrupt media versions.
- Update storage usage accounting after processing completes.
- Preserve original media private by default and generate derived versions with backend-controlled storage keys.
- Keep original download permission checks separate from optimized display URLs.
- Admin/media dashboard can see processing status.
- Keep processing pluggable for production workers later.

## Frontend Tasks

- Any new processing status labels, errors, retry text, and empty/loading states must use i18n/l10n keys with `vi`, `en`, `ja` translations.
- Show processing states in media grid:
  - queued.
  - processing.
  - ready.
  - failed/retry.
- Responsive thumbnails and placeholders.
- Prefer optimized image URLs in gallery/lightbox once ready, with graceful fallback while processing.
- Smooth status updates via polling or query invalidation.

## Tests

- Unit tests for job creation/status transitions.
- Integration-ish tests with mocked queue if Redis test setup is not ready.
- Smoke test upload -> queued status.
- Run full verification.

## Docs

- Update architecture, deployment, environment variables, troubleshooting, roadmap, changelog, development log.
- Update `docs/HUONG_DAN_SU_DUNG.md` bang tieng Viet de huong dan nguoi dung hieu trang thai queued/processing/ready/failed, retry neu co, va cach kiem tra thumbnail/optimized media.
- Update i18n/l10n locale files and docs for media processing statuses and retry/failure language.

## Acceptance Criteria

- Uploaded media gets processing status flow.
- Optimized/compressed image versions are generated and used for normal display when available.
- Failed processing can be diagnosed/retried.
- UI clearly communicates status.
- Processing UI copy is available through locale keys for Vietnamese, English, and Japanese.
- Commit va push len `origin/main`.
