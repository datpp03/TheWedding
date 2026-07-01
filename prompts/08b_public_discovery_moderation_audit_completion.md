# Prompt 08B: Public Discovery, Moderation, And Audit Completion

PLEASE IMPLEMENT THIS PROMPT.

IMPORTANT PROMPT LIFECYCLE: Chi xoa file prompt nay sau khi hoan thanh tat ca muc trong prompt, pass verification, cap nhat docs, commit va push thanh cong. Neu con bat ky hang muc nao chua xong, giu nguyen file prompt va ghi ro phan con lai.

TRUOC KHI BAT DAU: Doc `AGENTS.md` va `docs/SYSTEM_MAP.md` de biet cau truc thu muc, file lien quan, va quy tac ban giao (tiet kiem token, khong quet lai toan repo). Neu muc `## Carryover Khan Cap Tu Prompt Truoc` ben duoi co noi dung, xu ly cac muc do TRUOC.

Taste Skill Frontend Rule: Khi task cham frontend/UI/layout/component/form/dashboard/admin/public page/redesign/accessibility/responsive QA, doc `docs/ai/taste-skill-integration.md` va `.cursor/rules/taste-skill-frontend.mdc` truoc khi code; audit man hinh hien tai va giu nguyen API/props/state/permission/routing/business logic neu task chi la UI.

## Carryover Khan Cap Tu Prompt Truoc

(Trong. Prompt truoc se chen loi chua sua / viec phai lam ngay vao day.)

Ban dang lam trong repo `D:\AJT\TheWedding`. Hay hoan tat cac phan con lai cua public album/social expansion: featured curation, wish moderation, search metadata consent, pagination/sort, va audit/admin reporting.

Truoc khi lam, doc:

- `docs/PRODUCT_PLAN.md`
- `docs/ROADMAP.md`
- `docs/API_DESIGN.md`
- `docs/AUTH_SECURITY.md`
- `docs/ROLE_PERMISSION.md`
- `docs/TESTING_STRATEGY.md`
- `docs/SEO_GEO_GUIDELINES.md`
- `docs/REALTIME_WEBHOOK_PLAN.md`
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
- SEO/GEO public discovery:
  - Public home, featured album list, public album detail va public site pages phai co canonical URL, title/description, Open Graph image fallback, va structured data phu hop.
  - Sitemap chi include album/site `public`, owner opt-in/indexable, khong include unlisted/private/pending moderation.
  - Public discovery metadata phai khong suy luan venue/location/age tu EXIF/AI khi owner chua opt-in.
  - Canonical URL chuan bi cho handle route `/@{userHandle}/{siteSlug}/albums/{albumSlugOrShortId}`; route cu redirect hoac canonical ve route moi khi implemented.
  - Robots/AI crawler policy phai allow chi public/indexable routes va disallow auth/admin/dashboard/API/private/signed paths.
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
- Realtime/social event compatibility:
  - Neu `08g_realtime_webhook_event_platform.md` da duoc implement, publish safe domain events cho wish created/approved/hidden/rejected va reaction created/deleted.
  - Public realtime channels chi duoc nhan wishes da visible/approved va reaction aggregate public-safe; khong bao gio phat pending/rejected/private/unlisted data ra public.
  - Owner/admin moderation channels phai permission-check theo tenant/album va khong leak email/token/raw request data.
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
- Backend tests cho realtime event payload privacy neu social events duoc publish.
- Audit export/filter tests voi redaction assertions.
- Web tests/smoke cho public home, owner moderation UI, admin curation UI, va advanced search responsive states.
- SEO/GEO tests/smoke cho sitemap filtering, canonical URL, structured data khop visible content, Open Graph preview, va private/unlisted exclusion.
- Run verification phu hop: `pnpm format:check`, `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`.

## Docs

- Update `docs/PRODUCT_PLAN.md`, `docs/API_DESIGN.md`, `docs/AUTH_SECURITY.md`, `docs/ROLE_PERMISSION.md`, `docs/TESTING_STRATEGY.md`, `docs/SEO_GEO_GUIDELINES.md` neu thay doi discovery/index policy, `docs/REALTIME_WEBHOOK_PLAN.md` neu them/sua event social, `docs/ROADMAP.md`, `docs/CHANGELOG.md`, `docs/DEVELOPMENT_LOG.md`.
- Update `docs/HUONG_DAN_SU_DUNG.md` bang tieng Viet cho owner opt-in, admin curation, wish moderation, public search, va privacy limits.
- Ghi ro featured ranking/curation rule dang dung va cac product decisions con deferred neu co.

## Ban Giao Sau Prompt (Bat Buoc)

Theo `AGENTS.md` muc 3, sau khi hoan tat (hoac dung do con viec):

- Tao/cap nhat task file trong `viec-can-lam/` cho viec nguoi dung can lam (credentials/config/QA thu cong/quyet dinh san pham), acceptance chua xong va ly do. Dung `viec-can-lam/_TEMPLATE.md`, dat vao dung muc do, roi cap nhat `viec-can-lam/README.md` nhu muc luc link/trang thai. Moi task file phai co huong dan chi tiet de nguoi dung tu lam duoc: can chuan bi gi, cac buoc thuc hien, file/env/dashboard/URL lien quan, cach smoke test/xac nhan pass, va docs lien quan.
- Neu con loi chua sua hoac viec phai lam ngay, tao/cap nhat file trong `viec-can-lam/00_khan_cap/`, roi chen tom tat + link vao muc `## Carryover Khan Cap Tu Prompt Truoc` o DAU prompt ke tiep (theo thu tu `prompts/README.md`); neu day la prompt cuoi, ghi link vao muc "Khan Cap" cua `viec-can-lam/README.md`.
- Tao/cap nhat file y tuong trong `y-tuong-nang-cap/` bang `y-tuong-nang-cap/_TEMPLATE.md`, roi cap nhat `y-tuong-nang-cap/README.md`.
- Cap nhat `docs/SYSTEM_MAP.md` neu cau truc thu muc/module/route/doc thay doi.

## Acceptance Criteria

- Featured albums khong bao gio include unlisted/private albums.
- Featured albums co owner opt-in/admin curation path ro rang va co audit logs.
- Owner/admin co the moderate wishes; public chi thay visible wishes.
- Advanced search co consent/privacy rules, pagination, sort, va tests.
- SEO/GEO pass: public canonical/metadata/schema/sitemap dung, khong leak unlisted/private/pending moderation vao search engines hoac AI-facing content.
- Audit filters/export bao gom social/discovery events va redaction pass.
- Social realtime events, neu implemented, dung shared event contract va khong leak pending/private/unlisted data.
- Public/social UI responsive, i18n-complete cho `vi`, `en`, `ja`, va khong overflow.
- `viec-can-lam/`, `viec-can-lam/README.md` va `y-tuong-nang-cap/README.md` da duoc cap nhat; moi task file trong `viec-can-lam/` co huong dan thuc hien chi tiet; viec khan cap (neu co) da chuyen sang prompt ke tiep hoac `viec-can-lam/00_khan_cap/`.
- Commit va push len `origin/main`.
