# Prompt 08C: I18n, Accessibility, And UI QA Completion

PLEASE IMPLEMENT THIS PROMPT.

IMPORTANT PROMPT LIFECYCLE: Chi xoa file prompt nay sau khi hoan thanh tat ca muc trong prompt, pass verification, cap nhat docs, commit va push thanh cong. Neu con bat ky hang muc nao chua xong, giu nguyen file prompt va ghi ro phan con lai.

TRUOC KHI BAT DAU: Doc `AGENTS.md` va `docs/SYSTEM_MAP.md` de biet cau truc thu muc, file lien quan, va quy tac ban giao (tiet kiem token, khong quet lai toan repo). Neu muc `## Carryover Khan Cap Tu Prompt Truoc` ben duoi co noi dung, xu ly cac muc do TRUOC.

Taste Skill Frontend Rule: Khi task cham frontend/UI/layout/component/form/dashboard/admin/public page/redesign/accessibility/responsive QA, doc `docs/ai/taste-skill-integration.md` va `.cursor/rules/taste-skill-frontend.mdc` truoc khi code; audit man hinh hien tai va giu nguyen API/props/state/permission/routing/business logic neu task chi la UI.

## Carryover Khan Cap Tu Prompt Truoc

(Trong. Prompt truoc se chen loi chua sua / viec phai lam ngay vao day.)

Ban dang lam trong repo `D:\AJT\TheWedding`. Hay hoan tat i18n/l10n, accessibility, va responsive UI QA cho cac man hinh active.

Truoc khi lam, doc:

- `docs/PRODUCT_PLAN.md`
- `docs/UI_UX_DESIGN.md`
- `docs/TESTING_STRATEGY.md`
- `docs/SEO_GEO_GUIDELINES.md`
- `docs/HUONG_DAN_SU_DUNG.md`
- `docs/DEVELOPMENT_LOG.md`

## Muc Tieu

Toan bo visible UI active phai dung translation keys, co coverage `vi`, `en`, `ja`, co locale selection/persistence, va pass responsive/accessibility smoke cho release QA.

## Tasks

- I18n audit:
  - Quet web app de tim hard-coded visible strings trong active routes/components.
  - Tach text thanh locale keys theo pattern hien co.
  - Dam bao `vi`, `en`, `ja` co du keys va fallback/missing-key behavior ro rang.
  - Chuan hoa date/time/number/status/action labels theo locale.
  - Them missing translation tests hoac script check neu chua co.
- SEO/GEO metadata i18n:
  - Public route title/description/Open Graph copy phai co locale-aware metadata va khong hard-code ngoai locale pattern.
  - Khi co locale route, them/verify alternate links hoac `hreflang` phu hop.
  - Metadata text phai fit `vi`, `en`, `ja` va khong mismatch voi visible H1/body content.
  - Auth/admin/dashboard/private routes phai co noindex policy bat chap locale.
- Locale selection:
  - Them hoac hoan tat language switcher neu chua co.
  - Persist locale bang cookie/local storage theo pattern cua app.
  - Server/client rendering khong hydration mismatch khi doi locale.
  - Public, auth, dashboard, album, media, theme, admin screens phai ton trong locale.
- Accessibility:
  - Kiem tra semantic headings, labels, form errors, aria attributes, keyboard navigation, focus visible, dialog/menu behavior.
  - Kiem tra color contrast cho accent colors theo `docs/UI_UX_DESIGN.md`.
  - Honoring reduced-motion for hover/animation/loading states.
  - Icon-only buttons phai co accessible names/tooltips.
- Responsive visual QA:
  - Check widths 320, 360, 390, 414, 768, 1024, desktop.
  - Khong co horizontal overflow, text overlap, button label clipping, card jump, hoac hero/card text overflow.
  - Screens can cover: public home, public album detail, login/register/forgot/reset, dashboard, tenant/site settings, album/media dashboard, theme customization, admin dashboard, va any new surfaces.
