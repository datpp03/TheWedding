# [ ] Cân Nhắc Bổ Sung MFA Recovery/Backup Codes Trước Public Launch

- Mức độ: Có thể đợi, nhưng nên làm trước khi khuyến nghị bật MFA đại trà.
- Nguồn: Prompt 08A.
- Owner: Người dùng chốt policy, agent triển khai.
- Trạng thái: `[ ]` chưa làm.

## Mục Tiêu

Thiết kế và triển khai đường recovery an toàn khi user mất thiết bị TOTP.

## Chuẩn Bị

- Quyết định sản phẩm về số lượng backup code.
- Cách regenerate backup code.
- Cách support xác minh danh tính khi mất thiết bị.
- Policy có bắt buộc download/copy code ngay khi tạo hay không.

## Các Bước Thực Hiện

1. Chốt policy backup code, ví dụ 8-10 mã dùng một lần.
2. Chỉ hiển thị raw code một lần khi tạo.
3. Thiết kế lưu hash code, không lưu raw code.
4. Thêm UI tải/copy backup codes.
5. Thêm regenerate sau khi xác thực OTP.
6. Thêm login challenge dùng backup code.
7. Cập nhật docs/test trước khi khuyến nghị bật MFA đại trà.

## Nơi Cấu Hình / Kiểm Tra

- Future prompt auth hardening.
- `docs/AUTH_SECURITY.md`.
- `/dashboard/settings`.
- Login MFA challenge flow.

## Xác Nhận Hoàn Tất

- User mất thiết bị vẫn có đường recovery an toàn.
- Support không cần xem secret/OTP.
- Backup code dùng một lần và được hash.

## Docs Liên Quan

- `docs/AUTH_SECURITY.md`
- `docs/ROADMAP.md`

## Ghi Chú Cho Prompt Sau

- Nếu public launch khuyến nghị MFA, chuyển việc này lên `01_uu_tien/`.
