# Prompt 08A: Auth Email, MFA, And OAuth Completion

PLEASE IMPLEMENT THIS PROMPT.

IMPORTANT PROMPT LIFECYCLE: Chi xoa file prompt nay sau khi hoan thanh tat ca muc trong prompt, pass verification, cap nhat docs, commit va push thanh cong. Neu con bat ky hang muc nao chua xong, giu nguyen file prompt va ghi ro phan con lai.

TRUOC KHI BAT DAU: Doc `AGENTS.md` va `docs/SYSTEM_MAP.md` de biet cau truc thu muc, file lien quan, va quy tac ban giao (tiet kiem token, khong quet lai toan repo). Neu muc `## Carryover Khan Cap Tu Prompt Truoc` ben duoi co noi dung, xu ly cac muc do TRUOC.

## Carryover Khan Cap Tu Prompt Truoc

(Trong. Prompt truoc se chen loi chua sua / viec phai lam ngay vao day.)

Ban dang lam trong repo `D:\AJT\TheWedding`. Hay hoan tat cac phan auth con dang do: email delivery that, MFA/TOTP, va Google/Facebook OAuth callback exchange/account linking.

Truoc khi lam, doc:

- `docs/PRODUCT_PLAN.md`
- `docs/PROJECT_OVERVIEW.md`
- `docs/API_DESIGN.md`
- `docs/AUTH_SECURITY.md`
- `docs/ROLE_PERMISSION.md`
- `docs/TESTING_STRATEGY.md`
- `docs/SEO_GEO_GUIDELINES.md`
- `docs/HUONG_DAN_SU_DUNG.md`

## Muc Tieu

Dang nhap/dang ky/quen mat khau phai san sang hon cho production: khong tra token nhay cam trong response production, co email SMTP adapter, co MFA enrollment/challenge, va co login Google/Facebook that su an toan voi return-to-album flow.

## Tasks

- Baseline auth diagnosis:
  - Verify web login form dang dung dung method `POST /api/v1/auth/login`.
  - Kiem tra khong co link, redirect, fetch, prefetch, hoac browser navigation nao goi `GET /api/v1/auth/login`.
  - Reproduce loi login gan day neu local/env cho phep; neu con loi `Cannot GET /api/v1/auth/login` hoac `INTERNAL_SERVER_ERROR`, sua root cause va them regression test/smoke note.
- Persistent browser session:
  - Audit current cookie/session lifetime across tab close, browser close/reopen, hard refresh, app boot, direct dashboard visit, and visiting public `/`.
  - Ensure refresh token cookie is persistent according to `REFRESH_TOKEN_EXPIRES_IN` while access token stays short-lived. Khong bien access token thanh long-lived token.
  - On web app boot and public home load, restore auth state silently via safe `/api/v1/auth/me` and/or refresh flow when the refresh cookie is still valid.
  - Public home van la public discovery page; neu user da dang nhap thi chi hien signed-in navigation/action state, khong redirect khoi trang chu va khong expose private tenant/admin data.
  - Handle expired, revoked, or reused refresh sessions bang signed-out UI ro rang; khong tao redirect loop giua `/`, login, va dashboard.
  - Explicit logout, revoke current session, revoke all sessions, refresh-token rotation/reuse detection, CSRF, HttpOnly, SameSite, Secure cookie flags phai van dung.
- SMTP/email delivery:
  - Tao email delivery abstraction voi SMTP provider dau tien.
  - Them env vars cho SMTP host/port/secure/user/pass/from/reply-to va che do local development.
  - Forgot password va email verification gui email that khi SMTP duoc cau hinh.
  - Local/dev co the log hoac tra dev token de QA nhanh, nhung production khong duoc tra reset/verification token trong API payload.
  - Email template phai tranh log raw token, password, cookie, OTP, OAuth code, hoac provider secret.
  - Them rate limit/audit event cho resend verification va forgot password neu chua co.
- MFA/TOTP:
  - Dung cac field MFA-ready da co de implement TOTP enrollment.
  - API can co flow: start enrollment, verify enrollment, disable MFA, login challenge, va recovery/backup code neu scope phu hop.
  - Login password/OAuth thanh cong voi user da bat MFA phai tao challenge tam thoi, khong cap full session truoc khi OTP hop le.
  - UI can co man quan ly MFA trong account/settings va buoc nhap OTP trong login flow.
  - Secret phai duoc encrypt/hashed theo kien truc hien co; khong log OTP/secret.
- Google/Facebook OAuth completion:
  - Hoan tat provider adapter cho Google va Facebook: authorization URL, callback code exchange, userinfo/profile fetch, verified email detection, va error mapping.
  - Dung state/nonce/PKCE neu phu hop voi provider va stack hien co.
  - Giu validation `returnTo`: chi chap nhan relative same-origin path hoac allowlisted app URL.
  - Implement account linking an toan:
    - Neu provider account da linked, login binh thuong.
    - Neu email provider verified va chua ton tai user, tao user moi voi email verified.
    - Neu email da ton tai nhung provider chua linked, khong silently merge. Mac dinh yeu cau user login bang password truoc roi link provider trong settings, hoac dung mot explicit confirmation flow an toan.
    - Neu provider khong co verified email, block login/linking voi loi than thien.
  - Them UI nut Google/Facebook login chi hien khi provider duoc enable bang env/feature flag.
  - OAuth callback phai set session cookie/CSRF theo cung security model hien co.
  - Audit events cho start/completed/failed/link/unlink phai redact token/code/secret.
- Account settings:
  - Cho user xem va unlink OAuth provider da ket noi neu an toan.
  - Khong cho unlink provider cuoi cung neu user khong co password dang nhap hoac khong co phuong thuc dang nhap thay the.
