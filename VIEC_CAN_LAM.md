# Việc Cần Làm (Người Dùng)

> File này do agent (Codex) cập nhật sau MỖI prompt: liệt kê những việc CHỈ người dùng làm được hoặc CHƯA hoàn thành. Mỗi lần thêm một mục theo ngày + tên prompt. Trạng thái: `[ ]` chưa làm · `[x]` đã làm · `[~]` đang chờ người dùng/môi trường thật.
>
> Mỗi mục phải có hướng dẫn thực hiện chi tiết ngay bên dưới: cần chuẩn bị gì, các bước thao tác, nơi cấu hình/kiểm tra, cách xác nhận hoàn tất, và docs liên quan. Không ghi việc chung chung mà thiếu cách làm.
>
> Cách dùng: đọc mục "Khẩn cấp" và "Cấu hình cần người dùng" trước. Khi bạn đã làm xong một mục, đổi `[ ]`/`[~]` thành `[x]`.

## Mẫu Ghi Một Việc Cần Làm

- [~] Tên việc cần làm, ai làm, vì sao cần làm.
  - Chuẩn bị: tài khoản/credential/domain/env/quyết định sản phẩm cần có.
  - Các bước thực hiện:
    1. Bước cụ thể thứ nhất.
    2. Bước cụ thể thứ hai.
    3. Bước cụ thể thứ ba.
  - Nơi cấu hình/kiểm tra: file `.env`, dashboard dịch vụ, URL app, trang admin, hoặc command liên quan.
  - Xác nhận hoàn tất: kết quả mong đợi, smoke test, log/API/màn hình cần kiểm tra.
  - Docs liên quan: `docs/...`.

## Khẩn Cấp (làm sớm để mở khóa phase tiếp theo)

- [~] Prompt `08_phase_9_scale_features.md` mới hoàn thành foundation. Trước final release cần quyết định: hoặc tách/triển khai tiếp các phần Phase 9 còn thiếu, hoặc chấp nhận giữ chúng là gated placeholders và không xóa prompt 08.

## Cấu Hình Cần Người Dùng (credentials / dịch vụ / hạ tầng)

- [x] SMTP/email production: đã cấu hình Brevo SMTP cho môi trường triển khai.
  - Chuẩn bị: tài khoản Brevo SMTP, sender email `phamphucdattp@gmail.com`, SMTP key đã lưu trong env triển khai. Không ghi `SMTP_PASS` vào repo hoặc tài liệu bàn giao.
  - Các bước đã thực hiện:
    1. Cấu hình `SMTP_HOST=smtp-relay.brevo.com`.
    2. Cấu hình `SMTP_PORT=587`.
    3. Cấu hình `SMTP_SECURE=false`.
    4. Cấu hình `SMTP_USER` bằng tài khoản SMTP Brevo.
    5. Cấu hình `SMTP_FROM="TheWedding-Ajt <phamphucdattp@gmail.com>"`.
    6. Lưu `SMTP_PASS` trong biến môi trường/dịch vụ deploy, không commit vào git.
  - Nơi cấu hình/kiểm tra: file `.env` local hoặc dashboard Vercel/Render/VPS; đối chiếu thêm `docs/ENVIRONMENT_VARIABLES.md`.
  - Xác nhận hoàn tất: restart/redeploy backend, test đăng ký tài khoản, quên mật khẩu và verify email; email phải đến inbox thật và link reset/verify phải hoạt động.
  - Docs liên quan: `docs/ENVIRONMENT_VARIABLES.md`, `docs/DEPLOYMENT.md`.
