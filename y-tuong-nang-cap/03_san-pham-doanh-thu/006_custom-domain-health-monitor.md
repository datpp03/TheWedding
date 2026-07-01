# Custom Domain Health Monitor

- Nhóm: Sản phẩm & doanh thu.
- Trạng thái: Gợi ý.
- Tác động: trung bình.
- Độ phức tạp: trung bình.
- Phụ thuộc: custom domain verification, scheduler, notification/email.

## Mô Tả

Job định kỳ kiểm tra DNS/CNAME/TXT và cảnh báo admin/user khi domain lỗi.

## Giá Trị

- Giảm downtime cho khách premium/studio.
- Giúp support phát hiện domain sai cấu hình sớm.

## Gợi Ý Triển Khai

1. Thiết kế domain health status.
2. Kiểm tra DNS định kỳ.
3. Gửi cảnh báo email/admin notification.
4. Hiển thị trạng thái trong dashboard.

## Rủi Ro / Lưu Ý

- DNS propagation có độ trễ, tránh cảnh báo quá sớm.
- Rate limit DNS checks.

## Prompt Sau

- Làm sau custom domain verification foundation.
