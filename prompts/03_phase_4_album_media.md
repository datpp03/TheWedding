# Prompt 03: Phase 4 Album & Media

PLEASE IMPLEMENT THIS PROMPT.

Ban dang lam trong repo `D:\AJT\TheWedding`. Hay bat dau Phase 4.

## Muc Tieu

Xay dung album/media MVP: tao album, upload anh/video, list media, public gallery, lightbox, reorder, set cover, download permission va storage local dev.

## Backend Tasks

- Implement albums module:
  - CRUD album.
  - reorder albums.
  - set cover.
  - visibility.
  - allow download.
- Implement media module:
  - single upload.
  - bulk upload.
  - list media by tenant/album.
  - update metadata.
  - reorder media.
  - move album.
  - batch delete.
  - download endpoint respecting permissions.
- Implement storage adapter:
  - local storage for dev.
  - randomized storage keys.
  - prevent path traversal.
  - MIME/extension/size validation.
- Keep media private by default unless public visibility allows access.
- Audit media delete/download permission changes.

## Frontend Tasks

- Album dashboard:
  - Create/edit/delete album.
  - Reorder.
  - Cover selection.
  - Visibility and download controls.
- Media dashboard:
  - Drag/drop upload.
  - Bulk upload queue with progress, retry, failure states.
  - Grid/list view.
  - Batch select/delete/move.
- Public gallery:
  - Responsive album and media grid.
  - Smooth lightbox with keyboard and touch support.
  - Download button only when allowed.
- UI/UX:
  - Follow `docs/UI_UX_DESIGN.md`.
  - Image/media-first, youthful, polished.
  - No horizontal overflow on small phones.
  - Smooth skeletons and empty states.

## Tests

- Backend:
  - album CRUD/access tests.
  - invalid file upload rejection.
  - cross-tenant media denial.
  - download permission checks.
- Frontend:
  - smoke test upload screen.
  - public gallery/lightbox.
- Manual smoke with local SQL Server and local storage.
- Run full verification: format, lint, typecheck, test, build.

## Docs

- Cap nhat API, database/storage docs, roadmap, changelog, development log.

## Acceptance Criteria

- User co tenant co the tao album, upload media, xem gallery public.
- Lightbox va upload UX muot tren mobile va desktop.
- Security file upload co validation that.
- Commit va push len `origin/main`.
