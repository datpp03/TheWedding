# Hướng Dẫn Sử Dụng App The Wedding

## Phase 7A: Public Home, Album Noi Bat, Loi Chuc Va Reaction

Trang dau vao `http://localhost:3000` hien la public home, khong con tu dong day user vao dashboard.

Checklist kiem thu nhanh:

1. Mo `http://localhost:3000`.
2. Kiem tra hai khu vuc `Featured today` va `Featured this week`.
3. Chi album co visibility `public` duoc hien trong hai khu vuc nay.
4. Album `unlisted` khong hien o home/search, nhung co the xem bang link truc tiep `/albums/{albumId}`.
5. Album `private` khong xem duoc tren public detail.
6. Mo mot album public, bam reaction hoac gui wish khi chua dang nhap. App phai dua ve `/login` va sau dang nhap quay lai dung `/albums/{albumId}?intent=...`.
7. Sau khi dang nhap, moi user chi gui duoc mot wish active cho moi album.
8. Reaction chi chap nhan symbol key da cau hinh cho album hoac default safe symbols.
9. OAuth Google/Facebook hien moi bat dau redirect an toan neu co client ID; callback exchange/link account con can xac nhan product rule.
10. Search album sau dang nhap goi API `/api/v1/albums/search` va khong tra album private/unlisted.

Tài liệu này dành cho người kiểm thử và người dùng nội bộ khi chạy app ở môi trường local. Mỗi khi hoàn thành một chức năng mới, hãy cập nhật file này để phản ánh đúng UI/API hiện tại.

## Địa Chỉ Local

- Web app: `http://localhost:3000`
- API: `http://localhost:4000/api/v1`
- Trang đăng nhập: `http://localhost:3000/login`
- Dashboard người dùng: `http://localhost:3000/dashboard`
- Dashboard album: `http://localhost:3000/dashboard/albums`
- Dashboard media: `http://localhost:3000/dashboard/media`
- Tùy biến giao diện: `http://localhost:3000/dashboard/themes`
- Cài đặt wedding site: `http://localhost:3000/dashboard/settings`
- Admin: `http://localhost:3000/admin`
- Public site: `http://localhost:3000/{siteSlug}`
- Public album direct link: `http://localhost:3000/albums/{albumId}`
- Production dashboard media: `https://thewedding.d-ajt.app/dashboard/media`
- Production public album direct link: `https://thewedding.d-ajt.app/albums/{albumId}`

## Tài Khoản Local Để Kiểm Thử

Các tài khoản dưới đây chỉ dùng cho môi trường local hiện tại.

| Loại tài khoản | Email               | Mật khẩu          | Ghi chú                                                                 |
| -------------- | ------------------- | ----------------- | ----------------------------------------------------------------------- |
| Super admin    | `admin@example.com` | `ChangeMe!123456` | Được tạo từ seed bằng `SUPER_ADMIN_EMAIL` và `SUPER_ADMIN_PASSWORD`.    |
| User thường    | `user@example.com`  | `ChangeMe!123456` | Tài khoản local đã được tạo và verify để kiểm thử dashboard người dùng. |

Nếu reset database local, hãy chạy lại seed để tạo super admin. Với user thường, có thể đăng ký lại từ màn Register hoặc dùng API register.

## Đăng Ký, Đăng Nhập Và Phiên Làm Việc

1. Vào `http://localhost:3000/login`.
2. Đăng nhập bằng tài khoản user thường hoặc admin ở bảng trên.
3. Sau khi đăng nhập, dashboard sẽ hiển thị trạng thái tài khoản.
4. Có thể đăng xuất từ khu vực auth status trong dashboard.
5. Nếu quên mật khẩu ở local, dùng màn Forgot Password. Vì SMTP chưa wired, API có thể trả dev reset token để mở link reset.

## Tạo Và Quản Lý Wedding Site

