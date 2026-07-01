# Album Hết Hạn / Lịch Publish

- Nhóm: Sản phẩm & doanh thu.
- Trạng thái: Gợi ý.
- Tác động: trung bình.
- Độ phức tạp: thấp.
- Phụ thuộc: album visibility, scheduler, plan gate.

## Mô Tả

Cho phép hẹn giờ công khai hoặc tự ẩn album sau ngày cụ thể.

## Giá Trị

- Hữu ích cho album xem thử, gói trả phí hoặc studio delivery.
- Giúp kiểm soát privacy theo thời gian.

## Gợi Ý Triển Khai

1. Thêm field publishAt/expiresAt.
2. Enforce ở API public query.
3. Thêm UI trong dashboard album settings.
4. Cập nhật sitemap/robots khi trạng thái đổi.

## Rủi Ro / Lưu Ý

- Timezone phải rõ.
- Cache/sitemap cần invalidation.

## Prompt Sau

- Có thể làm cùng public route/SEO hardening.
