# [~] Kiểm Tra Secrets Trên Vercel/Render/Neon/VPS

- Mức độ: Ưu tiên.
- Nguồn: deployment handoff.
- Owner: Người dùng.
- Trạng thái: `[~]` đang chờ quyền dashboard/host.

## Mục Tiêu

Đảm bảo production/staging có đầy đủ secret bắt buộc và không dùng giá trị dev yếu hoặc thiếu CORS/cookie domain.

## Chuẩn Bị

- Quyền vào Vercel project.
- Quyền vào Render backend service.
- Quyền vào Neon database.
- Quyền vào VPS nếu dùng Prompt 10.
- Danh sách env trong `docs/ENVIRONMENT_VARIABLES.md`.

## Các Bước Thực Hiện

1. Kiểm tra `DATABASE_URL` trỏ đúng DB.
2. Kiểm tra `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, `COOKIE_SECRET` đủ mạnh.
3. Kiểm tra `APP_URL`, `API_URL`, `CORS_ORIGINS`, `COOKIE_DOMAIN` đúng domain deploy.
4. Kiểm tra SMTP/OAuth/R2/MoMo secrets theo feature đang bật.
5. Xóa hoặc tắt env cho feature chưa dùng để tránh bật nhầm.
6. Redeploy service sau khi đổi env.
7. Chạy smoke test login, refresh, upload và route public cơ bản.

## Nơi Cấu Hình / Kiểm Tra

- Vercel Environment Variables.
- Render Environment.
- Neon dashboard.
- `.env.production` trên VPS nếu self-host.

## Xác Nhận Hoàn Tất

- Không có secret dev/placeholder trên production.
- CORS/cookie hoạt động giữa web và API.
- Login/refresh không lỗi cookie domain.
- Không có secret trong git diff.

## Docs Liên Quan

- `docs/ENVIRONMENT_VARIABLES.md`
- `docs/DEPLOYMENT.md`
- `docs/AUTH_SECURITY.md`

## Ghi Chú Cho Prompt Sau

- Nếu thêm env mới trong prompt sau, cập nhật task này hoặc tạo file mới cùng nhóm.
