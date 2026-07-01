# Mobile Dashboard Drawer + Locale Access

- Nhóm: Vận hành & chất lượng.
- Trạng thái: Gợi ý.
- Tác động: trung bình.
- Độ phức tạp: thấp-trung bình.
- Phụ thuộc: AppShell responsive pass, i18n keys.

## Mô Tả

Bổ sung top bar/drawer cho dashboard ở breakpoint dưới `lg`, gồm nav chính, switch ngôn ngữ và trạng thái tài khoản.

## Giá Trị

- Không mất điều hướng/sidebar trên điện thoại.
- Giúp QA responsive khép kín hơn.

## Gợi Ý Triển Khai

1. Thiết kế mobile drawer trong AppShell.
2. Đưa locale switcher vào mobile nav.
3. Thêm focus trap/keyboard close.
4. QA 320/360/390/414.

## Rủi Ro / Lưu Ý

- Tránh card trong card hoặc text overflow.
- Drawer phải không che nội dung đang submit form.

## Prompt Sau

- Phù hợp prompt i18n/accessibility UI QA.
