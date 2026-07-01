# [x] Nền Tảng Và Core Features Đã Xử Lý

- Mức độ: Đã xử lý.
- Nguồn: `viec-can-lam/README.md` cũ mục tham khảo nhanh.
- Owner: Agent trước đó.
- Trạng thái: `[x]` đã làm.

## Mục Tiêu

Giữ danh sách các phần không cần làm lại để prompt sau không tạo duplicate work.

## Đã Xử Lý

- Nền tảng monorepo, CI, docker, env validation, kết nối DB, migration và seed.
- Auth MVP: register/login/logout/refresh/session/forgot/reset/verify email/CSRF + route protection.
- Tenant/site MVP.
- Album & media MVP: upload/bulk/gallery/lightbox/download permission.
- Theme customization MVP.
- Admin dashboard MVP.
- System parameters/feature flags.
- Media processing ảnh bằng Sharp + BullMQ, fallback inline, derivative thumbnail/gallery/lightbox.
- Public album & social expansion MVP: public home, featured, privacy public/unlisted/private, wishes, reactions, OAuth start, search cơ bản, audit redaction.
- Phase 8 hardening backend: rate limit, correlation id, audit redaction, tenant quota, tests, backup/restore docs.
- Đường deploy free Vercel + Render + Neon.

## Nơi Cấu Hình / Kiểm Tra

- `docs/ROADMAP.md`.
- `docs/DEVELOPMENT_LOG.md`.
- `docs/CHANGELOG.md`.

## Xác Nhận Hoàn Tất

- Chỉ mở lại các phần này khi có bug hoặc yêu cầu nâng cấp cụ thể.

## Docs Liên Quan

- `docs/ROADMAP.md`
- `docs/DEVELOPMENT_LOG.md`
- `docs/CHANGELOG.md`

## Ghi Chú Cho Prompt Sau

- Nếu prompt sau yêu cầu sửa một phần đã xong, tạo task mới theo bug/upgrade cụ thể.
