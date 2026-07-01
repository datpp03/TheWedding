# [ ] Chạy Migration Album Slug Và Smoke Test URL Album Public

- Mức độ: Ưu tiên.
- Nguồn: public album route migration handoff.
- Owner: Người dùng.
- Trạng thái: `[ ]` chưa làm.

## Mục Tiêu

Chạy migration album slug trên DB thật/sạch và xác nhận public album URL mới hoạt động mà không làm lộ album private.

## Chuẩn Bị

- Quyền chạy migration backend.
- Quyền deploy API/Web.
- Một album public hiện có.
- Một album unlisted.
- Một album private để kiểm tra privacy.

## Các Bước Thực Hiện

1. Backup database trước khi migrate nếu đang ở production.
2. Deploy API có migration `1710000011000-AlbumPublicSlugs`.
3. Chạy migration theo quy trình hiện tại của host.
4. Deploy Web mới nhất.
5. Mở public home, click một album public.
6. Xác nhận URL có dạng `/albums/{ten-album-shortid}` thay vì UUID dài.
7. Mở lại link UUID cũ `/albums/{albumId}`.
8. Xác nhận app redirect sang slug nếu album còn public/unlisted hợp lệ.
9. Mở album private bằng UUID/slug nếu biết.

## Nơi Cấu Hình / Kiểm Tra

- Database migrations.
- Deploy logs API/Web.
- Public home.
- `/albums/{albumSlug}`.
- `/albums/{albumId}`.

## Xác Nhận Hoàn Tất

- Album public/unlisted vào được bằng slug.
- Link UUID cũ không vỡ.
- Private album không xem được.
- Không có lỗi migration unique index.

## Docs Liên Quan

- `docs/API_DESIGN.md`
- `docs/DATABASE_DESIGN.md`
- `docs/SEO_GEO_GUIDELINES.md`
- `docs/DEPLOYMENT.md`

## Ghi Chú Cho Prompt Sau

- Nếu slug collision hoặc redirect sai, xử lý trước public discovery/release QA.
