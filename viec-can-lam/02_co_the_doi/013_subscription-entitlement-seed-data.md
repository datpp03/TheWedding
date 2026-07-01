# [~] Chốt Dữ Liệu Subscription/Entitlement Mẫu Cho QA

- Mức độ: Có thể đợi.
- Nguồn: Phase 9 plan-aware upload gates handoff.
- Owner: Người dùng chốt data, agent hỗ trợ seed/tooling nếu cần.
- Trạng thái: `[~]` đang chờ dữ liệu test.

## Mục Tiêu

Tạo dữ liệu QA đủ cho các gói Free, Couple Essential, Couple Premium, Studio Starter và Studio Pro.

## Chuẩn Bị

- Danh sách tenant/user test.
- Quyền truy cập database staging hoặc API/admin tool tạo `plan_subscriptions`.
- Quy tắc giá/gói sản phẩm cần demo.

## Các Bước Thực Hiện

1. Tạo ít nhất 1 tenant free không có subscription.
2. Tạo 1 tenant/user với subscription `couple_essential`.
3. Tạo 1 tenant/user với subscription `couple_premium`.
4. Tạo 1 user studio với subscription `studio_starter` hoặc `studio_pro`.
5. Dùng `/api/v1/scale/tenants/:tenantId/summary` để đối chiếu plan, limits, usage và enabledFeatures.
6. Kiểm tra `/admin/scale` hiển thị đúng.

## Nơi Cấu Hình / Kiểm Tra

- Database `plan_subscriptions`.
- API `/api/v1/scale/tenants/:tenantId/summary`.
- `/admin/scale`.

## Xác Nhận Hoàn Tất

- Mỗi gói trả về đúng storage/photo/video/file-size limits.
- Feature gate đúng theo plan.
- Entitlement admin có thể tăng storage mà không cần thanh toán thật.

## Docs Liên Quan

- `docs/PRODUCT_PLAN.md`
- `docs/DATABASE_DESIGN.md`
- `docs/API_DESIGN.md`

## Ghi Chú Cho Prompt Sau

- Nếu thiếu admin seed UI, tạo task tooling/admin riêng.