1. Đăng nhập bằng user thường.
2. Vào `http://localhost:3000/dashboard`.
3. Nhập tên site, slug, tên cô dâu/chú rể, ngày cưới và mô tả.
4. Bấm Create site.
5. Vào `http://localhost:3000/dashboard/settings` để chỉnh:
   - thông tin wedding site;
   - visibility: private, public, password protected;
   - SEO/share metadata;
   - welcome message và cover setting.
6. Public site có thể xem tại `http://localhost:3000/{slug}` nếu visibility cho phép.

## Quản Lý Album

1. Đăng nhập bằng user thường.
2. Vào `http://localhost:3000/dashboard/albums`.
3. Chọn wedding site cần quản lý.
4. Tạo album bằng ô Album title và nút New album.
5. Trên từng album có thể:
   - đổi title;
   - đổi description;
   - chuyển visibility private/public;
   - bật/tắt Allow downloads;
   - sắp xếp bằng Up/Down;
   - xóa album.
6. Cover album được chọn từ màn Media sau khi upload ảnh.
7. Để xem album bằng link trực tiếp, mở `http://localhost:3000/albums/{albumId}` hoặc production `https://thewedding.d-ajt.app/albums/{albumId}`. Album `public` và `unlisted` xem được bằng link, album `private` sẽ không hiện ở public detail.

## Upload Và Quản Lý Media

1. Vào `http://localhost:3000/dashboard/media`.
2. Chọn wedding site và album.
3. Kéo thả file vào vùng upload hoặc chọn file từ input.
4. File hỗ trợ trong MVP:
   - ảnh: JPEG, PNG, WebP;
   - video: MP4, WebM, MOV.
5. Bấm Upload queue để upload.
6. Trên grid media có thể:
   - chọn nhiều item;
   - delete hàng loạt;
   - move sang album khác;
   - set cover cho album;
   - download media khi có quyền.

## Public Gallery Và Lightbox

1. Đặt tenant/site visibility là public.
2. Đặt album visibility là public.
3. Upload media vào album.
4. Mở `http://localhost:3000/{siteSlug}`.
5. Gallery hiển thị các album public và media bên trong.
6. Click ảnh/video để mở lightbox.
7. Trong lightbox:
   - bấm Close để đóng;
   - dùng phím Escape để đóng;
   - dùng Arrow Left/Arrow Right để chuyển media;
   - nút Download chỉ hiện khi album bật Allow downloads.

## Admin Dashboard

Đăng nhập bằng super admin:

- Email: `admin@example.com`
- Mật khẩu: `ChangeMe!123456`

Sau khi đăng nhập, mở `http://localhost:3000/admin`. Tài khoản phải có permission `admin.access`; user thường sẽ bị từ chối khi gọi API admin.

### Tổng Quan Admin

1. Mở `http://localhost:3000/admin`.
2. Xem các chỉ số users, tenants, media và audit events.
3. Nếu bị báo lỗi quyền, kiểm tra seed role/permission và đăng nhập lại bằng super admin.

### Quản Lý Users

1. Mở `http://localhost:3000/admin/users`.
2. Xem danh sách user, email, trạng thái và ngày tạo.
3. Lọc nhanh bằng ô Status nếu cần.
4. Đổi status bằng dropdown trên từng dòng. Thao tác này được ghi audit log.
5. API cũng hỗ trợ xem detail và cập nhật roles qua `/api/v1/admin/users/:id` và `/api/v1/admin/users/:id/roles`.

### Quản Lý Tenants

1. Mở `http://localhost:3000/admin/tenants`.
2. Xem site name, slug, visibility và status.
3. Đổi status `active`, `suspended`, hoặc `archived` bằng dropdown. Thao tác này được ghi audit log.

### Media Moderation

1. Mở `http://localhost:3000/admin/media`.
2. Xem file, MIME type, processing status và ngày tạo.
3. Đổi moderation/processing status thành `pending`, `ready`, `processing`, `failed`, hoặc `rejected`.
4. Nếu system parameter `disableUploads` đang bật, upload mới sẽ bị backend chặn.
5. Nếu `disableDownloads` đang bật, download sẽ bị backend chặn.

