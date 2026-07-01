# Tải Ảnh Hàng Loạt Dạng ZIP

- Nhóm: Trải nghiệm media.
- Trạng thái: Gợi ý.
- Tác động: cao.
- Độ phức tạp: trung bình.
- Phụ thuộc: queue, storage, permission, download policy.

## Mô Tả

Cho phép tải cả album hoặc nhiều ảnh dạng ZIP nếu album cho phép download.

## Giá Trị

- Tăng tiện ích thực tế cho couple và khách.
- Giảm thao tác tải từng ảnh.

## Gợi Ý Triển Khai

1. Tạo async job nén ZIP theo album/selection.
2. Lưu ZIP tạm với TTL và signed download URL.
3. Kiểm tra allow-download và tenant permission.
4. Thêm trạng thái job trong UI.

## Rủi Ro / Lưu Ý

- ZIP lớn tốn CPU/storage, cần quota/TTL.
- Không nén original private nếu policy chỉ cho derivative.

## Prompt Sau

- Phù hợp sau media storage/signed URL hardening.
