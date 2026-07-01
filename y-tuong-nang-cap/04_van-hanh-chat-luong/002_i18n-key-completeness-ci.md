# i18n Key Completeness CI Check

- Nhóm: Vận hành & chất lượng.
- Trạng thái: Gợi ý.
- Tác động: trung bình.
- Độ phức tạp: thấp.
- Phụ thuộc: i18n locales.

## Mô Tả

Script CI tự fail khi thiếu key ở `vi`, `en`, `ja`.

## Giá Trị

- Ngăn UI thiếu bản dịch khi thêm feature.
- Giảm lỗi regression trong prompt sau.

## Gợi Ý Triển Khai

1. Viết script so sánh key giữa locale.
2. Thêm test/unit hoặc command CI.
3. Cập nhật prompt rules nếu thiếu key phải fail.

## Rủi Ro / Lưu Ý

- Cần hỗ trợ nested keys nếu locale chuyển structure sau này.

## Prompt Sau

- Có thể làm trong i18n/accessibility QA.
