# Public Album Canonical Route Migration UI

- Nhóm: Sản phẩm & doanh thu.
- Trạng thái: Gợi ý.
- Tác động: trung bình.
- Độ phức tạp: trung bình.
- Phụ thuộc: album slug foundation, audit log, SEO/GEO policy.

## Mô Tả

Màn admin/owner xem slug public hiện tại, chỉnh slug có kiểm tra trùng và tạo redirect audit khi đổi slug.

## Giá Trị

- URL đẹp nhưng vẫn kiểm soát SEO/canonical.
- Giảm gãy link đã chia sẻ.

## Gợi Ý Triển Khai

1. Thêm slug edit UI cho owner/admin.
2. Validate uniqueness per scope.
3. Lưu redirect/audit khi đổi slug.
4. Cập nhật sitemap/canonical metadata.

## Rủi Ro / Lưu Ý

- Không cho private album xuất hiện trong public migration UI nếu không đủ quyền.
- Redirect chain cần giới hạn.

## Prompt Sau

- Làm sau album slug migration smoke pass.
