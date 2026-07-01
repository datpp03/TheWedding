# [~] Smoke Test Upload Theo Plan/Entitlement

- Mức độ: Có thể đợi.
- Nguồn: Prompt 08 Phase 9 Plan-Aware Upload Gates.
- Owner: Người dùng.
- Trạng thái: `[~]` đang chờ production/staging deploy.

## Mục Tiêu

Xác nhận upload ảnh/video bị gate đúng theo plan/entitlement và không ghi object khi vượt quota.

## Chuẩn Bị

- Tài khoản owner có tenant/albums thật.
- Tài khoản admin có `admin.access`.
- 3 ảnh JPEG/WebP nhỏ.
- 1 ảnh điện thoại gần giới hạn 80 MB.
- File MP4 nhỏ nếu test video.

## Các Bước Thực Hiện

1. Deploy backend API từ commit mới nhất.
2. Đăng nhập admin, mở `https://thewedding.d-ajt.app/admin/scale`.
3. Ghi lại `tenantId` cần test.
4. Cấp entitlement storage boost nếu tenant free đã hết quota.
5. Vào `https://thewedding.d-ajt.app/dashboard/media`.
6. Chọn tenant/album và upload ảnh nhỏ.
7. Upload tiếp ảnh lớn dưới `MAX_UPLOAD_BYTES`.
8. Theo dõi trạng thái `queued/processing/ready`.
9. Nếu test video, bật feature flag `scale.video_uploads`.
10. Cấp plan/entitlement phù hợp trước khi upload MP4.
11. Nếu chưa bật gate, upload video phải bị từ chối.

## Nơi Cấu Hình / Kiểm Tra

- `/admin/scale`.
- Admin settings feature flags.
- Dashboard Media.
- Render API logs.
- Cloudflare R2 bucket nếu `STORAGE_PROVIDER=r2`.

## Xác Nhận Hoàn Tất

- Upload ảnh hợp lệ thành công.
- Vượt storage/photo/video/file-size bị từ chối trước khi object được ghi.
- Video chỉ upload được khi plan/entitlement và feature flag cho phép.

## Docs Liên Quan

- `docs/HUONG_DAN_SU_DUNG.md`
- `docs/API_DESIGN.md`
- `docs/STORAGE_STRATEGY.md`
- `docs/TESTING_STRATEGY.md`

## Ghi Chú Cho Prompt Sau

- Nếu gate sai, ưu tiên fix trước khi bật gói trả phí.
