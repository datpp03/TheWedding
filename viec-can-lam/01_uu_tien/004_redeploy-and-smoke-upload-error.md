# [~] Redeploy Backend Và Smoke Test Lỗi Upload INTERNAL_SERVER_ERROR

- Mức độ: Ưu tiên.
- Nguồn: lỗi production ngày 2026-06-20.
- Owner: Người dùng smoke test, agent hỗ trợ phân tích log nếu fail.
- Trạng thái: `[~]` đang chờ deploy/smoke test.

## Mục Tiêu

Xác nhận lỗi upload `INTERNAL_SERVER_ERROR` đã được xử lý trên môi trường thật.

## Chuẩn Bị

- Quyền deploy backend API.
- Quyền xem logs host.
- Tài khoản admin/owner có tenant `4fd919e3-3130-4964-93cd-abc5850b9566`.
- 2-3 ảnh test thật.

## Các Bước Thực Hiện

1. Deploy backend API từ commit mới nhất có sửa upload.
2. Đăng xuất rồi đăng nhập lại trên `https://thewedding.d-ajt.app` để xoay session/token.
3. Tạo hoặc mở album thuộc tenant cần test.
4. Upload 1 ảnh nhỏ trước.
5. Nếu pass, upload tiếp vài ảnh điện thoại dung lượng lớn.
6. Nếu lỗi vẫn còn, copy `requestId` trong response.
7. Mở log backend tương ứng với `requestId`.
8. Không dùng DevTools copied curl/fetch để test file upload vì request copy không chứa binary thật.
9. Nếu cần CLI, dùng `curl -F "albumId=..." -F "file=@D:\\path\\photo.jpg"`.

## Nơi Cấu Hình / Kiểm Tra

- Render/VPS deploy logs.
- Backend API logs.
- Dashboard Media.

## Xác Nhận Hoàn Tất

- Upload ảnh thật trả success.
- Item xuất hiện trong Media dashboard với trạng thái `queued`, `processing`, hoặc `ready`.
- File rỗng trả `400 File is empty`.
- Storage unavailable trả `503 Media storage is unavailable`, không phải `INTERNAL_SERVER_ERROR`.

## Docs Liên Quan

- `docs/TROUBLESHOOTING.md`
- `docs/STORAGE_STRATEGY.md`
- `docs/DEPLOYMENT.md`

## Ghi Chú Cho Prompt Sau

- Nếu fail, ghi `requestId`, status code, log excerpt đã redact secret và đưa vào carryover prompt kế tiếp.
