# [~] Cấu Hình Host Cho Media Upload Production

- Mức độ: Ưu tiên.
- Nguồn: lỗi production ngày 2026-06-20.
- Owner: Người dùng.
- Trạng thái: `[~]` đang chờ host/env production.

## Mục Tiêu

Cấu hình giới hạn upload và Redis/storage env đúng trên host để upload ảnh/video không fail vì env sai.

## Chuẩn Bị

- Quyền truy cập Render/VPS backend.
- Biến môi trường production.
- Bản deploy mới chứa sửa lỗi upload.

## Các Bước Thực Hiện

1. Vào dashboard host backend API.
2. Đặt `MAX_UPLOAD_BYTES=83886080` để cho phép ảnh tối đa 80 MB.
3. Đặt `MAX_VIDEO_UPLOAD_BYTES=629145600` nếu cần video tối đa 600 MB.
4. Nếu chưa có Redis production thật, để `REDIS_URL=` rỗng.
5. Không dùng `redis://localhost:6379` trên Render/VPS khi Redis không chạy cùng môi trường.
6. Kiểm tra storage env theo provider hiện tại: local hoặc R2.
7. Redeploy/restart backend API.
8. Upload thử 1 ảnh nhỏ, sau đó 3-5 ảnh điện thoại dung lượng lớn.

## Nơi Cấu Hình / Kiểm Tra

- Render service Environment hoặc `.env.production` trên VPS.
- Dashboard Media.
- API logs khi upload.

## Xác Nhận Hoàn Tất

- Ảnh dưới 80 MB không còn báo `File exceeds upload size limit`.
- Nếu chưa có Redis thật, upload vẫn thành công với fallback inline processing.
- Lỗi storage phải trả lỗi rõ, không trả `INTERNAL_SERVER_ERROR`.

## Docs Liên Quan

- `docs/ENVIRONMENT_VARIABLES.md`
- `docs/guides/FREE_HOSTING_VERCEL_RENDER_NEON.md`
- `docs/STORAGE_STRATEGY.md`

## Ghi Chú Cho Prompt Sau

- Nếu lỗi vẫn còn, chuyển file `004_redeploy-and-smoke-upload-error.md` lên khẩn cấp.
