# [~] Realtime/Webhook Platform Rollout

- Mức độ: Có thể đợi, nhưng quan trọng cho studio/integration.
- Nguồn: `docs/REALTIME_WEBHOOK_PLAN.md` và Prompt 08G.
- Owner: Người dùng chốt scope, agent triển khai.
- Trạng thái: `[~]` đang chờ scope thương mại và endpoint test.

## Mục Tiêu

Chốt và triển khai event backbone, SSE realtime, inbound provider webhook và outbound signed webhook theo privacy-safe payload.

## Chuẩn Bị

- Đọc `docs/REALTIME_WEBHOOK_PLAN.md`.
- Chọn nhu cầu realtime đầu tiên: upload/media dashboard, wish/reaction public, payment status, admin ops hay studio delivery.
- Nếu outbound webhook, chuẩn bị endpoint test như webhook.site, n8n, Make, Zapier hoặc CRM studio.
- Nếu MoMo thật, chuẩn bị merchant sandbox/production credentials.

## Các Bước Thực Hiện

1. Chọn browser transport mặc định: khuyến nghị SSE trước, WebSocket sau nếu cần hai chiều.
2. Chọn gói được bật realtime: Free fallback/polling, Couple paid live upload/wish/reaction, Studio outbound webhook.
3. Chọn event public-safe: reaction count và wish đã duyệt là ví dụ hợp lệ.
4. Không gửi pending/private/unlisted/payment/admin data ra public channel.
5. Implement outbox/idempotency/retry/dead-letter theo prompt 08G.
6. Implement channel authorization.
7. Implement webhook signing và delivery log.
8. Test reconnect, retry, replay và payload redaction.

## Nơi Cấu Hình / Kiểm Tra

- `docs/REALTIME_WEBHOOK_PLAN.md`.
- `prompts/08g_realtime_webhook_event_platform.md`.
- MoMo dashboard nếu dùng thanh toán.
- Admin webhook delivery log sau khi feature được implement.

## Xác Nhận Hoàn Tất

- Quyết định scope được ghi lại.
- Realtime/webhook vẫn tắt hoặc gated đến khi tests pass.
- Signature/idempotency/channel privacy/retry tests pass.
- Payload public không chứa private/unlisted/admin/payment/signed-media data.

## Docs Liên Quan

- `docs/REALTIME_WEBHOOK_PLAN.md`
- `docs/AUTH_SECURITY.md`
- `docs/API_DESIGN.md`
- `docs/TESTING_STRATEGY.md`

## Ghi Chú Cho Prompt Sau

- Prompt 08G phải đọc file này trước khi triển khai để tránh làm lệch scope thương mại.
