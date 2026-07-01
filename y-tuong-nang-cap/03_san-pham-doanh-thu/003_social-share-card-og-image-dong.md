# Trang Social Share Card / OG Image Động

- Nhóm: Sản phẩm & doanh thu.
- Trạng thái: Gợi ý.
- Tác động: trung bình.
- Độ phức tạp: trung bình.
- Phụ thuộc: public metadata, theme, SEO/GEO policy.

## Mô Tả

Tạo ảnh chia sẻ đẹp theo theme khi share link wedding site hoặc album.

## Giá Trị

- Link chia sẻ chuyên nghiệp hơn.
- Tăng khả năng click từ mạng xã hội.

## Gợi Ý Triển Khai

1. Tạo OG image endpoint hoặc build-time generator.
2. Chỉ dùng media public-safe.
3. Fallback nếu album/site không có ảnh phù hợp.
4. Test Open Graph/Twitter preview.

## Rủi Ro / Lưu Ý

- Không đưa private/unlisted/signed media vào OG image.
- Cần cache/invalidation khi đổi theme/cover.

## Prompt Sau

- Gắn với public site SEO/GEO prompt.
