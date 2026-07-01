# [~] Cấu Hình Cloudflare R2 Object Storage Production

- Mức độ: Ưu tiên.
- Nguồn: storage/media handoff.
- Owner: Người dùng.
- Trạng thái: `[~]` đang chờ bucket/access key và smoke test.

## Mục Tiêu

Chuyển media upload sang R2/S3-compatible object storage và xác nhận upload production ổn định.

## Chuẩn Bị

- Tài khoản Cloudflare có quyền bật R2.
- Quyền vào Render backend API env.
- 1-3 ảnh test nhỏ và 1-3 ảnh điện thoại dung lượng lớn.
- R2 key mới, không dùng key đã bị lộ.

## Các Bước Thực Hiện

1. Vào Cloudflare dashboard, mở `R2 Object Storage`.
2. Tạo bucket private, ví dụ `thewedding-media-prod`.
3. Ghi lại Cloudflare `Account ID`.
4. Tạo R2 access key/API token có quyền đọc, ghi và xóa object trong bucket production.
5. Vào Render backend API Environment.
6. Cấu hình `STORAGE_PROVIDER=r2`.
7. Cấu hình `S3_ENDPOINT=https://<ACCOUNT_ID>.r2.cloudflarestorage.com`.
8. Cấu hình `S3_REGION=auto`, `S3_BUCKET`, `S3_ACCESS_KEY`, `S3_SECRET_KEY`.
9. Cấu hình `STORAGE_SIGNED_URL_TTL_SECONDS=900`, `MAX_UPLOAD_BYTES=83886080`, `MAX_VIDEO_UPLOAD_BYTES=629145600`.
10. Để `STORAGE_PUBLIC_BASE_URL=` rỗng nếu chưa có public/custom domain cho R2.
11. Redeploy backend API.
12. Đăng xuất/đăng nhập lại app, vào dashboard Media, upload ảnh nhỏ trước rồi upload ảnh lớn.
13. Mở R2 bucket, kiểm tra object dưới `tenants/{tenantId}/media/{mediaId}/original/` và `versions/`.

## Nơi Cấu Hình / Kiểm Tra

- Cloudflare R2 dashboard.
- Render backend API Environment.
- `https://thewedding.d-ajt.app/dashboard/media`.
- Backend API logs.

## Xác Nhận Hoàn Tất

- Upload trả success.
- Media chuyển `queued/processing` sang `ready`.
- Dashboard xem/tải ảnh được.
- R2 bucket có original và derivative WebP.
- Không còn lỗi `Media storage is unavailable`.

## Docs Liên Quan

- `docs/guides/CLOUDFLARE_R2_SETUP.md`
- `docs/ENVIRONMENT_VARIABLES.md`
- `docs/STORAGE_STRATEGY.md`
- `docs/DEPLOYMENT.md`

## Ghi Chú Cho Prompt Sau

- Nếu làm Prompt 08D, cập nhật task này với signed URL/direct upload/multipart nếu scope thay đổi.
