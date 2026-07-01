# Passkey/WebAuthn Cho Đăng Nhập Không Mật Khẩu

- Nhóm: Vận hành & chất lượng.
- Trạng thái: Gợi ý.
- Tác động: cao.
- Độ phức tạp: trung bình-cao.
- Phụ thuộc: account security UI, credential challenge store, browser support QA, recovery policy.

## Mô Tả

Cho phép user thêm passkey trên thiết bị cá nhân, dùng như phương thức đăng nhập hoặc MFA mạnh hơn OTP.

## Giá Trị

- Giảm rủi ro phishing.
- Nâng chất lượng bảo mật tài khoản.

## Gợi Ý Triển Khai

1. Thiết kế credential registration/challenge store.
2. Thêm UI quản lý passkey trong account security.
3. Hỗ trợ login challenge bằng WebAuthn.
4. Thiết kế recovery policy trước khi bật rộng.

## Rủi Ro / Lưu Ý

- Cần browser/device QA rộng.
- Không thay thế recovery/backup policy.

## Prompt Sau

- Làm sau khi MFA backup codes được chốt.