### Audit Logs

1. Mở `http://localhost:3000/admin/audit-logs`.
2. Xem action, entity, actor và thời gian.
3. API hỗ trợ filter theo action, entityType, tenantId, search, pagination và sort.

### Settings, Feature Flags Và System Parameters

1. Mở `http://localhost:3000/admin/settings`.
2. Xem system settings và feature flags hiện có.
3. Trong khu System Parameters, bật/tắt các toggle:
   - disable new user registration;
   - disable login globally;
   - disable upload;
   - disable download;
   - disable public gallery;
   - disable payment checkout.
4. Nhập maintenance message để hiện lý do cho các flow bị tắt.
5. Mỗi lần lưu system parameters sẽ invalidate cache và ghi audit log.
6. Khi `disableNewUserRegistration` bật, API register trả lời flow đang bị tạm tắt.
7. Khi `disableLogin` bật, API login bị chặn, còn public/read-only browsing có thể tiếp tục nếu gallery không bị tắt.

## Lưu Ý Storage Local

- Upload local dùng `STORAGE_PROVIDER=local`.
- File được lưu dưới `apps/api/storage` khi API chạy từ `apps/api`.
- Storage key do backend sinh, không dùng filename người dùng làm path.
- Thư mục storage local không commit lên Git.

## Lưu Ý Cloudflare R2 Production

- Production có thể dùng `STORAGE_PROVIDER=r2` sau khi đã tạo bucket R2, access key và cấu hình env trên Render.
- Upload hiện vẫn đi qua API trước rồi API ghi vào R2. Chưa phải direct browser/mobile upload.
- Bucket nên giữ private trong giai đoạn đầu. Dashboard và public media dùng các API endpoint đã kiểm tra quyền để đọc file khi chưa có public CDN/custom domain.
- Nếu cấu hình `STORAGE_PUBLIC_BASE_URL`, chỉ dùng cho optimized derivative public; không dùng để expose original/private media.
- Hướng dẫn cấu hình chi tiết nằm ở `docs/guides/CLOUDFLARE_R2_SETUP.md`.

## Checklist Khi Hoàn Thành Chức Năng Mới

Mỗi phase/prompt sau khi thêm chức năng mới cần cập nhật file này:

- Thêm hoặc sửa mục hướng dẫn người dùng thao tác chức năng.
- Cập nhật URL nếu route thay đổi.
- Cập nhật quyền/tài khoản cần dùng để test.
- Cập nhật giới hạn hiện tại hoặc known limitation nếu có.
- Chạy format/lint/typecheck/test/build theo prompt trước khi commit.

## Tùy Biến Giao Diện Wedding Site

1. Đăng nhập bằng user có quyền vào wedding site.
2. Mở `http://localhost:3000/dashboard/themes`.
3. Chọn wedding site trong ô Wedding site nếu tài khoản có nhiều site.
4. Chọn preset trong Preset gallery để xem trước nhanh. Các preset hiện có gồm Neon Romance, Soft Editorial, City Pop, Midnight Film, Garden Glow.
5. Khu vực Colors cho phép đổi màu chính, màu phụ, nền, surface, màu chữ và màu chữ phụ. Có thể dùng swatch màu hoặc nhập mã hex.
6. Khu vực Type and style cho phép đổi font tiêu đề, font nội dung, độ bo góc và lớp phủ ảnh.
7. Khu vực Layout cho phép đổi album layout, hero style, media density và animation.
8. Live preview bên phải cập nhật ngay khi đổi preset, màu, layout hoặc typography.
9. Khi thay đổi chưa lưu, dashboard hiện trạng thái Unsaved changes. Bấm Save để lưu theme hiện tại.
10. Bấm Activate để kích hoạt theme cho public site. Nếu đang có thay đổi chưa lưu, app sẽ lưu trước khi activate.
11. Bấm Clone để nhân bản theme hiện tại thành bản mới.
12. Bấm Reset để xóa theme của site và tạo lại theme active từ preset hiện tại.
13. Để kiểm tra public site sau khi activate, đặt site visibility thành public trong Settings rồi mở `http://localhost:3000/{siteSlug}`. Public site sẽ áp dụng màu, font, bo góc, hero style và media density của theme active.

