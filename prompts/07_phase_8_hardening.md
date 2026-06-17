# Prompt 07: Phase 8 Enterprise Hardening

PLEASE IMPLEMENT THIS PROMPT.

IMPORTANT PROMPT LIFECYCLE: Chi xoa file prompt nay sau khi hoan thanh tat ca muc trong prompt, pass verification, cap nhat docs, commit va push thanh cong. Neu con bat ky hang muc nao chua xong, giu nguyen file prompt va ghi ro phan con lai.

Ban dang lam trong repo `D:\AJT\TheWedding`. Hay bat dau Phase 8.

Truoc khi lam, doc `docs/PRODUCT_PLAN.md`, `docs/UI_UX_DESIGN.md`, `docs/TESTING_STRATEGY.md`, va security/storage docs lien quan. [NEW]

## Muc Tieu

Hardening security, reliability, monitoring, backup, QA va frontend polish truoc khi release.

Storage hardening phai theo `docs/STORAGE_STRATEGY.md`.

## Backend/Security Tasks

- MFA foundation or at least MFA-ready model/interfaces.
- Advanced rate limit for auth/upload/admin.
- Upload abuse protection:
  - tenant quota checks.
  - max file size per media type.
  - suspicious MIME/extension mismatch handling.
  - signed URL TTL policy if signed URLs are implemented.
- Request correlation ID.
- Structured safe logging without secrets.
- Security headers review.
- CSRF review and tests.
- Refresh token reuse e2e tests.
- OAuth returnTo/open-redirect review if Google/Facebook login has been implemented.
- Album privacy review for public/unlisted/private access boundaries.
- Wish/reaction auth review: anonymous users must be redirected to login and returned to the same album after successful login.
- Audit redaction review for password, token, cookie, OTP, OAuth authorization code, provider secret, and raw sensitive header fields.
- Backup/restore documentation for SQL Server and app-managed media storage.
- Feature flag hardening.
- System parameter hardening:
  - tests for registration disabled.
  - tests for login disabled/read-only public mode.
  - tests for upload/download/payment/public-gallery disabled switches if implemented.
  - cache invalidation and fail-safe defaults for runtime settings.

## Frontend UX Tasks

- Audit i18n/l10n coverage:
  - no hard-coded user-facing strings in active UI components.
  - locale files include `vi`, `en`, `ja`.
  - missing-key fallback is safe and visible in development.
  - long Vietnamese/Japanese/English strings do not overflow on target mobile widths.
- Cross-device QA for major flows.
- Fix layout shift, overflow, text overlap, broken touch targets.
- Add reduced-motion compatibility where animations exist.
- Add polished empty/loading/error/success states across key pages.
- Review Gen Z visual direction consistency.
- [NEW] Enforce the UI execution gate from `docs/PRODUCT_PLAN.md`: each changed screen needs emotional intent, first-look hierarchy, accent color, spacing, component hierarchy, and complete interaction states.
- [NEW] Reject white/gray-only UI surfaces. Add purposeful accent color usage while keeping dashboard/admin screens scannable.
- [NEW] Verify album/media/plan/client/admin cards have clear hierarchy: image/thumbnail, title, subtitle, metadata if useful, and primary action.
- [NEW] Add reduced-motion and opt-out considerations for future contextual theme/greeting effects even if those features are still disabled.

## Testing Tasks

- Add security tests:
  - brute-force lock/rate limit.
  - invalid CSRF.
  - expired token.
  - refresh reuse.
  - OAuth returnTo open-redirect rejection if OAuth exists.
  - public/unlisted/private album privacy boundaries if public discovery exists.
  - wish/reaction requires login and returns to album after login if social interactions exist.
  - unauthorized download.
  - cross-tenant denial.
- Add responsive screenshot/browser checks where available.
- Run full verification.

## Docs

- Update security, deployment, testing, troubleshooting, roadmap, changelog, development log.
- Update `docs/HUONG_DAN_SU_DUNG.md` bang tieng Viet neu co thay doi dang nhap, dang ky, read-only mode, system parameters, MFA, rate limit, thong bao loi, backup/restore, quyen truy cap, hoac cac buoc QA nguoi dung can biet.
- Update i18n/l10n docs with QA procedure, fallback behavior, missing-key policy, and supported locale list.

## Acceptance Criteria

- Security-critical flows have automated tests.
- UI is stable across target screen sizes.
- Vietnamese, English, and Japanese locales pass critical UX smoke checks without layout overflow.
- [NEW] UI QA explicitly checks accent color, section spacing, card hierarchy, and all loading/empty/error/success states on changed screens.
- Release risk list is documented.
- Commit va push len `origin/main`.
