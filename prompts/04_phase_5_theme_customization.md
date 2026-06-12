# Prompt 04: Phase 5 Theme Customization

PLEASE IMPLEMENT THIS PROMPT.

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

## Acceptance Criteria

- User can choose and activate a theme.
- Public site reflects active theme.
- Theme editor is responsive and polished.
- Commit va push len `origin/main`.
