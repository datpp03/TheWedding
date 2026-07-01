# [~] Chụp Màn Hình Responsive Đầy Đủ Cho Các Màn Đã Đổi

- Mức độ: Có thể đợi, bắt buộc trước final release.
- Nguồn: release QA handoff, Prompt 08A và Prompt 09.
- Owner: Người dùng hoặc agent nếu có browser tooling.
- Trạng thái: `[~]` đang chờ app chạy với dữ liệu thật và công cụ browser/screenshot.

## Mục Tiêu

Chụp/kiểm tra responsive cho các màn mới đổi để bắt lỗi overflow, text overlap, trạng thái loading/error/success, SEO public metadata và i18n dài.

## Chuẩn Bị

- App chạy local hoặc staging.
- User test có và không MFA.
- Tài khoản admin có quyền `admin.access`.
- Browser DevTools hoặc Playwright/browser tooling.
- OAuth provider env nếu muốn test nút Google/Facebook enabled.
- Dữ liệu public album/site mẫu có ảnh để kiểm tra Open Graph/gallery.

## Các Bước Thực Hiện

1. Kiểm tra `/` public home ở các width 320, 360, 390, 414, 768, 1024 và desktop.
2. Kiểm tra `/albums/{albumSlug}` public album: hero, gallery, social panel, empty states, reaction buttons và wish form.
3. Kiểm tra `/{siteSlug}` public site với site public, site password-gated và site không tồn tại.
4. Kiểm tra `/login` khi chưa bật OAuth provider.
5. Bật provider env trên staging nếu có credential và kiểm tra nút Google/Facebook.
6. Kiểm tra màn OTP ở `/login?mfa=required` nếu có user MFA.
7. Kiểm tra `/dashboard/settings`.
8. Kiểm tra `/dashboard/themes` và `/admin/scale`.
9. Kiểm tra `/robots.txt` và `/sitemap.xml` bằng browser/network panel để xác nhận không có private route.
10. Đổi locale `vi`, `en`, `ja` và kiểm tra lại breakpoint chính.
11. Ghi lại mọi lỗi overflow/overlap vào prompt kế tiếp.

## Nơi Cấu Hình / Kiểm Tra

- DevTools responsive mode.
- `/`, `/robots.txt`, `/sitemap.xml`.
- `/login`.
- `/albums/{albumSlug}`.
- `/{siteSlug}`.
- `/dashboard/settings`.
- `/dashboard/themes`.
- `/admin/scale`.
- Locale switcher.

## Xác Nhận Hoàn Tất

- Không có horizontal overflow.
- Text không đè nhau.
- Nút/input đủ cao và dễ bấm.
- Public home/card/social copy fit ở `vi`, `en`, `ja`.
- Provider/MFA cards hiển thị rõ ở mobile.
- Robots/sitemap/canonical không expose private/unlisted/admin/auth/API/signed-media data.

## Docs Liên Quan

- `docs/UI_UX_DESIGN.md`
- `docs/TESTING_STRATEGY.md`
- `docs/SEO_GEO_GUIDELINES.md`
- `docs/HUONG_DAN_SU_DUNG.md`

## Ghi Chú Cho Prompt Sau

- Nếu phát hiện lỗi UI gấp, đưa vào carryover đầu prompt kế tiếp với screenshot/breakpoint.