## Trạng Thái Xử Lý Media Sau Khi Upload

Phase 7 thêm pipeline xử lý media nên file vừa upload không được đánh dấu sẵn sàng ngay lập tức. Original được lưu private, backend tạo thumbnail và bản optimized để hiển thị gallery/lightbox.

Trạng thái có thể gặp:

- `Queued` / `Đang chờ`: file đã upload xong và đang nằm trong hàng đợi xử lý.
- `Processing` / `Đang xử lý`: worker đang đọc original và tạo thumbnail/optimized versions.
- `Ready` / `Sẵn sàng`: đã có version optimized. Dashboard và public gallery ưu tiên dùng bản optimized này.
- `Failed` / `Lỗi`: xử lý thất bại. Media card hiện lý do lỗi nếu backend ghi nhận được.

Cách kiểm tra trong dashboard:

1. Mở `http://localhost:3000/dashboard/media`.
2. Upload ảnh JPEG, PNG hoặc WebP.
3. Sau upload, item sẽ hiện badge `Queued` hoặc `Processing`.
4. Đợi vài giây. Dashboard tự polling và cập nhật sang `Ready` khi thumbnail/optimized xong.
5. Nếu item `Failed`, đọc dòng lỗi dưới tên file và bấm `Retry`.
6. Khi retry thành công, item quay lại `Queued` và tiếp tục polling đến `Ready`.

Cách kiểm tra thumbnail và optimized media:

1. Khi item `Ready`, ảnh trong grid dashboard nên load từ thumbnail/optimized URL thay vì original.
2. Đặt site và album thành public, sau đó mở `http://localhost:3000/{siteSlug}`.
3. Public gallery chỉ hiện optimized derivative khi đã sẵn sàng; item đang queued/processing sẽ hiện placeholder thay vì đọc original private.
4. Nút `Download original` trong dashboard và nút Download public nếu album cho phép download vẫn đi qua endpoint permission check riêng, không dùng chung với optimized display URL.

Ghi chú vận hành:

- Local dev không có `REDIS_URL` vẫn có inline processor để smoke test.
- Production nên cấu hình Redis qua `REDIS_URL` và `MEDIA_PROCESSING_CONCURRENCY`.
- Video preview hiện tại mới ghi metadata placeholder; cần worker có ffmpeg nếu muốn trích frame preview.

## Phase 8: Bao Mat, Rate Limit Va Backup/Restore

Nhung thay doi Phase 8 chu yeu nam o backend, nhung nguoi kiem thu can biet cac hanh vi sau:

1. API tra header `x-correlation-id` cho moi request. Khi bao loi, hay gui kem gia tri nay de doi chieu log.
2. Cac endpoint dang nhap, dang ky, quen mat khau, refresh token, upload va admin co rate limit. Neu gap HTTP 429, cho het cua so gioi han roi thu lai.
3. Upload kiem tra MIME type, duoi file, kich thuoc theo loai media, plan/entitlement gate, va quota tenant truoc khi ghi file.
4. Phase 9 da dung policy theo goi dich vu/entitlement cho API-managed upload. `TENANT_STORAGE_QUOTA_BYTES` chi con la bien fallback/lich su cho cac tai lieu Phase 8, khong phai cach mo khoa quota chinh.
5. Neu upload bao "File extension does not match MIME type", hay export/doi file dung dinh dang that truoc khi thu lai.
6. Neu upload bao "Tenant storage quota exceeded", hay xoa bot media hoac vao `/admin/scale` cap storage entitlement cho tenant/user; khong chi tang env quota.
7. MFA hien moi co nen schema/model de trien khai TOTP sau nay; chua co man enrollment hoac buoc nhap OTP khi dang nhap.
8. Audit log tu redaction cac truong nhay cam nhu password, token, cookie, OTP/MFA, OAuth code, provider secret va header nhay cam.

