# Prompt 09: Final Release QA & Cleanup

PLEASE IMPLEMENT THIS PROMPT.

IMPORTANT PROMPT LIFECYCLE: Chi xoa file prompt nay sau khi hoan thanh tat ca muc trong prompt, pass verification, cap nhat docs, commit va push thanh cong. Neu con bat ky hang muc nao chua xong, giu nguyen file prompt va ghi ro phan con lai.

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
  - `docs/STORAGE_STRATEGY.md`
  - `docs/UI_UX_DESIGN.md`
  - `docs/TESTING_STRATEGY.md`
  - `docs/HUONG_DAN_SU_DUNG.md`
- Kiem tra i18n/l10n:
  - toan bo text hien thi active UI da tach khoi component/application code thanh translation keys.
  - locale files co du `vi`, `en`, `ja`.
  - fallback/missing-key behavior ro rang.
  - date/number/status/action labels hien thi dung trong ba ngon ngu.
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
  - verify media storage path/provider behavior.
  - verify optimized/compressed image display behavior where media processing is implemented.
  - public gallery/lightbox.
  - user handle based public album route if implemented.
  - theme customization.
  - admin dashboard.
  - system parameter toggles for registration/login/read-only mode if implemented.
  - subscription/payment/entitlement/storage quota flows if implemented.
  - CI/CD Docker VPS workflow, registry images, VPS pull/restart, and remote URL smoke test if configured.
  - switch/check locales Vietnamese, English, Japanese.
  - mobile widths: 320, 360, 390, 414, 768, 1024, desktop.
- Update docs:
  - release notes.
  - known limitations.
  - setup instructions.
  - troubleshooting.
  - Vietnamese user guide in `docs/HUONG_DAN_SU_DUNG.md`.
  - i18n/l10n setup, locale maintenance, and missing-key troubleshooting.

## Acceptance Criteria

- Working tree clean after commit.
- All checks pass or failures are documented with exact reason.
- README can guide a new developer to run the app.
- `docs/HUONG_DAN_SU_DUNG.md` can guide a Vietnamese QA/user through all MVP features and test accounts.
- User-facing text is managed by i18n/l10n keys with Vietnamese, English, and Japanese coverage.
- MVP status and remaining roadmap are clear.
- Remaining roadmap clearly states whether Cloudflare R2 setup, MoMo payment, premium entitlements, and handle-based album URLs are implemented or still planned.
- If Cloudflare R2 is still planned, production env docs must explicitly say to keep `STORAGE_PROVIDER=local` and not enable R2 subscription/credentials yet.
- Commit va push len `origin/main`.
