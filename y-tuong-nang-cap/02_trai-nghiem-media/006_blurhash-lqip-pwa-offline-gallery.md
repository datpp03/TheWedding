# BlurHash/LQIP + PWA Offline Gallery

- Nhóm: Trải nghiệm media.
- Trạng thái: Gợi ý.
- Tác động: trung bình.
- Độ phức tạp: trung bình.
- Phụ thuộc: media derivatives, web app caching, service worker.

## Mô Tả

Cải thiện cảm nhận tốc độ bằng placeholder ảnh và cho phép xem gallery offline có kiểm soát.

## Giá Trị

- Public gallery mượt hơn trên mạng yếu.
- Hữu ích cho sự kiện ở địa điểm mạng không ổn định.

## Gợi Ý Triển Khai

1. Chuẩn hóa BlurHash/LQIP size và storage.
2. Thêm image placeholder UI nhất quán.
3. Thiết kế PWA cache chỉ cho public/allowed derivative.
4. Cung cấp clear cache/offline state.

## Rủi Ro / Lưu Ý

- Offline cache không được lưu private/signed media quá policy.
- Service worker có thể gây lỗi stale asset nếu không version tốt.

## Prompt Sau

- Gắn vào public gallery performance prompt.
