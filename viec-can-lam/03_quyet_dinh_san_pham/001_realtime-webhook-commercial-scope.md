# [~] Chốt Scope Thương Mại Cho Realtime/Webhook

- Mức độ: Quyết định sản phẩm.
- Nguồn: Prompt 08G và `docs/REALTIME_WEBHOOK_PLAN.md`.
- Owner: Người dùng.
- Trạng thái: `[~]` đang chờ quyết định.

## Mục Tiêu

Chốt realtime/webhook sẽ phục vụ gói nào, use case nào và tích hợp ngoài nào trước khi bật production.

## Chuẩn Bị

- Đọc `docs/REALTIME_WEBHOOK_PLAN.md`.
- Danh sách nhu cầu: upload/media dashboard, wish/reaction public, payment status, admin ops, studio delivery.
- Nếu cần outbound webhook, chuẩn bị endpoint test như webhook.site, n8n, Make, Zapier hoặc CRM studio.

## Các Bước Thực Hiện

1. Chọn use case realtime đầu tiên.
2. Chọn transport: SSE trước, WebSocket chỉ khi cần presence/collaboration hai chiều.
3. Chọn gói được bật realtime.
4. Chọn event được public-safe.
5. Xác định event chỉ dành cho admin/studio/private channel.
6. Chốt outbound webhook có nằm trong gói Studio hay add-on riêng.
7. Ghi quyết định vào `docs/PRODUCT_PLAN.md` và `docs/ROADMAP.md`.

## Nơi Cấu Hình / Kiểm Tra

- `docs/REALTIME_WEBHOOK_PLAN.md`.
- `docs/PRODUCT_PLAN.md`.
- `docs/ROADMAP.md`.
- `prompts/08g_realtime_webhook_event_platform.md`.

## Xác Nhận Hoàn Tất

- Scope realtime/webhook được ghi rõ.
- Prompt 08G không cần đoán business model.
- Feature chưa verify vẫn gated.

## Docs Liên Quan

- `docs/REALTIME_WEBHOOK_PLAN.md`
- `docs/PRODUCT_PLAN.md`
- `docs/API_DESIGN.md`
- `docs/TESTING_STRATEGY.md`

## Ghi Chú Cho Prompt Sau

- Đồng bộ với `02_co_the_doi/002_realtime-webhook-platform-rollout.md`.