- [~] Google/Facebook OAuth: mới có luồng start + validate `returnTo`. Callback exchange/account linking còn tắt cho tới khi xác nhận quy tắc liên kết theo email đã verify; cần client ID/secret của provider.
- [~] Cloudflare R2 / object storage: đang để `STORAGE_PROVIDER=local`. Khi triển khai `08d`/Phase 9 mới đăng ký Cloudflare, tạo bucket R2, access key, cấu hình env/CORS.
- [~] Cloudflare R2 / object storage: Phase 9 đã thêm env/docs/gate foundation nhưng chưa có R2 adapter, signed URL, upload session, multipart upload, migration tool và smoke test. Tiếp tục giữ `STORAGE_PROVIDER=local`.
- [~] MoMo payment & gói dịch vụ: Phase 9 mới có catalog, entitlement và payment-event idempotency placeholder. Cần tài khoản merchant + credentials, checkout thật, redirect và webhook verify chữ ký trước khi bật thanh toán.
- [~] Secrets trên Vercel/Render/Neon (và VPS nếu dùng `10`): JWT/cookie secrets, DATABASE_URL, CORS origins, registry/SSH secrets.
- [~] Cấu hình host cho media upload sau lỗi production ngày 2026-06-20.
  - Chuẩn bị: quyền truy cập Render/VPS backend, biến môi trường production, và bản deploy mới chứa sửa lỗi upload.
  - Các bước thực hiện:
    1. Vào dashboard host backend API.
    2. Đặt `MAX_UPLOAD_BYTES=83886080` để cho phép ảnh tối đa 80 MB.
    3. Đặt `MAX_VIDEO_UPLOAD_BYTES=629145600` nếu cần video tối đa 600 MB.
    4. Nếu chưa có Redis production thật, để `REDIS_URL=` rỗng; không dùng `redis://localhost:6379` trên Render/VPS khi Redis không chạy trong cùng môi trường.
    5. Redeploy/restart backend API.
    6. Upload thử 1 ảnh nhỏ, sau đó upload thử 3-5 ảnh điện thoại dung lượng lớn.
  - Nơi cấu hình/kiểm tra: Render service Environment hoặc file `.env.production` trên VPS; xem log API khi upload.
  - Xác nhận hoàn tất: ảnh dưới 80 MB không còn báo `File exceeds upload size limit`; nếu Redis chưa có thật, upload vẫn thành công và log chỉ cảnh báo fallback inline processing nếu queue không khả dụng.
  - Docs liên quan: `docs/ENVIRONMENT_VARIABLES.md`, `docs/guides/FREE_HOSTING_VERCEL_RENDER_NEON.md`, `docs/STORAGE_STRATEGY.md`.
- [~] Redeploy backend và smoke test lại lỗi upload `INTERNAL_SERVER_ERROR` ngày 2026-06-20.
  - Chuẩn bị: quyền deploy backend API, quyền xem logs host, tài khoản admin/owner có tenant `4fd919e3-3130-4964-93cd-abc5850b9566`, và 2-3 ảnh test thật.
  - Các bước thực hiện:
    1. Deploy backend API từ commit mới nhất có sửa lỗi upload.
    2. Đăng xuất rồi đăng nhập lại trên `https://thewedding.d-ajt.app` để xoay session/token mới, đặc biệt vì token/cookie đã từng được paste vào chat.
    3. Tạo hoặc mở album thuộc tenant cần test.
    4. Upload 1 ảnh nhỏ trước; nếu pass, upload tiếp vài ảnh điện thoại dung lượng lớn.
    5. Nếu lỗi vẫn còn, copy `requestId` trong response và mở log backend tương ứng.
    6. Không dùng DevTools copied curl/fetch để test file upload vì request copy không chứa binary thật; hãy test bằng UI hoặc `curl -F "albumId=..." -F "file=@D:\\path\\photo.jpg"`.
  - Nơi cấu hình/kiểm tra: Render/VPS deploy logs, API logs, dashboard Media trên app.
  - Xác nhận hoàn tất: upload ảnh thật trả success, item xuất hiện trong Media dashboard với trạng thái queued/processing/ready; lỗi file rỗng phải trả `400 File is empty`, lỗi storage phải trả `503 Media storage is unavailable` thay vì `INTERNAL_SERVER_ERROR`.
  - Docs liên quan: `docs/TROUBLESHOOTING.md`, `docs/STORAGE_STRATEGY.md`, `docs/DEPLOYMENT.md`.

## QA Thủ Công Cần Môi Trường Thật

- [ ] Chụp màn hình responsive đầy đủ (320, 360, 390, 414, 768, 1024, desktop) cho các màn đã đổi.
- [ ] Smoke test trình duyệt cho social panel album công khai (chưa có fixture album public trong DB hiện tại).
- [ ] Chạy migration trên DB sạch + smoke test API/Web trước khi coi là release-ready (theo `09`).
- [ ] Smoke test `/admin/scale` với tài khoản admin thật, gồm responsive 320/360/390/414/768/1024/desktop và form cấp entitlement.

## Quyết Định Sản Phẩm Đang Chờ Xác Nhận

- [x] Featured albums: đã chốt dùng mô hình `hybrid + owner opt-in + admin curated`.
  - Quyết định: album chỉ được đưa ra khu vực nổi bật khi owner/cặp đôi opt-in, và admin có quyền chọn/sắp xếp/ẩn khỏi danh sách nổi bật.
  - Áp dụng khi làm: prompt `08b_public_discovery_moderation_audit_completion.md`, public home, admin curation UI, featured album ranking.
  - Xác nhận hoàn tất sau này: album không opt-in không xuất hiện ở featured; admin có thể curate; private/unlisted không bị đưa vào featured.
  - Docs liên quan: `docs/SEO_GEO_GUIDELINES.md`, `docs/PRODUCT_PLAN.md`, `docs/API_DESIGN.md`.
