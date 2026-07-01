# [ ] Smoke Test Social Panel Album Công Khai

- Mức độ: Có thể đợi.
- Nguồn: public album/social handoff.
- Owner: Người dùng hoặc agent khi có fixture DB.
- Trạng thái: `[ ]` chưa làm.

## Mục Tiêu

Kiểm tra social panel album công khai với dữ liệu thật vì hiện chưa có fixture album public trong DB hiện tại.

## Chuẩn Bị

- Một album public có media.
- Một album unlisted và một album private để kiểm tra boundary.
- User/guest test.
- Browser thật.

## Các Bước Thực Hiện

1. Deploy hoặc chạy local với DB có album public.
2. Mở public home và vào album public.
3. Gửi wish/reaction theo rule hiện tại.
4. Kiểm tra trạng thái pending/approved nếu moderation đã bật.
5. Kiểm tra duplicate reaction cùng biểu tượng.
6. Mở album unlisted bằng link trực tiếp.
7. Thử mở album private bằng link đoán được nếu có.
8. Kiểm tra API logs/audit redaction.

## Nơi Cấu Hình / Kiểm Tra

- Public home.
- `/albums/{albumSlugOrId}`.
- API public album endpoints.
- Audit logs.

## Xác Nhận Hoàn Tất

- Album public hiển thị đúng.
- Wish/reaction hoạt động theo policy.
- Private album không expose nội dung.
- Log không chứa dữ liệu nhạy cảm.

## Docs Liên Quan

- `docs/API_DESIGN.md`
- `docs/SEO_GEO_GUIDELINES.md`
- `docs/AUTH_SECURITY.md`
- `docs/TESTING_STRATEGY.md`

## Ghi Chú Cho Prompt Sau

- Nếu thiếu fixture, tạo seed/test data nhỏ trước khi release QA.
