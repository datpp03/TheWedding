# [~] Persistent Session Browser QA Trên Production/Staging

- Mức độ: Ưu tiên.
- Nguồn: Prompt 08A.
- Owner: Người dùng.
- Trạng thái: `[~]` đang chờ browser QA thật.

## Mục Tiêu

Xác nhận refresh cookie persistent restore session đúng sau hard refresh, đóng/mở browser, logout và revoke session.

## Chuẩn Bị

- Tài khoản user test.
- Trình duyệt thật.
- Quyền revoke session qua UI/API nếu cần.
- Web/API đã deploy với `REFRESH_TOKEN_EXPIRES_IN` mong muốn.

## Các Bước Thực Hiện

1. Đăng nhập vào app.
2. Mở `/dashboard`.
3. Hard refresh dashboard; app phải giữ đăng nhập.
4. Đóng tab/browser rồi mở lại `/dashboard`.
5. Nếu refresh cookie còn hạn, app phải tự restore session.
6. Mở `/`; public home vẫn là discovery page và chỉ hiện signed-in nav/action state.
7. Đăng xuất rõ ràng.
8. Mở lại `/dashboard`; app phải yêu cầu đăng nhập.
9. Đăng nhập lại, revoke current session hoặc revoke all sessions.
10. Hard refresh/direct dashboard phải chuyển về signed-out flow.

## Nơi Cấu Hình / Kiểm Tra

- Browser DevTools Application cookies.
- `/`.
- `/dashboard`.
- `/login`.
- API `/auth/sessions`.

## Xác Nhận Hoàn Tất

- Access token vẫn ngắn hạn.
- Refresh cookie persistent đúng TTL.
- Logout/revoke/revoke-all/expired refresh không tạo redirect loop.

## Docs Liên Quan

- `docs/AUTH_SECURITY.md`
- `docs/TESTING_STRATEGY.md`
- `docs/HUONG_DAN_SU_DUNG.md`

## Ghi Chú Cho Prompt Sau

- Nếu có redirect loop, đưa URL, cookie state và network sequence đã redact vào prompt kế tiếp.
