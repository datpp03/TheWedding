# [x] Các Quyết Định Sản Phẩm Đã Chốt

- Mức độ: Quyết định sản phẩm.
- Nguồn: `viec-can-lam/README.md` cũ.
- Owner: Người dùng đã chốt, agent tham chiếu khi triển khai.
- Trạng thái: `[x]` đã làm.

## Mục Tiêu

Giữ lại các quyết định đã chốt để prompt sau không hỏi lại hoặc triển khai ngược policy.

## Quyết Định Đã Chốt

- Featured albums dùng mô hình `hybrid + owner opt-in + admin curated`.
- Lời chúc mới phải qua owner/admin duyệt trước khi hiển thị public.
- Reaction dùng rule `một reaction trên mỗi biểu tượng/album`.
- Search metadata chỉ dùng metadata an toàn và có owner opt-in.
- OAuth account linking chỉ tự liên kết khi provider email đã verified.
- Gói dịch vụ định hướng: Free, Couple Essential, Couple Premium, Studio Starter, Studio Pro.
- Custom domain chỉ bật cho `Studio Pro` hoặc admin cấp thủ công.

## Áp Dụng Khi Làm

1. Public discovery/moderation/search phải tôn trọng owner opt-in và privacy boundary.
2. OAuth/linking/audit phải tôn trọng verified-email-only.
3. Payment/plan/entitlement phải theo hướng gói đã chốt, chưa bật purchase khi MoMo thật chưa pass.
4. Custom domain phải có DNS verification trước khi active.

## Nơi Cấu Hình / Kiểm Tra

- `docs/PRODUCT_PLAN.md`.
- `docs/API_DESIGN.md`.
- `docs/SEO_GEO_GUIDELINES.md`.
- `docs/AUTH_SECURITY.md`.
- `docs/ROADMAP.md`.

## Xác Nhận Hoàn Tất

- Prompt mới không hỏi lại các quyết định này trừ khi người dùng yêu cầu đổi.
- Feature mới không vi phạm privacy/gate đã chốt.

## Docs Liên Quan

- `docs/PRODUCT_PLAN.md`
- `docs/API_DESIGN.md`
- `docs/SEO_GEO_GUIDELINES.md`
- `docs/AUTH_SECURITY.md`
- `docs/ROADMAP.md`

## Ghi Chú Cho Prompt Sau

- Nếu người dùng đổi một quyết định, tạo file mới trong `03_quyet_dinh_san_pham/` thay vì sửa mơ hồ trong prompt.
