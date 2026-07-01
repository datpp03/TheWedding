# Guest Photo Upload Có Kiểm Duyệt

- Nhóm: Khách mời & tương tác.
- Trạng thái: Gợi ý.
- Tác động: cao.
- Độ phức tạp: trung bình.
- Phụ thuộc: media, moderation, storage, rate limit.

## Mô Tả

Cho khách tải ảnh lên album chung, owner/admin duyệt trước khi ảnh xuất hiện public.

## Giá Trị

- Tăng tương tác tại sự kiện.
- Tạo thêm nguồn nội dung cho album cưới.

## Gợi Ý Triển Khai

1. Tạo guest upload endpoint riêng với size/type limit.
2. Lưu media ở trạng thái pending/moderation.
3. Thêm moderation queue cho owner.
4. Chỉ public ảnh đã duyệt.

## Rủi Ro / Lưu Ý

- Cần malware scanning hoặc ít nhất MIME validation mạnh.
- Cần quota rõ để khách không làm đầy storage.

## Prompt Sau

- Phù hợp sau Prompt 08D media security.
