# RSVP & Quản Lý Khách Mời

- Nhóm: Khách mời & tương tác.
- Trạng thái: Gợi ý.
- Tác động: cao.
- Độ phức tạp: trung bình.
- Phụ thuộc: auth, tenant, permission, i18n.

## Mô Tả

Thêm form xác nhận tham dự, danh sách khách mời, lời nhắn và trạng thái tham dự cho từng wedding site.

## Giá Trị

- Giúp cô dâu/chú rể quản lý khách mời trực tiếp trong app.
- Có thể trở thành tính năng trả phí hoặc add-on cho gói Couple/Studio.

## Gợi Ý Triển Khai

1. Thiết kế RSVP entity theo tenant/site, không gắn cứng vào public album.
2. Thêm form public có rate limit và privacy guard.
3. Thêm dashboard owner để xem, lọc, export danh sách.
4. Cập nhật i18n, docs và release QA.

## Rủi Ro / Lưu Ý

- Dữ liệu khách mời là PII, cần chính sách export/delete rõ.
- Public form cần chống spam.

## Prompt Sau

- Tạo prompt riêng cho RSVP sau khi public site ổn định.
