# Tách Private Originals Và Public Derivatives Trên R2/CDN

- Nhóm: Trải nghiệm media.
- Trạng thái: Gợi ý.
- Tác động: cao.
- Độ phức tạp: trung bình.
- Phụ thuộc: R2 adapter, media processing, custom domain/CDN policy.

## Mô Tả

Giữ original trong private prefix/bucket, còn thumbnail/gallery WebP dùng public custom domain/CDN riêng khi privacy cho phép.

## Giá Trị

- Public gallery nhanh hơn.
- Không lộ original.
- Dễ kiểm soát SEO/GEO media.

## Gợi Ý Triển Khai

1. Thiết kế prefix/bucket policy cho original và derivative.
2. Chỉ public derivative của album/site eligible.
3. Dùng signed URL cho private/unlisted khi cần.
4. Cập nhật storage docs và smoke tests.

## Rủi Ro / Lưu Ý

- Cần tránh public nhầm media private/unlisted.
- CDN cache invalidation cần rõ khi đổi visibility.

## Prompt Sau

- Phù hợp Prompt 08D hoặc storage hardening sau đó.
