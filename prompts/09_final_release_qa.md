# Prompt 09: Final Release QA & Cleanup

PLEASE IMPLEMENT THIS PROMPT.

Ban dang lam trong repo `D:\AJT\TheWedding`. Hay lam final release QA va cleanup.

## Muc Tieu

Kiem tra toan bo du an truoc khi xem nhu MVP release-ready.

## Tasks

- Doc lai:
  - `README.md`
  - `docs/PROJECT_OVERVIEW.md`
  - `docs/ROADMAP.md`
  - `docs/API_DESIGN.md`
  - `docs/AUTH_SECURITY.md`
  - `docs/UI_UX_DESIGN.md`
  - `docs/TESTING_STRATEGY.md`
- Kiem tra codebase:
  - dead code.
  - TODO nguy hiem.
  - broken routes.
  - missing env docs.
  - migration mismatch.
  - seed repeatability.
- Run full verification:
  - `pnpm format:check`
  - `pnpm lint`
  - `pnpm typecheck`
  - `pnpm test`
  - `pnpm build`
  - migration run on clean/local DB if safe.
  - API and Web smoke tests.
- Manual UX QA:
  - register/login/logout.
  - create tenant.
  - create album/upload media.
  - public gallery/lightbox.
  - theme customization.
  - admin dashboard.
  - mobile widths: 320, 360, 390, 414, 768, 1024, desktop.
- Update docs:
  - release notes.
  - known limitations.
  - setup instructions.
  - troubleshooting.

## Acceptance Criteria

- Working tree clean after commit.
- All checks pass or failures are documented with exact reason.
- README can guide a new developer to run the app.
- MVP status and remaining roadmap are clear.
- Commit va push len `origin/main`.
