# Prompt 06: Phase 7 Media Processing Advanced

PLEASE IMPLEMENT THIS PROMPT.

Ban dang lam trong repo `D:\AJT\TheWedding`. Hay bat dau Phase 7.

## Muc Tieu

Them media processing pipeline: BullMQ + Redis, thumbnails, optimization, media versions, video preview placeholders va retry monitoring.

## Backend Tasks

- Add BullMQ/Redis integration.
- Implement media processing service interface concrete implementation.
- Create jobs for:
  - image thumbnail generation.
  - image optimization.
  - video preview placeholder/metadata extraction where feasible.
  - media version rows.
- Update `media.processingStatus`.
- Add retry/failure reason tracking.
- Admin/media dashboard can see processing status.
- Keep processing pluggable for production workers later.

## Frontend Tasks

- Show processing states in media grid:
  - queued.
  - processing.
  - ready.
  - failed/retry.
- Responsive thumbnails and placeholders.
- Smooth status updates via polling or query invalidation.

## Tests

- Unit tests for job creation/status transitions.
- Integration-ish tests with mocked queue if Redis test setup is not ready.
- Smoke test upload -> queued status.
- Run full verification.

## Docs

- Update architecture, deployment, environment variables, troubleshooting, roadmap, changelog, development log.

## Acceptance Criteria

- Uploaded media gets processing status flow.
- Failed processing can be diagnosed/retried.
- UI clearly communicates status.
- Commit va push len `origin/main`.