- Feature/runtime controls:
  - Ton trong system parameter disable login/register.
  - Them provider-enabled flags/env validation de local dev khong can secret.
  - Loi missing provider secret phai ro rang, khong crash app khi feature off.
- SEO/GEO safety:
  - Auth pages, reset/verify routes, MFA challenge, OAuth callback, account-linking confirmation va error callback routes phai `noindex` va khong vao sitemap.
  - OAuth/returnTo/callback URLs khong duoc render token/code/state nhay cam trong title, description, Open Graph, logs, structured data, browser-visible copy, hoac analytics payload.
  - Login/register public marketing copy neu co phai tu nhien, khong keyword stuffing, va khong lam trang auth thanh landing page indexable neu chua co policy ro.

## UX

- Login/register/forgot/reset/MFA/OAuth screens phai mobile responsive va khong overflow voi `vi`, `en`, `ja`.
- OAuth va MFA errors phai noi ro viec can lam tiep, khong lo thong tin nhay cam.
- Return-to-album sau wish/reaction phai dua user ve dung album/action context khi auth thanh cong.
- Tat ca copy moi phai dung i18n/l10n keys, co `vi`, `en`, `ja`.

## Tests

- Unit/integration tests cho SMTP off/dev/prod behavior.
- Tests dam bao production khong tra reset/verification token.
- Tests cho TOTP enrollment, invalid OTP, expired challenge, disable MFA, va login MFA challenge.
- Tests cho OAuth state validation, open redirect rejection, provider callback success/failure, existing-email no-silent-merge, verified-email-only linking, provider unlink guard.
- Tests cho `disableLogin`/`disableRegistration` khi OAuth/MFA dang active.
- Web tests/smoke cho login password, forgot password, MFA challenge, OAuth button enabled/disabled, return-to-album, browser close/reopen session restore, hard refresh, direct dashboard visit, va public home signed-in state.
- Regression tests/smoke cho logout, revoke current session, revoke all sessions, expired refresh cookie, va reused refresh token de dam bao persistent session khong song qua cac action nay.
- SEO/GEO smoke cho auth/OAuth/reset routes: noindex/no sitemap, metadata khong lo token/code/state, callback routes khong co structured data public.
- Run verification phu hop: `pnpm format:check`, `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`.

## Docs

- Update `docs/AUTH_SECURITY.md`, `docs/API_DESIGN.md`, `docs/ENVIRONMENT_VARIABLES.md`, `docs/DEPLOYMENT.md`, `docs/TESTING_STRATEGY.md`, `docs/SEO_GEO_GUIDELINES.md` neu thay doi noindex/auth route policy, `docs/ROADMAP.md`, `docs/CHANGELOG.md`, `docs/DEVELOPMENT_LOG.md`.
- Update `docs/HUONG_DAN_SU_DUNG.md` bang tieng Viet cho SMTP, forgot/reset, verify email, MFA, Google/Facebook login, account linking, va troubleshooting.
- Neu production van chua co SMTP/OAuth credentials, docs phai noi ro cach tat feature va loi ky vong.

## Ban Giao Sau Prompt (Bat Buoc)

Theo `AGENTS.md` muc 3, sau khi hoan tat (hoac dung do con viec):

- Cap nhat `VIEC_CAN_LAM.md` (thu muc goc): viec nguoi dung can lam (credentials/config/QA thu cong/quyet dinh san pham), acceptance chua xong va ly do. Moi item phai kem huong dan chi tiet de nguoi dung tu lam duoc: can chuan bi gi, cac buoc thuc hien, file/env/dashboard/URL lien quan, cach smoke test/xac nhan pass, va docs lien quan.
- Neu con loi chua sua hoac viec phai lam ngay, chen vao muc `## Carryover Khan Cap Tu Prompt Truoc` o DAU prompt ke tiep (theo thu tu `prompts/README.md`); neu day la prompt cuoi, ghi vao muc "Khan cap" cua `VIEC_CAN_LAM.md`.
- Bo sung y tuong nang cap/mo rong tu nghi ra vao `Y_TUONG_NANG_CAP.md` (thu muc goc).
- Cap nhat `docs/SYSTEM_MAP.md` neu cau truc thu muc/module/route/doc thay doi.

## Acceptance Criteria

- Normal login khong con tao request `GET /api/v1/auth/login`.
- User van dang nhap sau khi dong/mo lai browser, hard refresh, hoac quay ve trang chu neu refresh token chua het han/chua bi revoke.
- Public home van public/indexable theo policy, nhung co the hien signed-in navigation/action state khi session con hop le ma khong lo du lieu private.
- Logout, revoke current session, revoke all sessions, expired refresh cookie, va refresh-token reuse deu ket thuc persisted session dung mong doi.
- Production khong expose reset/verification token trong API payload.
- Forgot password va verification email gui qua SMTP khi cau hinh day du.
- User co the bat/tat MFA an toan va bi yeu cau OTP khi dang nhap neu MFA enabled.
- Google/Facebook OAuth callback exchange hoat dong voi provider credentials hop le.
- Account linking khong silently merge existing email/password accounts.
- OAuth returnTo khong bi open redirect va van tra user ve album khi hop le.
- Sensitive auth/OAuth/MFA data khong xuat hien trong audit logs.
- Auth/OAuth/reset/MFA callback routes khong indexable, khong vao sitemap, va metadata khong lo token/code/state.
- Docs/env/test coverage du de mot dev moi cau hinh va QA auth flows.
- `VIEC_CAN_LAM.md` va `Y_TUONG_NANG_CAP.md` da duoc cap nhat; moi item trong `VIEC_CAN_LAM.md` co huong dan thuc hien chi tiet; viec khan cap (neu co) da chuyen sang prompt ke tiep hoac muc "Khan cap".
- Commit va push len `origin/main`.
