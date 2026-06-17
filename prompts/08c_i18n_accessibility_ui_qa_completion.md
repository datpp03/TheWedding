# Prompt 08C: I18n, Accessibility, And UI QA Completion

PLEASE IMPLEMENT THIS PROMPT.

IMPORTANT PROMPT LIFECYCLE: Chi xoa file prompt nay sau khi hoan thanh tat ca muc trong prompt, pass verification, cap nhat docs, commit va push thanh cong. Neu con bat ky hang muc nao chua xong, giu nguyen file prompt va ghi ro phan con lai.

Ban dang lam trong repo `D:\AJT\TheWedding`. Hay hoan tat i18n/l10n, accessibility, va responsive UI QA cho cac man hinh active.

Truoc khi lam, doc:

- `docs/PRODUCT_PLAN.md`
- `docs/UI_UX_DESIGN.md`
- `docs/TESTING_STRATEGY.md`
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
- Run verification phu hop: `pnpm format:check`, `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`.

## Docs

- Update `docs/UI_UX_DESIGN.md` neu them rule/accessibility pattern moi.
- Update `docs/TESTING_STRATEGY.md` voi i18n/accessibility/responsive checks.
- Update `docs/HUONG_DAN_SU_DUNG.md` bang tieng Viet ve cach doi ngon ngu va QA cac locale.
- Update `docs/ROADMAP.md`, `docs/CHANGELOG.md`, `docs/DEVELOPMENT_LOG.md`.

## Acceptance Criteria

- Active UI khong con hard-coded visible strings ngoai tru noi dung user-generated, brand names, route constants, hoac test fixtures co ly do ro.
- Locale files `vi`, `en`, `ja` complete va missing-key check pass.
- User co the doi ngon ngu va preference duoc persist.
- Core routes responsive o cac kich thuoc yeu cau, khong overflow/overlap.
- Keyboard/focus/form accessibility smoke pass cho core workflows.
- Docs ghi ro cach maintain locale keys va QA responsive/i18n.
- Commit va push len `origin/main`.
