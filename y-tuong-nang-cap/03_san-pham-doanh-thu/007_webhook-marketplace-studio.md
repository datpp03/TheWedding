# Webhook Marketplace Cho Studio

- Nhóm: Sản phẩm & doanh thu.
- Trạng thái: Gợi ý.
- Tác động: cao.
- Độ phức tạp: trung bình-cao.
- Phụ thuộc: outbound webhook signing, delivery logs, studio plan gates.

## Mô Tả

Template kết nối n8n, Make, Zapier hoặc CRM để studio nhận event media ready, delivery sent, payment succeeded, wish approved.

## Giá Trị

- Tăng B2B stickiness.
- Tự động hóa vận hành studio.

## Gợi Ý Triển Khai

1. Chuẩn hóa event catalog public/studio-safe.
2. Tạo template endpoint + secret management.
3. Thêm marketplace UI hoặc preset docs.
4. Gate theo Studio plan.

## Rủi Ro / Lưu Ý

- Webhook payload phải redacted.
- Cần retry/dead-letter và signature verification docs.

## Prompt Sau

- Làm sau Prompt 08G outbound webhook.
