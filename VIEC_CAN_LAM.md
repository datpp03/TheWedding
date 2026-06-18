# Việc Cần Làm (Người Dùng)

> File này do agent (Codex) cập nhật sau MỖI prompt: liệt kê những việc CHỈ người dùng làm được hoặc CHƯA hoàn thành. Mỗi lần thêm một mục theo ngày + tên prompt. Trạng thái: `[ ]` chưa làm · `[x]` đã làm · `[~]` đang chờ người dùng/môi trường thật.
>
> Cách dùng: đọc mục "Khẩn cấp" và "Cấu hình cần người dùng" trước. Khi bạn đã làm xong một mục, đổi `[ ]`/`[~]` thành `[x]`.

## Khẩn Cấp (làm sớm để mở khóa phase tiếp theo)

- [~] Prompt `08_phase_9_scale_features.md` mới hoàn thành foundation. Trước final release cần quyết định: hoặc tách/triển khai tiếp các phần Phase 9 còn thiếu, hoặc chấp nhận giữ chúng là gated placeholders và không xóa prompt 08.

## Cấu Hình Cần Người Dùng (credentials / dịch vụ / hạ tầng)

- [~] SMTP/email production: hệ thống hiện trả token reset/verify trong payload ở môi trường dev vì chưa có SMTP. Cần cấu hình SMTP host/port/user/pass/from khi triển khai prompt `08a`.
- [~] Google/Facebook OAuth: mới có luồng start + validate `returnTo`. Callback exchange/account linking còn tắt cho tới khi xác nhận quy tắc liên kết theo email đã verify; cần client ID/secret của provider.
- [~] Cloudflare R2 / object storage: đang để `STORAGE_PROVIDER=local`. Khi triển khai `08d`/Phase 9 mới đăng ký Cloudflare, tạo bucket R2, access key, cấu hình env/CORS.
- [~] Cloudflare R2 / object storage: Phase 9 đã thêm env/docs/gate foundation nhưng chưa có R2 adapter, signed URL, upload session, multipart upload, migration tool và smoke test. Tiếp tục giữ `STORAGE_PROVIDER=local`.
- [~] MoMo payment & gói dịch vụ: Phase 9 mới có catalog, entitlement và payment-event idempotency placeholder. Cần tài khoản merchant + credentials, checkout thật, redirect và webhook verify chữ ký trước khi bật thanh toán.
- [~] Secrets trên Vercel/Render/Neon (và VPS nếu dùng `10`): JWT/cookie secrets, DATABASE_URL, CORS origins, registry/SSH secrets.

## QA Thủ Công Cần Môi Trường Thật

- [ ] Chụp màn hình responsive đầy đủ (320, 360, 390, 414, 768, 1024, desktop) cho các màn đã đổi.
- [ ] Smoke test trình duyệt cho social panel album công khai (chưa có fixture album public trong DB hiện tại).
- [ ] Chạy migration trên DB sạch + smoke test API/Web trước khi coi là release-ready (theo `09`).
- [ ] Smoke test `/admin/scale` với tài khoản admin thật, gồm responsive 320/360/390/414/768/1024/desktop và form cấp entitlement.

## Quyết Định Sản Phẩm Đang Chờ Xác Nhận

- [ ] Featured albums: thuật toán recency, admin-curated, owner opt-in, hay hybrid? (Default an toàn hiện tại: hybrid + opt-in/curated.)
- [ ] Lời chúc (wish) có cần owner duyệt trước khi hiển thị không?
- [ ] Reaction: một reaction/album hay một reaction/biểu tượng/album? (Hiện: một/biểu tượng/album.)
- [ ] Trường metadata nào an toàn cho search (tuổi, khu vực, địa điểm, thời gian, theme) và trường nào cần owner opt-in?
- [ ] OAuth có được liên kết tài khoản email/password sẵn có ngay lần callback đầu không?
- [ ] Chốt giá/quyền cho các gói Free, Couple Essential, Couple Premium, Studio Starter, Studio Pro và các add-on trước khi mở self-service purchase.
- [ ] Chốt chính sách custom domain: ai được bật, DNS record yêu cầu, thời gian re-check và hỗ trợ domain apex/subdomain.

## 2026-06-18 - Prompt 08 Phase 9 Scale Foundation

- [x] Đã thêm foundation code cho catalog gói B2C/B2B, add-on, feature gate, entitlement admin, user public handle, analytics event, greeting rule placeholder, MoMo payment-event idempotency và admin Scale UI.
- [ ] Chưa làm MoMo checkout/webhook thật: cần merchant credentials, chữ ký webhook, chống replay, trạng thái pending/success/failure/cancel và smoke test sandbox.
- [ ] Chưa làm R2 production adapter/direct upload: cần Cloudflare account, R2 bucket, access key, CORS nếu direct upload, signed URL, multipart upload, migration tool và rollback/smoke test.
- [ ] Chưa expose canonical public route `/@{userHandle}/{siteSlug}/albums/{albumSlugOrShortId}` và redirect route cũ.
- [ ] Chưa làm workflow B2B studio đầy đủ, DNS custom-domain verification, watermark processing hook, AI tag adapter/UI, contextual theme UI và greeting scheduler.
- [~] Prompt `prompts/08_phase_9_scale_features.md` được giữ lại vì acceptance chưa hoàn thành 100%, chưa full verification/build, chưa commit/push.

## Đã Xử Lý (tham khảo nhanh, không cần làm lại)

- [x] Nền tảng monorepo, CI, docker, env validation, kết nối DB, migration + seed.
- [x] Auth MVP: register/login/logout/refresh/session/forgot/reset/verify email/CSRF + route protection.
- [x] Tenant/site MVP, album & media MVP (upload/bulk/gallery/lightbox/download permission).
- [x] Theme customization MVP; Admin dashboard MVP; system parameters/feature flags.
- [x] Media processing ảnh (Sharp + BullMQ, fallback inline) với derivative thumbnail/gallery/lightbox.
- [x] Public album & social expansion MVP (public home, featured, privacy public/unlisted/private, wishes, reactions, OAuth start, search cơ bản, audit redaction).
- [x] Phase 8 hardening backend (rate limit, correlation id, audit redaction, tenant quota, tests, backup/restore docs).
- [x] Đường deploy free Vercel + Render + Neon.
