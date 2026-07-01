# [ ] Hoàn Thiện B2B Studio, Custom Domain, Watermark, AI, Theme Và Greeting

- Mức độ: Có thể đợi.
- Nguồn: Phase 9 scale carryover.
- Owner: Người dùng chốt ưu tiên, agent triển khai theo prompt riêng.
- Trạng thái: `[ ]` chưa làm.

## Mục Tiêu

Tách các placeholder lớn của Phase 9 thành prompt riêng để không trộn quá nhiều domain trong một lần triển khai.

## Chuẩn Bị

- Quyết định ưu tiên sản phẩm: B2B studio, custom domain, watermark, AI tagging, contextual theme, greeting scheduler.
- Feature gate/plan gate cho từng phần.
- Data/test account cho studio và couple.

## Các Bước Thực Hiện

1. Chọn 1-2 mảng có tác động lớn nhất cho release tiếp theo.
2. Viết prompt riêng cho từng mảng thay vì gom chung.
3. Với custom domain, thiết kế DNS verification và canonical policy trước.
4. Với watermark/AI, giữ sau feature flag và plan gate.
5. Với greeting scheduler, xác định event/timezone/privacy trước.
6. Cập nhật roadmap và product plan sau khi chốt scope.

## Nơi Cấu Hình / Kiểm Tra

- `docs/PRODUCT_PLAN.md`.
- `docs/ROADMAP.md`.
- `/admin/scale`.
- Feature flags/system parameters.

## Xác Nhận Hoàn Tất

- Mỗi mảng có prompt/scope riêng.
- Không có placeholder nào được bật public khi chưa verify.
- Gate đúng theo Free/Couple/Studio/Admin.

## Docs Liên Quan

- `docs/PRODUCT_PLAN.md`
- `docs/ROADMAP.md`
- `docs/SEO_GEO_GUIDELINES.md`
- `docs/UI_UX_DESIGN.md`

## Ghi Chú Cho Prompt Sau

- Đây là umbrella task; khi tách prompt, tạo task file con cụ thể hơn.
