# Việc Cần Làm

Thư mục này là nguồn chính cho việc cần làm. Mỗi việc cụ thể nằm trong một file nhỏ để dễ giao việc, cập nhật trạng thái và đưa vào prompt sau.

Trạng thái:

- `[ ]` chưa làm
- `[~]` đang chờ người dùng/môi trường thật/credential
- `[x]` đã làm

## Cách Dùng Nhanh

1. Làm trước các file trong `00_khan_cap/`.
2. Sau đó xử lý `01_uu_tien/` trước khi release/deploy lớn.
3. Các việc `02_co_the_doi/` có thể tách thành prompt sau.
4. Quyết định sản phẩm nằm trong `03_quyet_dinh_san_pham/`.
5. Việc đã xử lý giữ ở `99_da_xu_ly/` để tránh làm lại.

## Quy Ước File

- Tên file: `NNN_slug-ngan-gon.md`, ví dụ `001_rotate-r2-access-key.md`.
- Dùng `_TEMPLATE.md` khi tạo task mới.
- Nếu việc trở nên gấp, chuyển file sang `00_khan_cap/` và ghi chú vào `## Carryover Khan Cap Tu Prompt Truoc` của prompt kế tiếp.

## Khẩn Cấp

Không còn mục khẩn cấp đang mở.

## Ưu Tiên

- [~] [Cấu hình và smoke test Google/Facebook OAuth production](01_uu_tien/001_google-facebook-oauth-production.md)
- [~] [Cấu hình Cloudflare R2 object storage production](01_uu_tien/002_cloudflare-r2-object-storage-production.md)
- [~] [Cấu hình host cho media upload production](01_uu_tien/003_media-upload-host-config.md)
- [~] [Redeploy backend và smoke test lỗi upload INTERNAL_SERVER_ERROR](01_uu_tien/004_redeploy-and-smoke-upload-error.md)
- [ ] [Chạy migration album slug và smoke test URL album public](01_uu_tien/005_album-slug-migration-smoke.md)
- [~] [SMTP production inbox smoke test](01_uu_tien/006_smtp-production-inbox-smoke.md)
- [~] [MFA/TOTP browser smoke test với tài khoản thật](01_uu_tien/007_mfa-totp-browser-smoke.md)
- [~] [Persistent session browser QA trên production/staging](01_uu_tien/008_persistent-session-browser-qa.md)
- [~] [Kiểm tra secrets trên Vercel/Render/Neon/VPS](01_uu_tien/009_secrets-vercel-render-neon-vps.md)
- [~] [Final Release manual QA trên staging/production](01_uu_tien/010_final-release-manual-qa.md)

## Có Thể Đợi

- [~] [MoMo payment checkout và webhook thật](02_co_the_doi/001_momo-payment-checkout-webhook.md)
- [~] [Realtime/webhook platform rollout](02_co_the_doi/002_realtime-webhook-platform-rollout.md)
- [ ] [R2 direct upload, signed URL và multipart flow](02_co_the_doi/003_r2-direct-upload-signed-url.md)
- [ ] [Canonical public route /@{userHandle}/{siteSlug}/albums/{albumSlugOrShortId}](02_co_the_doi/004_canonical-public-route-handle-site-album.md)
- [ ] [Hoàn thiện B2B studio, custom domain, watermark, AI, theme và greeting](02_co_the_doi/005_b2b-studio-custom-domain-watermark-ai-theme-greeting.md)
- [ ] [QA thủ công local control panel bằng double-click trên Windows](02_co_the_doi/006_local-control-panel-qa.md)
- [ ] [QA responsive và đổi ngôn ngữ cho /dashboard/themes](02_co_the_doi/007_dashboard-themes-responsive-i18n-qa.md)
- [~] [Chụp màn hình responsive đầy đủ cho các màn đã đổi](02_co_the_doi/008_full-responsive-screenshot-qa.md)
- [ ] [Smoke test social panel album công khai](02_co_the_doi/009_public-album-social-panel-smoke.md)
- [~] [Chạy migration trên DB sạch và smoke test API/Web](02_co_the_doi/010_clean-db-release-smoke.md)
- [ ] [Smoke test /admin/scale với tài khoản admin thật](02_co_the_doi/011_admin-scale-responsive-smoke.md)
- [~] [Smoke test upload theo plan/entitlement](02_co_the_doi/012_phase9-plan-aware-upload-gates-smoke.md)
- [~] [Chốt dữ liệu subscription/entitlement mẫu cho QA](02_co_the_doi/013_subscription-entitlement-seed-data.md)
- [ ] [Cân nhắc bổ sung MFA recovery/backup codes trước public launch](02_co_the_doi/014_mfa-backup-codes-policy.md)

## Quyết Định Sản Phẩm

- [~] [Chốt scope thương mại cho realtime/webhook](03_quyet_dinh_san_pham/001_realtime-webhook-commercial-scope.md)
- [x] [Các quyết định sản phẩm đã chốt](03_quyet_dinh_san_pham/099_quyet-dinh-da-chot.md)

## Đã Xử Lý

- [x] [Nền tảng và core features đã xử lý](99_da_xu_ly/001_foundation-and-core-features-done.md)
- [x] [SMTP/email production đã cấu hình Brevo](99_da_xu_ly/002_smtp-production-configured.md)
- [x] [Phase 9 scale foundation đã làm](99_da_xu_ly/003_phase9-scale-foundation-done.md)
- [x] [Chốt release Phase 9 theo hướng gated placeholder](00_khan_cap/001_phase-9-release-scope.md)
- [x] [Rotate R2 access key và redeploy backend đã xử lý](99_da_xu_ly/004_rotate-r2-access-key-done.md)

## Quy Ước Cho Prompt Sau

- Nếu còn việc người dùng cần làm sau một prompt, tạo file mới trong `viec-can-lam/` theo đúng mức độ và dùng `_TEMPLATE.md`.
- Nếu việc khẩn cấp phải xử lý ở prompt kế tiếp, vừa tạo/cập nhật file trong `00_khan_cap/`, vừa thêm mô tả ngắn vào `## Carryover Khan Cap Tu Prompt Truoc` của prompt kế tiếp.
