# [~] Final Release Manual QA Trên Staging/Production

- Mức độ: Ưu tiên, bắt buộc trước khi tuyên bố MVP release-ready.
- Nguồn: Prompt 09 final release QA.
- Owner: Người dùng hoặc agent có quyền truy cập môi trường staging/production thật.
- Trạng thái: `[~]` đang chờ môi trường thật, credential và dữ liệu QA.

## Mục Tiêu

Xác nhận các luồng người dùng chính, SEO/GEO public, i18n, responsive UI, migration và storage hoạt động trên môi trường thật sau khi automation local đã pass.

## Chuẩn Bị

- URL web production/staging, ví dụ `https://thewedding.d-ajt.app`.
- URL API production/staging, ví dụ `https://thewedding-api.d-ajt.app/api/v1`.
- Tài khoản super admin và user thường đã verify.
- Database staging hoặc production có backup trước khi chạy migration/smoke test.
- Env web có `NEXT_PUBLIC_APP_URL` và `NEXT_PUBLIC_API_URL` đúng domain public.
- Env API có `DATABASE_URL`, `CORS_ORIGINS`, cookie domain, SMTP/OAuth/R2 nếu muốn smoke các provider thật.
- Bộ ảnh/video test không chứa dữ liệu nhạy cảm.

## Các Bước Thực Hiện

1. Backup DB và media storage trước khi chạy migration hoặc smoke test phá dữ liệu.
2. Chạy migration trên staging/DB sạch theo `viec-can-lam/02_co_the_doi/010_clean-db-release-smoke.md`.
3. Mở public home, kiểm tra chỉ album `public` xuất hiện ở featured today/week.
4. Đăng ký, đăng nhập, logout, refresh browser, đóng/mở browser và kiểm tra session restore.
5. Tạo wedding site, tạo album, upload ảnh, đợi processing, kiểm tra thumbnail/optimized display.
6. Đặt album `public`, `unlisted`, `private` và kiểm tra discovery/detail đúng privacy:
   - `public` xuất hiện ở home/search nếu đủ điều kiện;
   - `unlisted` chỉ mở bằng direct link và không nằm trong sitemap;
   - `private` không mở public.
7. Mở public album, gửi wish/reaction khi chưa đăng nhập để kiểm tra redirect về login và return lại album.
8. Đăng nhập admin, mở `/admin`, `/admin/settings`, `/admin/scale`, kiểm tra system parameter toggles và plan/entitlement UI.
9. Kiểm tra `robots.txt`, `sitemap.xml`, canonical, Open Graph metadata và JSON-LD theo `docs/HUONG_DAN_SU_DUNG.md`.
10. Đổi locale `vi`, `en`, `ja` trên dashboard/admin và kiểm tra text không overflow ở các màn chính.
11. Chụp responsive widths 320, 360, 390, 414, 768, 1024 và desktop theo `viec-can-lam/02_co_the_doi/008_full-responsive-screenshot-qa.md`.
12. Smoke OAuth/SMTP/R2 nếu credential thật đã cấu hình; không bật MoMo public webhook/realtime/webhook nếu chưa hoàn thiện signature/idempotency/replay protection.

## Nơi Cấu Hình / Kiểm Tra

- Vercel/Web host env: `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_API_URL`.
- Render/API host env: `DATABASE_URL`, `CORS_ORIGINS`, `COOKIE_DOMAIN`, SMTP/OAuth/R2 env.
- App URLs: `/`, `/login`, `/dashboard`, `/dashboard/albums`, `/dashboard/media`, `/dashboard/themes`, `/dashboard/settings`, `/admin`, `/admin/settings`, `/admin/scale`, `/robots.txt`, `/sitemap.xml`.
- Logs: API request logs với `x-correlation-id`, Web build/deploy logs, storage/provider logs.

## Xác Nhận Hoàn Tất

- Migration pass và API/Web boot thành công.
- Core flows register/login/logout/site/album/upload/public gallery/admin pass.
- Public privacy rules pass cho `public`, `unlisted`, `private`.
- Robots/sitemap/canonical/OG/JSON-LD không expose private/unlisted/admin/auth/API/signed-media data.
- Responsive screenshots không có horizontal overflow, text overlap hoặc control bị che.
- Các provider thật đã bật đều có smoke result rõ; provider chưa bật vẫn hidden/gated/documented.

## Docs Liên Quan

- `docs/HUONG_DAN_SU_DUNG.md`
- `docs/DEPLOYMENT.md`
- `docs/ENVIRONMENT_VARIABLES.md`
- `docs/SEO_GEO_GUIDELINES.md`
- `docs/TESTING_STRATEGY.md`
- `docs/guides/CLOUDFLARE_R2_SETUP.md`

## Ghi Chú Cho Prompt Sau

- Nếu có lỗi blocker, tạo file trong `viec-can-lam/00_khan_cap/` với URL, bước tái hiện, screenshot/log/request id và đưa vào carryover prompt kế tiếp hoặc README nếu không còn prompt phù hợp.
