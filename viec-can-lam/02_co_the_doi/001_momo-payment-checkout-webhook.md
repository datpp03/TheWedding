# [~] MoMo Payment Checkout Và Webhook Thật

- Mức độ: Có thể đợi, nhưng cần trước khi bật thanh toán production.
- Nguồn: Phase 9 scale handoff.
- Owner: Người dùng chuẩn bị merchant credentials, agent triển khai/verify khi có scope.
- Trạng thái: `[~]` đang chờ merchant credentials và quyết định rollout.

## Mục Tiêu

Hoàn thiện checkout MoMo thật, redirect/cancel/failure states và webhook verify chữ ký/idempotency trước khi bật self-service payment.

## Chuẩn Bị

- Tài khoản MoMo merchant sandbox/production.
- Client/partner/access key/secret theo tài liệu MoMo.
- Endpoint public cho webhook.
- Quyết định sản phẩm về gói nào được mua trực tiếp.

## Các Bước Thực Hiện

1. Chuẩn bị MoMo sandbox credentials.
2. Đọc lại payment plan trong `docs/PRODUCT_PLAN.md`.
3. Tạo hoặc cập nhật prompt triển khai checkout thật.
4. Implement checkout create endpoint với signature đúng tài liệu MoMo.
5. Implement return/cancel/failure UI.
6. Implement webhook verify chữ ký, chống replay và idempotency.
7. Test sandbox success/failure/cancel/duplicate webhook.
8. Chỉ bật production sau khi audit log và rollback flow pass.

## Nơi Cấu Hình / Kiểm Tra

- MoMo merchant dashboard.
- Backend env.
- API payment endpoints sau khi implement.
- `/admin/scale` hoặc billing UI tương lai.

## Xác Nhận Hoàn Tất

- Checkout sandbox tạo giao dịch thật.
- Webhook signature pass/fail đúng.
- Duplicate webhook không cấp entitlement hai lần.
- Payment chưa verify không bật quyền sản phẩm.

## Docs Liên Quan

- `docs/PRODUCT_PLAN.md`
- `docs/API_DESIGN.md`
- `docs/AUTH_SECURITY.md`
- `docs/TESTING_STRATEGY.md`

## Ghi Chú Cho Prompt Sau

- Không bật self-service purchase khi chưa có MoMo webhook thật.
