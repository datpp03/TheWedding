# Prompt 08B: Public Discovery, Moderation, And Audit Completion

PLEASE IMPLEMENT THIS PROMPT.

IMPORTANT PROMPT LIFECYCLE: Chi xoa file prompt nay sau khi hoan thanh tat ca muc trong prompt, pass verification, cap nhat docs, commit va push thanh cong. Neu con bat ky hang muc nao chua xong, giu nguyen file prompt va ghi ro phan con lai.

Ban dang lam trong repo `D:\AJT\TheWedding`. Hay hoan tat cac phan con lai cua public album/social expansion: featured curation, wish moderation, search metadata consent, pagination/sort, va audit/admin reporting.

Truoc khi lam, doc:

- `docs/PRODUCT_PLAN.md`
- `docs/ROADMAP.md`
- `docs/API_DESIGN.md`
- `docs/AUTH_SECURITY.md`
- `docs/ROLE_PERMISSION.md`
- `docs/TESTING_STRATEGY.md`
- `docs/HUONG_DAN_SU_DUNG.md`

## Muc Tieu

Public discovery phai an toan theo privacy, co curation/moderation ro rang, va admin/owner co cong cu xu ly social content ma khong lam lo private/unlisted albums.

## Product Defaults

Neu chua co cau tra loi product rieng, dung default an toan sau:

- Featured albums la hybrid: album phai `public` va owner opt-in hoac admin curated. Khong feature unlisted/private.
- Wish moderation la owner/admin managed. Existing visible wishes giu backwards-compatible status `visible`; album co setting `requireWishApproval` de wish moi vao `pending`.
- Search metadata chi dung field duoc owner dong y expose cho discovery. Khong index private/unlisted albums vao public search.
- Reaction uniqueness giu theo implementation hien tai: one active reaction per user per symbol per album, tru khi product docs da doi.

## Tasks

- Featured album curation:
  - Them owner opt-in/out setting cho public discovery/featured.
  - Them admin curation UI/API cho featured albums: add/remove, priority, window today/week/custom, reason/note, active/inactive.
  - Featured endpoint phai support pagination, sort, va deterministic fallback khi khong co curated albums.
  - Public home chi hien albums `public` va du dieu kien opt-in/curated.
  - Admin curation mutations phai co permission rieng va audit logs.
- Wish moderation:
  - Them moderation status cho wishes neu chua co: `pending`, `visible`, `hidden`, `rejected` hoac mapping tuong duong.
  - Owner/member/admin API de list/filter wishes, approve, hide, reject, delete/restore neu phu hop.
  - Owner UI tren album/dashboard de moderate wishes voi empty/loading/error/success states.
  - Public reads chi tra wishes visible va safe display fields.
  - Mutation phai rate limited va audit logged, metadata duoc redacted.
- Reactions/social safety:
  - Kiem tra reaction symbol config UI/API khong cho unsafe text/icon.
  - Them owner/admin view summary reactions neu chua co.
  - Abuse signals cho duplicate/invalid/rate-limited attempts neu can.
- Search metadata consent:
  - Xac dinh source data cho age range, region, venue/location, time, theme.
  - Them consent/visibility controls neu metadata co the nhay cam.
  - Authenticated advanced search phai support pagination, sort, va filters ro rang.
  - Khong search unlisted/private albums tru khi user la owner/admin trong route rieng.
- Audit/admin activity:
  - Them admin filters cho event types: OAuth login/linking, wish/reaction mutations, moderation, featured curation, privacy changes, search abuse signals.
  - Them audit export CSV/JSON neu chua co, co retention/redaction rules.
  - Dam bao passwords, tokens, cookies, OTP/MFA, OAuth code, provider secret, raw headers khong xuat hien trong export.

## UX

- Public home va album detail tiep tuc la first website experience, khong ep login truoc khi guest can interact.
- Owner moderation UI phai nhanh de scan: status chips, filters, bulk actions neu hop ly, va ro nguoi gui/thoi gian/noi dung.
- Admin curation UI phai phan biet curated, owner opt-in, fallback ranking, va inactive.
- Mobile widths can check: 320, 360, 390, 414, 768, 1024, desktop.
- Tat ca copy moi phai dung i18n/l10n keys, co `vi`, `en`, `ja`.

## Tests

- Backend tests cho featured privacy boundaries, opt-in/curated rules, pagination/sort, priority/window behavior.
- Backend tests cho wish moderation statuses, owner/admin permission, public-visible-only reads, duplicate/rate-limit behavior.
- Backend tests cho search consent, public-only filters, unlisted/private exclusion, va pagination.
- Audit export/filter tests voi redaction assertions.
- Web tests/smoke cho public home, owner moderation UI, admin curation UI, va advanced search responsive states.
- Run verification phu hop: `pnpm format:check`, `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`.

## Docs

- Update `docs/PRODUCT_PLAN.md`, `docs/API_DESIGN.md`, `docs/AUTH_SECURITY.md`, `docs/ROLE_PERMISSION.md`, `docs/TESTING_STRATEGY.md`, `docs/ROADMAP.md`, `docs/CHANGELOG.md`, `docs/DEVELOPMENT_LOG.md`.
- Update `docs/HUONG_DAN_SU_DUNG.md` bang tieng Viet cho owner opt-in, admin curation, wish moderation, public search, va privacy limits.
- Ghi ro featured ranking/curation rule dang dung va cac product decisions con deferred neu co.

## Acceptance Criteria

- Featured albums khong bao gio include unlisted/private albums.
- Featured albums co owner opt-in/admin curation path ro rang va co audit logs.
- Owner/admin co the moderate wishes; public chi thay visible wishes.
- Advanced search co consent/privacy rules, pagination, sort, va tests.
- Audit filters/export bao gom social/discovery events va redaction pass.
- Public/social UI responsive, i18n-complete cho `vi`, `en`, `ja`, va khong overflow.
- Commit va push len `origin/main`.