- UI polish:
  - Khong them white/gray-only major surfaces.
  - Card hierarchy phai ro: title, subtitle, metadata, primary action.
  - Empty/loading/error/success states phai co copy translated va khong chan workflow.

## Tests

- Locale key completeness tests cho `vi`, `en`, `ja`.
- Component/unit tests cho locale switcher va formatting helpers.
- E2E/smoke tests cho language switching tren public/auth/dashboard route.
- Accessibility smoke with keyboard tab order and form errors where tooling exists.
- Browser screenshot/manual evidence cho mobile/tablet/desktop viewports neu app chay duoc local.
- SEO/GEO smoke cho metadata theo `vi`, `en`, `ja`, canonical/alternate links, noindex private routes, va structured data visible-text consistency.
- Run verification phu hop: `pnpm format:check`, `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`.

## Docs

- Update `docs/UI_UX_DESIGN.md` neu them rule/accessibility pattern moi.
- Update `docs/TESTING_STRATEGY.md` voi i18n/accessibility/responsive checks.
- Update `docs/SEO_GEO_GUIDELINES.md` neu thay doi metadata/i18n/hreflang policy.
- Update `docs/HUONG_DAN_SU_DUNG.md` bang tieng Viet ve cach doi ngon ngu va QA cac locale.
- Update `docs/ROADMAP.md`, `docs/CHANGELOG.md`, `docs/DEVELOPMENT_LOG.md`.

## Ban Giao Sau Prompt (Bat Buoc)

Theo `AGENTS.md` muc 3, sau khi hoan tat (hoac dung do con viec):

- Tao/cap nhat task file trong `viec-can-lam/` cho viec nguoi dung can lam (credentials/config/QA thu cong/quyet dinh san pham), acceptance chua xong va ly do. Dung `viec-can-lam/_TEMPLATE.md`, dat vao dung muc do, roi cap nhat `viec-can-lam/README.md` nhu muc luc link/trang thai. Moi task file phai co huong dan chi tiet de nguoi dung tu lam duoc: can chuan bi gi, cac buoc thuc hien, file/env/dashboard/URL lien quan, cach smoke test/xac nhan pass, va docs lien quan.
- Neu con loi chua sua hoac viec phai lam ngay, tao/cap nhat file trong `viec-can-lam/00_khan_cap/`, roi chen tom tat + link vao muc `## Carryover Khan Cap Tu Prompt Truoc` o DAU prompt ke tiep (theo thu tu `prompts/README.md`); neu day la prompt cuoi, ghi link vao muc "Khan Cap" cua `viec-can-lam/README.md`.
- Tao/cap nhat file y tuong trong `y-tuong-nang-cap/` bang `y-tuong-nang-cap/_TEMPLATE.md`, roi cap nhat `y-tuong-nang-cap/README.md`.
- Cap nhat `docs/SYSTEM_MAP.md` neu cau truc thu muc/module/route/doc thay doi.

## Acceptance Criteria

- Active UI khong con hard-coded visible strings ngoai tru noi dung user-generated, brand names, route constants, hoac test fixtures co ly do ro.
- Locale files `vi`, `en`, `ja` complete va missing-key check pass.
- User co the doi ngon ngu va preference duoc persist.
- Core routes responsive o cac kich thuoc yeu cau, khong overflow/overlap.
- Keyboard/focus/form accessibility smoke pass cho core workflows.
- Public metadata/canonical/alternate/noindex policy duoc QA tren `vi`, `en`, `ja`.
- Docs ghi ro cach maintain locale keys va QA responsive/i18n.
- `viec-can-lam/`, `viec-can-lam/README.md` va `y-tuong-nang-cap/README.md` da duoc cap nhat; moi task file trong `viec-can-lam/` co huong dan thuc hien chi tiet; viec khan cap (neu co) da chuyen sang prompt ke tiep hoac `viec-can-lam/00_khan_cap/`.
- Commit va push len `origin/main`.