Checklist backup/restore truoc release:

- Backup PostgreSQL/Neon bang `pg_dump --format=custom --no-owner --no-acl "$DATABASE_URL" > backup.dump`.
- Backup thu muc media local theo `LOCAL_STORAGE_PATH` cung thoi diem voi database.
- Restore thu vao staging bang `pg_restore`, sau do khoi phuc media archive.
- Smoke test sau restore: dang nhap, dashboard tenant, danh sach media, upload, public gallery, download co kiem quyen, va audit logs.

## Phase 9: Goi Dich Vu, Entitlement, Handle Va Scale Foundation

Phase 9 hien moi mo nen tang an toan cho goi dich vu va tinh nang scale. R2 adapter da co cho API-managed upload, nhung thanh toan that, direct upload, multipart upload, migration tool va CDN toi uu van chua hoan tat.

### Admin xem catalog goi va unlock thu cong

1. Dang nhap bang tai khoan co quyen `admin.access`.
2. Mo `http://localhost:3000/admin/scale`.
3. Khu vuc dau trang hien so subscription, entitlement, payment event, analytics, studio, custom domain va greeting rule dang co.
4. Khu vuc plan catalog hien cac goi B2C couple va B2B studio: Free, Couple Essential, Couple Premium, Studio Starter, Studio Pro.
5. Khu vuc add-on hien cac dich vu cong them: extra storage, custom domain, premium themes, advanced security, watermark, AI tools va online editing.
6. De unlock thu cong, nhap `tenantId` hoac `userId`, chon feature, tuy chon nhap `storageBoostBytes`, ghi ly do, bam `Cap quyen`.
7. Moi entitlement admin tao se ghi audit log. Neu muon thu hoi, hien tai tao entitlement voi `granted=false` qua API; UI thu hoi rieng se lam sau.
8. Entitlement/plan hien duoc backend dung de chan API-managed media upload neu vuot dung luong, so anh, so video, max file size, hoac chua co video gate.

### User public handle va URL album moi

API da co:

- `GET /api/v1/scale/handles/availability?handle=minh_an`
- `PATCH /api/v1/scale/me/handle`
- `GET /api/v1/scale/tenants/:tenantId/summary`

Handle chi cho phep chu thuong, so va dau gach duoi, dai 3-24 ky tu. URL canonical du kien:

```txt
/@{userHandle}/{siteSlug}/albums/{albumSlugOrShortId}
```

Route public moi va redirect tu route cu chua duoc expose tren UI; tiep tuc dung route public hien tai cho QA cho den khi co prompt hoan thien URL migration.

### Analytics, greeting, studio va custom domain

- Analytics event nen chi ghi cho album public hoac user co quyen tenant. Khong dung analytics de lo album private/unlisted.
- Greeting rule da co API admin placeholder va locale template key, nhung scheduler/gui loi chuc tu dong chua bat.
- Studio profile/client va custom domain da co bang foundation, nhung workflow day du va DNS verification chua bat.
- Premium theme, contextual theme, watermark, AI tagging, online editing dang la gate/add-on foundation; chua phai tinh nang nguoi dung cuoi hoan chinh.

### MoMo va Cloudflare R2

- MoMo hien chi co env optional va bang `payment_events` idempotent cho admin placeholder. Chua co checkout that, webhook public, hoac verify chu ky MoMo.
- Cloudflare R2 da co adapter cho API-managed upload. Can tao bucket/access key tren Cloudflare, cau hinh Render env, redeploy va smoke test truoc khi coi production upload on dinh.
- Signed upload session, multipart upload, local-to-R2 migration va CDN-first delivery van la viec sau.
- Nguoi dung can merchant credentials MoMo va tai khoan Cloudflare/R2 that truoc khi bat cac tinh nang production nay.
