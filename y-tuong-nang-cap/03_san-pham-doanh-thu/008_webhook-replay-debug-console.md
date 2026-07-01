# Webhook Replay / Debug Console

- Nhóm: Sản phẩm & doanh thu.
- Trạng thái: Gợi ý.
- Tác động: trung bình.
- Độ phức tạp: trung bình.
- Phụ thuộc: webhook_deliveries, audit log, permission guard.

## Mô Tả

Admin/studio xem payload đã redacted, signature status, retry history và replay từng event.

## Giá Trị

- Giảm thời gian debug tích hợp ngoài.
- Tăng độ tin cậy cho B2B integrations.

## Gợi Ý Triển Khai

1. Lưu delivery attempts với status và redacted payload.
2. Thêm UI xem chi tiết và retry/replay.
3. Guard bằng permission/plan.
4. Audit mọi replay.

## Rủi Ro / Lưu Ý

- Không lưu secret hoặc payload nhạy cảm raw.
- Replay phải idempotent hoặc cảnh báo rõ.

## Prompt Sau

- Làm sau outbound webhook core.
