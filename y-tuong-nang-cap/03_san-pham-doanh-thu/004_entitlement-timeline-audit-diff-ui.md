# Entitlement Timeline / Audit Diff UI

- Nhóm: Sản phẩm & doanh thu.
- Trạng thái: Gợi ý.
- Tác động: trung bình.
- Độ phức tạp: thấp-trung bình.
- Phụ thuộc: Phase 9 entitlement foundation, audit log.

## Mô Tả

Admin xem lịch sử cấp/thu hồi quyền theo user/tenant và so sánh plan hiện tại với quyền override.

## Giá Trị

- Giảm nhầm lẫn khi support khách trả phí.
- Tăng khả năng audit nội bộ.

## Gợi Ý Triển Khai

1. Chuẩn hóa audit event cho entitlement mutations.
2. Thêm timeline trong `/admin/scale`.
3. Hiển thị diff plan vs override.
4. Thêm filters theo tenant/user/feature.

## Rủi Ro / Lưu Ý

- Không expose dữ liệu billing nhạy cảm cho role không đủ quyền.

## Prompt Sau

- Phù hợp admin operations/report prompt.
