# Slideshow / Live Wall Trình Chiếu Ảnh

- Nhóm: Trải nghiệm media.
- Trạng thái: Gợi ý.
- Tác động: trung bình.
- Độ phức tạp: thấp.
- Phụ thuộc: public album, media derivatives.

## Mô Tả

Chế độ toàn màn hình tự động chạy ảnh mới hoặc ảnh trong album.

## Giá Trị

- Dễ dùng tại tiệc hoặc khi trình chiếu cho gia đình.
- Là lát cắt nhỏ hơn live wedding wall đầy đủ.

## Gợi Ý Triển Khai

1. Tạo full-screen slideshow route.
2. Dùng derivative phù hợp kích thước màn hình.
3. Thêm autoplay, next/previous, pause.
4. Respect reduced motion.

## Rủi Ro / Lưu Ý

- Không hiển thị album private nếu chưa auth.
- Cần preloading để không giật hình.

## Prompt Sau

- Có thể gắn vào prompt public album UX.