- [x] Lời chúc (wish): đã chốt cần owner/admin duyệt trước khi hiển thị public.
  - Quyết định: guest gửi lời chúc xong sẽ ở trạng thái chờ duyệt; chỉ lời chúc đã duyệt mới hiển thị trên public album/site.
  - Áp dụng khi làm: prompt `08b_public_discovery_moderation_audit_completion.md`, moderation queue, audit log cho approve/reject.
  - Xác nhận hoàn tất sau này: lời chúc mới không hiện ngay public; owner/admin duyệt thì mới hiện; reject/hide có audit log.
  - Docs liên quan: `docs/API_DESIGN.md`, `docs/AUTH_SECURITY.md`, `docs/HUONG_DAN_SU_DUNG.md`.
- [x] Reaction: đã chốt `một reaction trên mỗi biểu tượng/album`.
  - Quyết định: cùng một user/guest có thể reaction nhiều biểu tượng khác nhau trên một album, nhưng không được spam cùng một biểu tượng nhiều lần.
  - Áp dụng khi làm: reaction API, duplicate rule, UI social panel, audit/rate limit.
  - Xác nhận hoàn tất sau này: gửi trùng cùng biểu tượng/album bị chặn hoặc cập nhật idempotent; gửi biểu tượng khác vẫn hợp lệ theo rule.
  - Docs liên quan: `docs/API_DESIGN.md`, `docs/TESTING_STRATEGY.md`.
- [x] Search metadata: đã chốt chỉ dùng metadata an toàn và có owner opt-in.
  - Quyết định: cho phép search/index các trường an toàn như theme/phong cách, khu vực chung, tháng/năm tổ chức, tên album/site public nếu owner cho phép.
  - Không dùng cho search/index: địa chỉ cụ thể, số điện thoại, tuổi, thông tin gia đình, private/unlisted data, signed media URL, metadata nhạy cảm.
  - Áp dụng khi làm: prompt `08b_public_discovery_moderation_audit_completion.md`, SEO/GEO metadata, sitemap eligibility, public search.
  - Xác nhận hoàn tất sau này: chỉ public + opt-in metadata xuất hiện trong search; private/unlisted/admin/auth không index.
  - Docs liên quan: `docs/SEO_GEO_GUIDELINES.md`, `docs/API_DESIGN.md`, `docs/PRODUCT_PLAN.md`.
- [x] OAuth account linking: đã chốt chỉ tự liên kết tài khoản nếu provider email đã verified.
  - Quyết định: Google/Facebook callback chỉ được link vào tài khoản email/password sẵn có khi provider xác nhận email đã verified; nếu không verified thì yêu cầu đăng nhập/verify thủ công.
  - Áp dụng khi làm: prompt `08a_auth_email_mfa_oauth_completion.md`, OAuth callback exchange, account linking, audit security events.
  - Xác nhận hoàn tất sau này: không link tài khoản với email chưa verified; mọi link/unlink đều có audit log; `returnTo` vẫn chống open redirect.
  - Docs liên quan: `docs/AUTH_SECURITY.md`, `docs/API_DESIGN.md`.
- [x] Gói dịch vụ: đã chốt hướng quyền sản phẩm trước khi mở self-service purchase.
  - Quyết định: `Free` là gói dùng thử/cơ bản; `Couple Essential` là gói trả phí thấp cho cặp đôi; `Couple Premium` mở premium theme/dung lượng/tính năng nâng cao; `Studio Starter` cho studio nhỏ; `Studio Pro` cho studio chuyên nghiệp, custom domain/B2B workflow về sau.
  - Giá tiền cụ thể có thể chốt sau vì MoMo checkout/webhook thật đang deferred; hiện chỉ dùng làm policy cho entitlement/feature gate.
  - Áp dụng khi làm: Phase 9 scale, `/admin/scale`, plan entitlement, payment UI sau này.
  - Xác nhận hoàn tất sau này: feature gate đúng theo plan; chưa bật self-service purchase khi chưa có MoMo webhook thật.
  - Docs liên quan: `docs/PRODUCT_PLAN.md`, `docs/ROADMAP.md`.
- [x] Custom domain: đã chốt chỉ bật cho `Studio Pro` hoặc admin cấp thủ công.
  - Quyết định: user thường không tự bật custom domain; Studio Pro hoặc admin-granted entitlement mới được dùng.
  - DNS policy: subdomain dùng `CNAME`; apex/root domain dùng `A`, `ALIAS`, hoặc `ANAME` tùy DNS provider; cần trạng thái verify/re-check trước khi active.
  - Áp dụng khi làm: Phase 9 custom domain, DNS verification, admin entitlement, SEO canonical.
  - Xác nhận hoàn tất sau này: domain chưa verify không active; canonical không trỏ sai; private/unlisted vẫn không index.
  - Docs liên quan: `docs/SEO_GEO_GUIDELINES.md`, `docs/DEPLOYMENT.md`, `docs/PRODUCT_PLAN.md`.

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
