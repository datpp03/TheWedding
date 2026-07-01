# [~] SMTP Production Inbox Smoke Test

- Mức độ: Ưu tiên.
- Nguồn: Prompt 08A.
- Owner: Người dùng.
- Trạng thái: `[~]` đang chờ môi trường deploy và inbox thật.

## Mục Tiêu

Xác nhận forgot password và email verification gửi email thật qua SMTP, đồng thời production không trả raw token nhạy cảm.

## Chuẩn Bị

- SMTP provider thật như Brevo, SendGrid, Mailgun hoặc tương đương.
- Sender đã verify.
- Quyền cấu hình Render/VPS env.
- Một email test nhận được thư.

## Các Bước Thực Hiện

1. Cấu hình `MAIL_PROVIDER=smtp`.
2. Cấu hình `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_FROM`.
3. Cấu hình `SMTP_REPLY_TO` nếu cần.
4. Nếu provider yêu cầu auth, thêm `SMTP_USER` và `SMTP_PASSWORD` vào host secrets.
5. Không commit SMTP password vào repo.
6. Redeploy backend API.
7. Mở `/forgot-password`, gửi email test.
8. Mở inbox và bấm link reset.
9. Tạo tài khoản mới hoặc dùng resend verification để kiểm tra email verify.
10. Xem API response trên production.

## Nơi Cấu Hình / Kiểm Tra

- Render/VPS Environment.
- SMTP dashboard.
- Inbox email test.
- `/forgot-password`.
- `/verify-email`.

## Xác Nhận Hoàn Tất

- Email đến inbox thật.
- Link reset/verify hoạt động.
- Production response không có `devResetToken` hoặc `devEmailVerificationToken`.
- Log không chứa reset/verification token.

## Docs Liên Quan

- `docs/ENVIRONMENT_VARIABLES.md`
- `docs/DEPLOYMENT.md`
- `docs/AUTH_SECURITY.md`

## Ghi Chú Cho Prompt Sau

- Nếu SMTP fail, ghi rõ provider, mã lỗi SMTP đã redact và env thiếu/sai.
