# [~] MFA/TOTP Browser Smoke Test Với Tài Khoản Thật

- Mức độ: Ưu tiên.
- Nguồn: Prompt 08A.
- Owner: Người dùng.
- Trạng thái: `[~]` đang chờ deploy và tài khoản test.

## Mục Tiêu

Xác nhận user có thể bật/tắt MFA và login không cấp session đầy đủ trước khi OTP hợp lệ.

## Chuẩn Bị

- Tài khoản user test.
- Điện thoại hoặc app TOTP: Google Authenticator, Microsoft Authenticator, 1Password hoặc tương đương.
- Web/API đã deploy.

## Các Bước Thực Hiện

1. Đăng nhập vào app.
2. Mở `/dashboard/settings`.
3. Trong `Bảo mật tài khoản`, bấm `Bật MFA`.
4. Thêm secret/URI vào app TOTP.
5. Nhập mã 6 số để bật MFA.
6. Đăng xuất.
7. Đăng nhập lại bằng password.
8. Xác nhận app chuyển sang màn nhập OTP và chưa vào dashboard.
9. Nhập sai OTP để thấy lỗi thân thiện.
10. Nhập đúng OTP để vào dashboard.
11. Quay lại `/dashboard/settings`, nhập OTP hiện tại để tắt MFA nếu muốn kết thúc test.

## Nơi Cấu Hình / Kiểm Tra

- `/dashboard/settings`.
- `/login`.
- App TOTP.
- API logs.

## Xác Nhận Hoàn Tất

- MFA bật/tắt được.
- Login user đã bật MFA không cấp session trước OTP.
- Lỗi OTP không lộ secret hoặc challenge token.

## Docs Liên Quan

- `docs/AUTH_SECURITY.md`
- `docs/API_DESIGN.md`
- `docs/HUONG_DAN_SU_DUNG.md`

## Ghi Chú Cho Prompt Sau

- Backup code chưa có; nếu muốn public launch với MFA rộng rãi, xử lý `02_co_the_doi/014_mfa-backup-codes-policy.md`.
