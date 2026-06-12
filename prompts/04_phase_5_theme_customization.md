# Prompt 04: Phase 5 Theme Customization

PLEASE IMPLEMENT THIS PROMPT.

IMPORTANT PROMPT LIFECYCLE: Chi xoa file prompt nay sau khi hoan thanh tat ca muc trong prompt, pass verification, cap nhat docs, commit va push thanh cong. Neu con bat ky hang muc nao chua xong, giu nguyen file prompt va ghi ro phan con lai.

Ban dang lam trong repo `D:\AJT\TheWedding`. Hay bat dau Phase 5.

## Muc Tieu

Xay dung theme customization: presets, colors, layout, typography, live preview, clone/reset/activate theme cho wedding site.

## Backend Tasks

- Implement themes module:
  - theme presets.
  - create/update tenant theme.
  - preview theme.
  - activate theme.
  - clone/reset theme.
- Validate theme JSON/settings o application layer.
- Ensure tenant access on all tenant theme mutations.
- Public site endpoint phai include active theme.
- Audit theme activation/reset/update.

## Frontend Tasks

- Start i18n/l10n foundation if feasible:
  - locale files keyed by stable IDs.
  - initial locales `vi`, `en`, `ja`.
  - no hard-coded visible text for new theme UI.
  - fallback/missing-key behavior.
- Theme dashboard:
  - Preset gallery.
  - Color controls with swatches.
  - Layout selector.
  - Typography/style controls where useful.
  - Live preview.
  - Save/activate/reset actions.
- Public site:
  - Apply active theme consistently.
  - Keep media readable and fast.
- UX/UI:
  - Gen Z-friendly, energetic, modern presets.
  - Smooth preview updates.
  - Responsive controls on phone/tablet/desktop.
  - Complete loading/error/success/dirty states.

## Tests

- Backend theme validation tests.
- Tenant access denial tests.
- Frontend smoke for theme preset/select/save/activate.
- Visual responsive checks for theme page and public site.
- Run full verification.

## Docs

- Update API, theme docs if needed, roadmap, development log, changelog.
- Update `docs/HUONG_DAN_SU_DUNG.md` bang tieng Viet de huong dan chon preset, preview, save/activate/reset theme va cach kiem tra public site sau khi theme duoc active.
- Update i18n/l10n plan/docs neu them translation foundation hoac them/sua locale files.

## Acceptance Criteria

- User can choose and activate a theme.
- Public site reflects active theme.
- Theme editor is responsive and polished.
- New theme UI text is ready for `vi`, `en`, and `ja` through translation keys, or the remaining i18n foundation work is explicitly documented.
- Commit va push len `origin/main`.
