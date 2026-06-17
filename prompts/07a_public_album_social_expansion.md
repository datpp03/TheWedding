# Prompt 07A: Public Album, Social Interaction, OAuth, Search, And Audit Expansion

PLEASE IMPLEMENT THIS PROMPT ONLY WHEN THE USER ASKS TO BUILD THE FEATURE.

IMPORTANT PROMPT LIFECYCLE: Chi xoa file prompt nay sau khi hoan thanh tat ca muc trong prompt, pass verification, cap nhat docs, commit va push thanh cong. Neu con bat ky hang muc nao chua xong, giu nguyen file prompt va ghi ro phan con lai.

Ban dang lam trong repo `D:\AJT\TheWedding`. Muc tieu cua prompt nay la mo rong product plan ve public album discovery va social interaction. Khong lam lan sang payment, B2B studio, AI, R2/CDN, watermark, hoac theme automation neu khong can cho cac muc duoi day.

Truoc khi lam, doc:

- `docs/PRODUCT_PLAN.md`
- `docs/ROADMAP.md`
- `docs/API_DESIGN.md`
- `docs/DATABASE_DESIGN.md`
- `docs/AUTH_SECURITY.md`
- `docs/ROLE_PERMISSION.md`
- `docs/UI_UX_DESIGN.md`
- `docs/TESTING_STRATEGY.md`
- module README lien quan den auth, albums, media, audit logs, admin

## Muc Tieu

Them nen tang public album discovery, featured albums, wishes, reactions, OAuth Google/Facebook, authenticated search, va audit/activity tracing theo dung privacy model.

## Phase 1: Bao Mat Va Cau Truc Mo Rong

- Chuan hoa album privacy thanh:
  - `public`: co the hien tren trang chu, search, timeline.
  - `unlisted`: chi ai co link moi xem duoc, khong xuat hien cong khai.
  - `private`: chi chu album hoac admin/support duoc phep moi xem duoc.
- Dam bao repository/API public listing chi tra album public.
- Lap migration/model/service/API contract cho:
  - OAuth provider identities.
  - featured album entries.
  - album wishes.
  - album reactions.
  - album reaction symbols.
  - album search metadata neu field da ro.
- Khong log password, token, cookie, OTP, OAuth authorization code, provider secret, hoac raw sensitive header.

## Phase 2: Trang Chu Public Va Album Noi Bat

- Route dau tien cua web la trang chu public, khong phai login.
- Hien thi album public noi bat trong ngay va trong tuan.
- Login/register la action phu, de nguoi dung van co the browse public album truoc.
- Featured ranking can ro nguon: admin curate, owner opt-in, algorithm, hoac hybrid.
- UI phai co design gate: emotion, first-look hierarchy, accent color, spacing, card hierarchy, loading/empty/error/success.

## Phase 3: Loi Chuc Va Yeu Thich/Tang Bieu Tuong Album

- Chi user da dang nhap moi duoc gui loi chuc hoac reaction.
- User chua dang nhap bam wish/reaction thi redirect sang login.
- Sau login thanh cong quay lai dung album va action context truoc do.
- Reaction symbol khong co dinh toan he thong; moi album/theme co the chon symbol hop chu de, vi du heart, star, cherry blossom, leaf, fish, hoac symbol khac da validate.
- Them rate limit, duplicate rule, moderation hook neu can, va public display data an toan.

## Phase 4: OAuth Google/Facebook Va Redirect Sau Dang Nhap

- Them Google va Facebook OAuth tren nen session/cookie/auth hien co.
- `returnTo` chi chap nhan relative same-origin path hoac allowlisted app URL.
- Khong dua token/provider secret ra frontend, response, log, hay audit metadata.
- Account linking phai an toan; neu chua ro flow, ghi vao "Can xac nhan sau" thay vi tu merge account nguy hiem.

## Phase 5: Tim Kiem Album Nang Cao Sau Dang Nhap

- Sau login, user co the tim album theo cac tieu chi da duoc xac nhan: do tuoi, khu vuc, thoi gian, dia diem/venue, chu de.
- Khong tra private album.
- Khong tra unlisted album qua search neu khong co direct-link access.
- Them pagination, sort, query limit, va validation cho filter.
- Neu field nao chua co nguon du lieu ro rang, tao placeholder docs/DTO planning va ghi "Can xac nhan sau".

## Phase 6: Audit Log Va Quan Tri Hoat Dong

- Ghi audit/security/admin events cho:
  - OAuth login success/failure.
  - privacy changes.
  - featured album curation.
  - wish/reaction moderation.
  - suspicious interaction attempts.
  - search abuse/rate limit neu co.
- Audit log phuc vu bao mat, thong ke, quan tri, nhung khong chua du lieu nhay cam.
- Admin UI/API chi can filter event moi neu scope cho phep; neu chua lam UI thi docs phai noi ro.

## Tests

- Unit/integration tests cho album privacy public/unlisted/private.
- Tests cho wish/reaction bat buoc login.
- Tests cho anonymous action -> login -> return to same album.
- Tests cho OAuth `returnTo` va open redirect rejection.
- Tests cho search khong leak private/unlisted albums.
- Tests cho audit redaction voi token/password/cookie/OTP/OAuth code.
- Responsive smoke tests cho public home, featured album cards, album detail wish/reaction states, va login return flow neu co UI.

## Docs

Cap nhat:

- `docs/PRODUCT_PLAN.md`
- `docs/ROADMAP.md`
- `docs/API_DESIGN.md`
- `docs/DATABASE_DESIGN.md`
- `docs/AUTH_SECURITY.md`
- `docs/ROLE_PERMISSION.md`
- `docs/TESTING_STRATEGY.md`
- `docs/UI_UX_DESIGN.md`
- `docs/HUONG_DAN_SU_DUNG.md` neu co UI/API user-facing
- `docs/CHANGELOG.md`
- `docs/DEVELOPMENT_LOG.md`

## Can Xac Nhan Sau

- Featured albums duoc chon bang admin curate, owner opt-in, algorithm, hay hybrid.
- Moi user duoc reaction mot lan moi album, mot lan moi symbol, hay nhieu lan theo thoi gian.
- Loi chuc co can owner moderation truoc khi public khong.
- Field do tuoi/khu vuc/thoi gian/dia diem/chu de lay tu dau va co can owner consent khong.
- OAuth co can account linking cho user email/password ngay trong slice dau tien khong.

## Acceptance Criteria

- Trang dau vao web khong bi ep la login.
- Public home chi hien album public.
- Unlisted album chi xem bang link truc tiep va khong xuat hien trong discovery/search.
- Private album chi chu album hoac authorized admin/support xem duoc.
- Wish/reaction yeu cau login va quay lai dung album sau login.
- Google/Facebook OAuth co redirect an toan va khong log du lieu nhay cam.
- Search sau login khong leak album rieng tu hoac unlisted.
- Audit events moi co redaction rule ro rang.
- Khong them feature ngoai scope prompt nay.
- Full verification pass hoac failure duoc ghi ro voi ly do.
