# Live Wedding Wall Tại Tiệc

- Nhóm: Khách mời & tương tác.
- Trạng thái: Gợi ý.
- Tác động: cao.
- Độ phức tạp: trung bình.
- Phụ thuộc: realtime event platform, moderation, media processing.

## Mô Tả

Màn hình trình chiếu realtime hiển thị ảnh mới, lời chúc đã duyệt và reaction aggregate tại tiệc.

## Giá Trị

- Tạo trải nghiệm sự kiện mạnh, dễ bán như add-on.
- Hấp dẫn cho studio/photographer muốn dịch vụ tại tiệc.

## Gợi Ý Triển Khai

1. Tạo route full-screen riêng cho live wall.
2. Chỉ nhận event public-safe và đã duyệt.
3. Thêm chế độ auto-play, pause và moderation lock.
4. Gate theo plan/add-on.

## Rủi Ro / Lưu Ý

- Cần đảm bảo không hiển thị ảnh/wish chưa duyệt.
- Cần fallback khi mất kết nối realtime.

## Prompt Sau

- Tách prompt sau khi realtime/event platform ổn định.
