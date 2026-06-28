# Cloudflare R2 Setup Cho Media Upload

Guide này dùng khi chuyển production media từ Render local disk sang Cloudflare R2. Mục tiêu hiện tại là làm upload, xử lý ảnh và xem/tải ảnh chạy ổn định hơn bằng API-managed upload: trình duyệt gửi file lên API, API ghi object vào R2 qua server credentials.

## Trạng Thái Code

Đã có:

- S3-compatible storage adapter cho `STORAGE_PROVIDER=r2` hoặc `STORAGE_PROVIDER=s3`.
- API media file/download endpoints đọc file qua `StorageService`, không phụ thuộc local filesystem.
- R2/private bucket có thể dùng ngay cho upload và dashboard media. Nếu chưa cấu hình public/CDN base URL, ảnh vẫn được xem qua permission-checked API endpoints.

Chưa làm trong bước này:

- Direct browser/mobile upload session.
- Multipart/resumable upload cho video lớn.
- Local-to-R2 migration tool cho ảnh cũ.
- Public CDN tối ưu riêng cho derivative images.

## 1. Chuẩn Bị

Bạn cần:

- Tài khoản Cloudflare.
- Quyền vào dashboard Render backend API.
- Quyền push/deploy code mới lên production.
- 1-3 ảnh test nhỏ và 1-3 ảnh điện thoại dung lượng lớn.

Không ghi access key/secret key vào repo, docs, screenshot public hoặc chat.

## 2. Tạo Bucket R2

1. Đăng nhập Cloudflare dashboard.
2. Vào `R2 Object Storage`.
3. Bấm tạo bucket mới.
4. Đặt tên bucket, ví dụ:

```txt
thewedding-media-prod
```

5. Giữ bucket ở chế độ private cho giai đoạn đầu.
6. Ghi lại bucket name để dùng cho `S3_BUCKET`.

Khuyến nghị: dùng một bucket production riêng; không dùng chung bucket test/local nếu đã có dữ liệu thật.

## 3. Lấy Account ID Và Endpoint

Trong Cloudflare dashboard, lấy `Account ID` của tài khoản Cloudflare.

Endpoint R2 S3 API có dạng:

```txt
https://<ACCOUNT_ID>.r2.cloudflarestorage.com
```

Cấu hình vào app:

```env
S3_ENDPOINT=https://<ACCOUNT_ID>.r2.cloudflarestorage.com
S3_REGION=auto
```

## 4. Tạo R2 Access Key

1. Vào khu vực quản lý R2 API tokens/access keys trong Cloudflare dashboard.
2. Tạo access key mới.
3. Chọn quyền tối thiểu cần thiết cho bucket production:
   - đọc object;
   - ghi object;
   - xóa object.
4. Nếu dashboard cho scope theo bucket, chỉ scope vào bucket `thewedding-media-prod`.
5. Copy `Access Key ID` và `Secret Access Key` ngay lúc tạo.

Cấu hình vào app:

```env
S3_ACCESS_KEY=<Access Key ID>
S3_SECRET_KEY=<Secret Access Key>
```

## 5. Cấu Hình Render Backend API

Trong Render service của backend API, thêm/cập nhật env:

```env
STORAGE_PROVIDER=r2
S3_ENDPOINT=https://<ACCOUNT_ID>.r2.cloudflarestorage.com
S3_REGION=auto
S3_BUCKET=thewedding-media-prod
S3_ACCESS_KEY=<Access Key ID>
S3_SECRET_KEY=<Secret Access Key>
STORAGE_PUBLIC_BASE_URL=
STORAGE_SIGNED_URL_TTL_SECONDS=900
MAX_UPLOAD_BYTES=83886080
MAX_VIDEO_UPLOAD_BYTES=629145600
```

Giữ `STORAGE_PUBLIC_BASE_URL=` rỗng trong giai đoạn đầu nếu bạn chưa cấu hình public/custom domain cho R2. App sẽ dùng API endpoints đã kiểm tra quyền để xem/tải file.

Sau khi lưu env, redeploy/restart backend API.

## 6. CORS Có Cần Không?

Chưa cần CORS cho bước hiện tại, vì browser upload lên API, không upload trực tiếp lên R2.

Chỉ cấu hình CORS khi làm direct upload session sau này. Khi đó allowed origin tối thiểu sẽ là:

```txt
https://thewedding.d-ajt.app
```

Và chỉ mở các method thật sự cần, ví dụ `PUT`, `POST`, `GET`, `HEAD`.

## 7. Smoke Test Sau Deploy

1. Đăng xuất rồi đăng nhập lại app.
2. Vào `https://thewedding.d-ajt.app/dashboard/media`.
3. Chọn đúng wedding site và album.
4. Upload 1 ảnh nhỏ.
5. Kiểm tra response upload thành công, item xuất hiện trong grid.
6. Đợi trạng thái chuyển `queued` -> `processing` -> `ready`.
7. Bấm Download để tải lại original.
8. Upload thêm vài ảnh điện thoại dung lượng lớn.
9. Vào Cloudflare R2 bucket, kiểm tra object được tạo dưới prefix:

```txt
tenants/{tenantId}/media/{mediaId}/original/
tenants/{tenantId}/media/{mediaId}/versions/
```

Kết quả đạt:

- API không còn báo `Media storage is unavailable`.
- Render disk không còn là nơi lưu ảnh chính.
- R2 bucket có object original và derivative WebP.
- Dashboard xem/tải ảnh được.
- Public album chỉ hiện ảnh khi album public và media đã xử lý xong.

## 8. Rollback Nhanh

Nếu upload R2 lỗi sau deploy:

1. Vào Render backend env.
2. Đổi:

```env
STORAGE_PROVIDER=local
LOCAL_STORAGE_PATH=/app/storage
```

3. Redeploy backend.
4. Kiểm tra log API để lấy lỗi gốc của R2.

Lưu ý: object đã upload lên R2 sẽ không tự copy về local. Rollback chỉ để mở app tạm thời; cần migration tool nếu muốn đồng bộ dữ liệu hai nơi.

## 9. Link Chính Thức

- Cloudflare R2 Get started: https://developers.cloudflare.com/r2/get-started/
- Cloudflare R2 S3 API: https://developers.cloudflare.com/r2/api/s3/api/
- Cloudflare R2 API tokens/access keys: https://developers.cloudflare.com/r2/api/s3/tokens/
- Cloudflare R2 CORS: https://developers.cloudflare.com/r2/buckets/cors/
- Cloudflare R2 public buckets/custom domains: https://developers.cloudflare.com/r2/buckets/public-buckets/
