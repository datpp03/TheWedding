# Prompt 01: Hoan Tat Phase 2 Auth & User

PLEASE IMPLEMENT THIS PROMPT.

Ban dang lam trong repo `D:\AJT\TheWedding`.

## Boi Canh

Phase 2 da co:

- Register, login, logout.
- Current user `/auth/me`.
- Session list, revoke one session, revoke all sessions.
- Refresh token rotation bang HttpOnly cookies.
- Backend auth unit tests co ban.
- Frontend login/register va dashboard auth status.

Phase 2 con thieu:

- Forgot password.
- Reset password.
- Email verification.
- CSRF token exchange cho cookie-authenticated mutations.
- Frontend route protection cho dashboard/admin.
- Audit log integration day du hon cho auth events.

## Muc Tieu

Hoan tat Phase 2 Auth & User de san sang sang Phase 3.

## Backend Tasks

- Implement forgot password request flow:
  - Tao password reset token hash trong `password_reset_tokens`.
  - Khong tiet lo email co ton tai hay khong.
  - Them endpoint `POST /api/v1/auth/forgot-password`.
- Implement reset password:
  - Verify token bang hash.
  - Check expiry va usedAt.
  - Update password hash bang Argon2id.
  - Revoke existing sessions cua user sau khi reset.
  - Them endpoint `POST /api/v1/auth/reset-password`.
- Implement email verification:
  - Tao email verification token hash khi register.
  - Verify token, set `emailVerifiedAt`, set status active neu hop le.
  - Them endpoint `POST /api/v1/auth/verify-email`.
- Add CSRF:
  - Endpoint lay CSRF token, vi du `GET /api/v1/auth/csrf`.
  - Middleware/guard validate CSRF cho mutation dung cookie auth.
  - Bo qua CSRF cho public non-cookie-safe endpoints neu can, nhung document ro.
- Audit:
  - Ghi audit log hoac auth security event cho forgot/reset/verify/session revoke.
  - Neu audit-log module chua du, tao interface/application service placeholder de khong lam vo kien truc.
- DTO validation ro rang bang class-validator.

## Frontend Tasks

- Wire forgot password page.
- Tao reset password page neu chua co.
- Tao email verification result page neu can.
- Add protected dashboard/admin behavior:
  - Anonymous user vao dashboard/admin thi redirect login hoac hien required sign-in state ro rang.
  - Preserve intended redirect path sau login neu hop ly.
- Form UX:
  - Loading, success, error states.
  - Preserve user input khi error.
  - Mobile responsive theo `docs/UI_UX_DESIGN.md`.

## Tests

- Unit tests cho forgot/reset/verify token logic.
- Auth e2e hoac smoke test cho:
  - forgot password generic response.
  - reset password success.
  - reset token reuse rejected.
  - verify email success.
  - dashboard anonymous behavior.
- Chay:
  - `pnpm format:check`
  - `pnpm lint`
  - `pnpm typecheck`
  - `pnpm test`
  - `pnpm build`

## Docs

- Cap nhat:
  - `docs/API_DESIGN.md`
  - `docs/AUTH_SECURITY.md`
  - `docs/DEVELOPMENT_LOG.md`
  - `docs/CHANGELOG.md`
  - `docs/ROADMAP.md`

## Acceptance Criteria

- Phase 2 roadmap co the chuyen sang completed hoac gan completed voi ghi chu ro phan email delivery that chua dau noi SMTP.
- Login/register/forgot/reset/verify co UX hoan chinh tren mobile va desktop.
- Token bi hash trong DB, khong log secret/token/password.
- Verification pass, smoke test pass, commit va push len `origin/main`.
