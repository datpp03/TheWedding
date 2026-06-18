# Prompt 09: Final Release QA & Cleanup

PLEASE IMPLEMENT THIS PROMPT.

IMPORTANT PROMPT LIFECYCLE: Chi xoa file prompt nay sau khi hoan thanh tat ca muc trong prompt, pass verification, cap nhat docs, commit va push thanh cong. Neu con bat ky hang muc nao chua xong, giu nguyen file prompt va ghi ro phan con lai.

TRUOC KHI BAT DAU: Doc `AGENTS.md` va `docs/SYSTEM_MAP.md` de biet cau truc thu muc, file lien quan, va quy tac ban giao (tiet kiem token, khong quet lai toan repo). Neu muc `## Carryover Khan Cap Tu Prompt Truoc` ben duoi co noi dung, xu ly cac muc do TRUOC.

## Carryover Khan Cap Tu Prompt Truoc

- Priority P0: `prompts/08_phase_9_scale_features.md` chi moi hoan thanh Phase 9 foundation, chua du 100% acceptance. Truoc khi final release, hoac tach thanh prompt rieng/chap nhan gated placeholder, hoac implement tiep cac muc con lai.
- Phase 9 con thieu: real MoMo checkout/redirect/webhook signature verification/replay protection; R2/S3 `StorageService` adapter; signed upload/download URLs; direct upload sessions; multipart mobile upload; local-to-R2 migration; upload/download smoke tests; rollback docs.
- Phase 9 con thieu UI/workflow: canonical public route `/@{userHandle}/{siteSlug}/albums/{albumSlugOrShortId}` va redirect route cu; studio delivery workflow; DNS custom-domain verification; watermark processing hook; AI tag adapter/UI; contextual theme UI; greeting scheduler.
- File lien quan da them trong prompt truoc: `packages/shared/src/scale.ts`, `apps/api/src/modules/scale/**`, `apps/api/src/database/migrations/1710000010000-Phase9ScaleFoundation.ts`, `apps/web/src/features/scale/**`, `apps/web/src/app/(admin)/admin/scale/page.tsx`.
- Cach tai hien/gap: chay final release acceptance se thay R2/MoMo/canonical handle route chua production-ready. Khong xoa prompt 08 va khong bat `STORAGE_PROVIDER=r2`/public MoMo webhook cho den khi cac muc tren duoc verify.

Ban dang lam trong repo `D:\AJT\TheWedding`. Hay lam final release QA va cleanup.

## Muc Tieu

Kiem tra toan bo du an truoc khi xem nhu MVP release-ready.

## Tasks

- Doc lai:
  - `README.md`
  - `docs/PRODUCT_PLAN.md` [NEW]
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
- Kiem tra product/business plan [NEW]:
  - B2C SaaS packages, B2B studio subscriptions, add-ons/value-added services, and admin entitlement direction are either implemented or clearly documented as planned.
  - Custom Theme ca nhan, Admin Theme Control, Dynamic Contextual Theme, and Automated Greetings are either implemented, safely gated, or clearly documented as deferred.
  - Every implemented premium/future feature has feature flag, plan gate, entitlement gate, system parameter, or admin-only boundary where appropriate.
  - `docs/PRODUCT_PLAN.md` matches the actual roadmap and implementation status.
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
  - public home is the first website screen and shows only public featured albums if implemented.
  - unlisted albums are reachable only by direct link and do not appear in home/search/timeline if implemented.
  - private albums are visible only to owner or authorized admin/support if implemented.
  - wish/reaction actions require login and return to the same album after login if implemented.
  - Google/Facebook OAuth returnTo validation and open-redirect rejection if implemented.
  - authenticated advanced album search does not leak private/unlisted albums if implemented.
  - user handle based public album route if implemented.
  - theme customization.
  - admin dashboard.
  - system parameter toggles for registration/login/read-only mode if implemented.
  - subscription/payment/entitlement/storage quota flows if implemented.
  - B2B studio/client workflow if implemented. [NEW]
  - custom theme expansion, admin theme control, contextual theme opt-out/fallback, and automated greetings if implemented. [NEW]
  - plan/add-on cards and premium-gated UI states if implemented. [NEW]
  - CI/CD Docker VPS workflow, registry images, VPS pull/restart, and remote URL smoke test if configured.
  - switch/check locales Vietnamese, English, Japanese.
  - mobile widths: 320, 360, 390, 414, 768, 1024, desktop.
  - UI design gate evidence for changed screens: emotion, first-look hierarchy, accent color, spacing, card hierarchy, states, and responsive behavior. [NEW]
- Update docs:
  - release notes.
  - known limitations.
  - setup instructions.
  - troubleshooting.
  - Vietnamese user guide in `docs/HUONG_DAN_SU_DUNG.md`.
  - i18n/l10n setup, locale maintenance, and missing-key troubleshooting.

## Ban Giao Sau Prompt (Bat Buoc)

Theo `AGENTS.md` muc 3, sau khi hoan tat (hoac dung do con viec):

- Cap nhat `VIEC_CAN_LAM.md` (thu muc goc): viec nguoi dung can lam (credentials/config/QA thu cong/quyet dinh san pham), acceptance chua xong va ly do.
- Neu con loi chua sua hoac viec phai lam ngay, chen vao muc `## Carryover Khan Cap Tu Prompt Truoc` o DAU prompt ke tiep (theo thu tu `prompts/README.md`); neu day la prompt cuoi, ghi vao muc "Khan cap" cua `VIEC_CAN_LAM.md`.
- Bo sung y tuong nang cap/mo rong tu nghi ra vao `Y_TUONG_NANG_CAP.md` (thu muc goc).
- Cap nhat `docs/SYSTEM_MAP.md` neu cau truc thu muc/module/route/doc thay doi.

## Acceptance Criteria

- Working tree clean after commit.
- All checks pass or failures are documented with exact reason.
- README can guide a new developer to run the app.
- `docs/HUONG_DAN_SU_DUNG.md` can guide a Vietnamese QA/user through all MVP features and test accounts.
- User-facing text is managed by i18n/l10n keys with Vietnamese, English, and Japanese coverage.
- MVP status and remaining roadmap are clear.
- Remaining roadmap clearly states whether Cloudflare R2 setup, MoMo payment, premium entitlements, and handle-based album URLs are implemented or still planned.
- Remaining roadmap clearly states whether public home, featured albums, album wishes/reactions, Google/Facebook OAuth, return-to-album login, advanced album search, and privacy-level migration are implemented or still planned.
- [NEW] Remaining roadmap clearly states whether B2B studio subscriptions, add-ons/value-added services, admin theme control, contextual themes, automated greetings, premium theme gates, online editing, and AI utilities are implemented or still planned.
- If Cloudflare R2 is still planned, production env docs must explicitly say to keep `STORAGE_PROVIDER=local` and not enable R2 subscription/credentials yet.
- [NEW] UI QA confirms no new white/gray-only major surfaces, no text overflow, and clear card hierarchy on implemented plan/studio/theme/greeting surfaces.
- `VIEC_CAN_LAM.md` va `Y_TUONG_NANG_CAP.md` da duoc cap nhat; viec khan cap (neu co) da chuyen sang prompt ke tiep hoac muc "Khan cap".
- Commit va push len `origin/main`.
