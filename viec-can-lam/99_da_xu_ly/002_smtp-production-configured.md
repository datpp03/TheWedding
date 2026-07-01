# [x] SMTP/Email Production Đã Cấu Hình Brevo

- Mức độ: Đã xử lý.
- Nguồn: `viec-can-lam/README.md` cũ mục cấu hình cần người dùng.
- Owner: Người dùng.
- Trạng thái: `[x]` đã làm.

## Mục Tiêu

Ghi nhận SMTP production đã được cấu hình để không yêu cầu lại credential trong prompt sau.

## Đã Thực Hiện

- Cấu hình Brevo SMTP cho môi trường triển khai.
- Sender email: `phamphucdattp@gmail.com`.
- `SMTP_PASS` được lưu trong env triển khai, không ghi vào repo.

## Cấu Hình Đã Dùng

1. `SMTP_HOST=smtp-relay.brevo.com`.
2. `SMTP_PORT=587`.
3. `SMTP_SECURE=false`.
4. `SMTP_USER` bằng tài khoản SMTP Brevo.
5. `SMTP_FROM="TheWedding-Ajt <phamphucdattp@gmail.com>"`.
6. `SMTP_PASS` lưu trong biến môi trường/dịch vụ deploy.

## Cần Kiểm Tra Lại Khi Nào

- Khi đổi sender domain.
- Khi Brevo rotate SMTP key.
- Khi production email không đến inbox.
- Khi chạy `01_uu_tien/006_smtp-production-inbox-smoke.md`.

## Docs Liên Quan

- `docs/ENVIRONMENT_VARIABLES.md`
- `docs/DEPLOYMENT.md`

## Ghi Chú Cho Prompt Sau

- Không yêu cầu người dùng paste SMTP password vào chat.
