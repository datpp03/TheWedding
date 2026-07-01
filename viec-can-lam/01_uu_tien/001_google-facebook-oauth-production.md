# [~] Cấu Hình Và Smoke Test Google/Facebook OAuth Production

- Mức độ: Ưu tiên.
- Nguồn: Prompt 08A.
- Owner: Người dùng cấu hình credential, agent hỗ trợ debug nếu lỗi.
- Trạng thái: `[~]` đang chờ provider credentials và domain thật.

## Mục Tiêu

Bật Google/Facebook OAuth callback exchange/account linking trên production hoặc staging thật, đảm bảo chỉ dùng email verified và không merge tài khoản ngầm.

## Chuẩn Bị

- Quyền vào Google Cloud Console.
- Quyền vào Meta/Facebook Developer dashboard.
- Quyền cấu hình env backend API.
- Domain web `https://thewedding.d-ajt.app`.
- API `https://thewedding-api.d-ajt.app`.

## Các Bước Thực Hiện

1. Tạo OAuth app Google.
2. Thêm redirect URI Google: `https://thewedding-api.d-ajt.app/api/v1/auth/oauth/google/callback`.
3. Tạo Facebook app, bật Facebook Login.
4. Thêm redirect URI Facebook: `https://thewedding-api.d-ajt.app/api/v1/auth/oauth/facebook/callback`.
5. Trong Render/VPS backend env, đặt `GOOGLE_OAUTH_ENABLED=true`, `GOOGLE_OAUTH_CLIENT_ID`, `GOOGLE_OAUTH_CLIENT_SECRET` nếu bật Google.
6. Nếu bật Facebook, đặt `FACEBOOK_OAUTH_ENABLED=true`, `FACEBOOK_OAUTH_CLIENT_ID`, `FACEBOOK_OAUTH_CLIENT_SECRET`.
7. Kiểm tra `APP_URL`, `API_URL`, `COOKIE_DOMAIN` và `CORS_ORIGINS` khớp production.
8. Redeploy backend API.
9. Mở `/login`, xác nhận nút provider chỉ hiện khi env flag bật.
10. Test provider email đã verified và chưa có account: login thành công, app tạo user mới và quay về đúng `returnTo`.
11. Test provider email trùng account password: app phải yêu cầu đăng nhập/password rồi link trong `/dashboard/settings`, không merge ngầm.

## Nơi Cấu Hình / Kiểm Tra

- Google Cloud Console.
- Facebook Developer dashboard.
- Render/VPS Environment.
- `/login`
- `/dashboard/settings`
- API logs.

## Xác Nhận Hoàn Tất

- Provider login thành công.
- Existing-email no-silent-merge đúng.
- Link/unlink provider hoạt động.
- Callback URL không render token/code/state.
- Audit log không chứa provider token/code.

## Docs Liên Quan

- `docs/AUTH_SECURITY.md`
- `docs/API_DESIGN.md`
- `docs/ENVIRONMENT_VARIABLES.md`
- `docs/DEPLOYMENT.md`
- `docs/SEO_GEO_GUIDELINES.md`

## Ghi Chú Cho Prompt Sau

- Nếu lỗi nằm ở callback exchange hoặc account linking, mở lại Prompt 08A trước khi chạy release QA.
