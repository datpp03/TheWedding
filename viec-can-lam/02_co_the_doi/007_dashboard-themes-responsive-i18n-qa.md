# [ ] QA Responsive Và Đổi Ngôn Ngữ Cho /dashboard/themes

- Mức độ: Có thể đợi.
- Nguồn: dashboard themes i18n handoff.
- Owner: Người dùng.
- Trạng thái: `[ ]` chưa làm.

## Mục Tiêu

Xác nhận `/dashboard/themes` không overflow và đổi ngôn ngữ ổn trên trình duyệt thật.

## Chuẩn Bị

- Build mới nhất của web app.
- Tài khoản user đăng nhập được.
- Trình duyệt Chrome/Edge/Safari có DevTools.
- URL production nếu test deploy.

## Các Bước Thực Hiện

1. Chạy local nếu cần: `pnpm.cmd --filter @the-wedding/api dev`.
2. Chạy web local: `pnpm.cmd --filter @the-wedding/web dev`.
3. Mở `http://localhost:3000/dashboard/themes` hoặc URL production.
4. Đăng nhập.
5. Kiểm tra sidebar có dropdown `Ngôn ngữ`.
6. Chọn lần lượt `Tiếng Việt`, `English`, `日本語`.
7. Xác nhận nhãn sidebar và tiêu đề/mô tả trang themes đổi theo.
8. Mở DevTools responsive mode và kiểm tra width 320, 360, 390, 414, 768, 1024, 1280 và desktop rộng.
9. Ở width desktop/sidebar, kiểm tra form màu sắc/chữ/layout không bị chèn.
10. Ở width dưới `lg`, ghi nhận sidebar hiện ẩn; nếu cần đổi ngôn ngữ trên mobile thì mở prompt mobile drawer/top nav.

## Nơi Cấu Hình / Kiểm Tra

- `http://localhost:3000/dashboard/themes`.
- Production dashboard nếu đã deploy.
- DevTools responsive mode.

## Xác Nhận Hoàn Tất

- Không có overflow ngang.
- Input/select dễ bấm.
- Switch ngôn ngữ hoạt động sau refresh.
- Ảnh chụp breakpoint được lưu cho release QA.

## Docs Liên Quan

- `docs/UI_UX_DESIGN.md`
- `docs/HUONG_DAN_SU_DUNG.md`
- `docs/TESTING_STRATEGY.md`

## Ghi Chú Cho Prompt Sau

- Nếu mobile cần đổi ngôn ngữ, tạo prompt mobile dashboard drawer.
