# Hướng Dẫn Cấu Hình Lại Khi Di Dời Host, Database Và Nơi Lưu Trữ Ảnh

Tài liệu này dùng mỗi khi cần chuyển The Wedding sang host/VPS mới, đổi database, đổi nơi lưu trữ ảnh, hoặc khôi phục hệ thống trên một môi trường mới.

Mục tiêu là sau khi di dời:

- Web vẫn truy cập được từ domain mới hoặc IP mới.
- API kết nối đúng database mới.
- Ảnh/video cũ vẫn hiển thị được.
- Upload ảnh mới vẫn hoạt động.
- CI/CD có thể deploy tiếp lên host mới.
- Có đường rollback nếu host mới chưa ổn định.

## 1. Những Thứ Cần Chuẩn Bị Trước Khi Di Dời

Trước khi tắt host cũ hoặc đổi DNS, cần chuẩn bị:

- Quyền truy cập host/VPS cũ.
- Quyền truy cập host/VPS mới.
- Quyền truy cập database SQL Server cũ.
- Thông tin database SQL Server mới.
- Quyền truy cập nơi lưu ảnh hiện tại:
  - local storage trên VPS cũ; hoặc
  - Cloudflare R2/S3-compatible bucket.
- Quyền truy cập GitHub repository để sửa Secrets/Variables nếu dùng CI/CD.
- Backup database mới nhất.
- Backup hoặc bản sao thư mục ảnh nếu đang dùng local storage.
- File `.env.production` hiện tại trên VPS cũ.

Không commit `.env.production`, access key, database password, SSH key hoặc token thật vào repo.

## 2. Checklist Nhanh

Làm theo thứ tự này khi di dời:

1. Bật maintenance mode hoặc tạm dừng deploy nếu hệ thống đã có người dùng thật.
2. Backup database SQL Server.
3. Backup nơi lưu ảnh/video.
4. Chuẩn bị VPS/host mới.
5. Restore database sang database mới.
6. Copy hoặc cấu hình lại nơi lưu trữ ảnh.
7. Tạo lại `.env.production` trên host mới.
8. Cập nhật GitHub Secrets/Variables cho CI/CD.
9. Deploy container lên host mới.
10. Chạy smoke test.
11. Đổi DNS/reverse proxy sang host mới.
12. Theo dõi log và lỗi upload/xem ảnh.
13. Chỉ xóa host cũ sau khi host mới ổn định.

## 3. Backup Database SQL Server

Nếu SQL Server chạy trên host cũ, tạo backup `.bak` trước:

```sql
BACKUP DATABASE [TheWedding]
TO DISK = N'/var/opt/mssql/backup/TheWedding.bak'
WITH FORMAT, INIT, NAME = 'TheWedding full backup';
```

Nếu đang dùng Windows SQL Server, đường dẫn có thể là:

```sql
BACKUP DATABASE [TheWedding]
TO DISK = N'C:\backup\TheWedding.bak'
WITH FORMAT, INIT, NAME = 'TheWedding full backup';
```

Sau khi tạo backup, copy file `.bak` sang host mới bằng `scp`, SFTP, object storage riêng, hoặc công cụ backup của nhà cung cấp database.

Ví dụ copy từ máy local lên VPS mới:

```bash
scp TheWedding.bak deploy@NEW_VPS_IP:/tmp/TheWedding.bak
```

## 4. Restore Database Trên Host/Database Mới

Tạo database mới hoặc restore đè database rỗng.

Ví dụ restore trong SQL Server container:

```sql
RESTORE DATABASE [TheWedding]
FROM DISK = N'/var/opt/mssql/backup/TheWedding.bak'
WITH REPLACE,
MOVE 'TheWedding' TO '/var/opt/mssql/data/TheWedding.mdf',
MOVE 'TheWedding_log' TO '/var/opt/mssql/data/TheWedding_log.ldf';
```

Tên logical file có thể khác. Kiểm tra bằng:

```sql
RESTORE FILELISTONLY
FROM DISK = N'/var/opt/mssql/backup/TheWedding.bak';
```

Sau khi restore, kiểm tra nhanh:

```sql
SELECT COUNT(*) AS usersCount FROM users;
SELECT COUNT(*) AS tenantsCount FROM tenants;
SELECT COUNT(*) AS mediaCount FROM media;
```

Nếu dùng managed SQL Server, dùng công cụ import/restore của nhà cung cấp và lấy connection string mới.

## 5. Di Dời Nơi Lưu Trữ Ảnh/Video

The Wedding có hai hướng lưu trữ:

- Local storage: ảnh nằm trong volume/thư mục trên VPS.
- Cloudflare R2/S3-compatible: ảnh nằm trong bucket object storage.

### 5.1. Nếu Đang Dùng Local Storage

Kiểm tra biến trên host cũ:

```env
STORAGE_PROVIDER=local
LOCAL_STORAGE_PATH=/app/storage
```

Trong `docker-compose.prod.yml`, local storage được mount bằng volume:

```yaml
volumes:
  - api-storage:/app/storage
```

Có hai cách di dời:

### Cách A: Copy Docker Volume

Trên host cũ, nén dữ liệu storage:

```bash
docker run --rm \
  -v the-wedding_api-storage:/from \
  -v "$PWD":/backup \
  alpine sh -c "cd /from && tar czf /backup/api-storage.tar.gz ."
```

Copy sang host mới:

```bash
scp api-storage.tar.gz deploy@NEW_VPS_IP:/tmp/api-storage.tar.gz
```

Trên host mới, restore vào volume:

```bash
docker volume create the-wedding_api-storage
docker run --rm \
  -v the-wedding_api-storage:/to \
  -v /tmp:/backup \
  alpine sh -c "cd /to && tar xzf /backup/api-storage.tar.gz"
```

Tên volume thực tế có thể khác. Kiểm tra bằng:

```bash
docker volume ls
```

### Cách B: Dùng Thư Mục Bind Mount

Nếu muốn dễ di dời hơn, có thể đổi compose production để mount thư mục cố định:

```yaml
volumes:
  - /opt/the-wedding/storage:/app/storage
```

Sau đó copy bằng `rsync`:

```bash
rsync -avz /opt/the-wedding/storage/ deploy@NEW_VPS_IP:/opt/the-wedding/storage/
```

Sau khi copy, kiểm tra quyền:

```bash
ls -la /opt/the-wedding/storage
```

### 5.2. Nếu Đang Dùng Cloudflare R2/S3-Compatible

Khi đã chuyển sang R2, thường không cần copy ảnh khi đổi VPS. Chỉ cần cấu hình lại env trên host mới:

```env
STORAGE_PROVIDER=r2
S3_ENDPOINT=https://<account-id>.r2.cloudflarestorage.com
S3_REGION=auto
S3_BUCKET=<bucket-name>
S3_ACCESS_KEY=<access-key>
S3_SECRET_KEY=<secret-key>
STORAGE_PUBLIC_BASE_URL=<cdn-or-public-base-url>
STORAGE_SIGNED_URL_TTL_SECONDS=900
```

Nếu đổi sang bucket R2 mới, cần copy object từ bucket cũ sang bucket mới bằng `rclone`, AWS CLI S3-compatible, hoặc công cụ của nhà cung cấp.

Ví dụ với `rclone`:

```bash
rclone sync old-r2:old-bucket new-r2:new-bucket --progress
```

Sau khi copy, giữ nguyên storage key trong database nếu cấu trúc object key không đổi. Nếu đổi prefix/key layout, cần viết migration mapping key cũ sang key mới trước khi chạy production.

## 6. Tạo Lại `.env.production` Trên Host Mới

Trên host mới:

```bash
mkdir -p /opt/the-wedding
cd /opt/the-wedding
cp /path/to/production.env.example .env.production
```

Sửa các nhóm biến quan trọng:

### App URL

```env
APP_URL=https://your-domain.com
API_URL=https://api.your-domain.com
NEXT_PUBLIC_API_URL=https://api.your-domain.com
CORS_ORIGINS=https://your-domain.com
```

Nếu test bằng IP trước khi đổi domain:

```env
APP_URL=http://NEW_VPS_IP:3000
API_URL=http://NEW_VPS_IP:4000
NEXT_PUBLIC_API_URL=http://NEW_VPS_IP:4000
CORS_ORIGINS=http://NEW_VPS_IP:3000
```

### Database

```env
DATABASE_URL=sqlserver://user:password@host:1433;database=TheWedding;trustServerCertificate=true
```

### Redis

Nếu Redis chạy trong cùng `docker-compose.prod.yml`:

```env
REDIS_URL=redis://redis:6379
```

### Auth Secrets

Nếu muốn giữ session hiện tại không bị logout toàn bộ, giữ nguyên:

```env
JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=
COOKIE_SECRET=
```

Nếu nghi ngờ secret cũ bị lộ, hãy đổi secret mới. Khi đổi, người dùng có thể cần đăng nhập lại.

### Storage

Local:

```env
STORAGE_PROVIDER=local
LOCAL_STORAGE_PATH=/app/storage
```

R2:

```env
STORAGE_PROVIDER=r2
S3_ENDPOINT=
S3_REGION=auto
S3_BUCKET=
S3_ACCESS_KEY=
S3_SECRET_KEY=
STORAGE_PUBLIC_BASE_URL=
```

## 7. Cập Nhật GitHub Secrets/Variables Cho CI/CD

Nếu đổi VPS, cập nhật GitHub Actions Secrets:

```txt
VPS_HOST=<ip-hoặc-domain-host-mới>
VPS_USER=<user-ssh>
VPS_SSH_KEY=<private-key-ssh>
VPS_APP_DIR=/opt/the-wedding
```

Nếu đổi registry hoặc image namespace:

```txt
CONTAINER_REGISTRY=ghcr
```

hoặc:

```txt
CONTAINER_REGISTRY=dockerhub
DOCKERHUB_USERNAME=<username>
DOCKERHUB_TOKEN=<token>
```

Nếu registry private và VPS cần login để pull image:

```txt
VPS_REGISTRY_USERNAME=<username>
VPS_REGISTRY_TOKEN=<token>
```

Khi host mới đã sẵn sàng auto deploy:

```txt
DEPLOY_ENABLED=true
```

Nếu chưa sẵn sàng, chưa bật `DEPLOY_ENABLED` để tránh deploy tự động fail khi push lên `main`.

## 8. Deploy Lên Host Mới

Chạy workflow `Deploy Docker VPS` trên GitHub Actions hoặc push lên `main` nếu `DEPLOY_ENABLED=true`.

Trên host mới, kiểm tra:

```bash
cd /opt/the-wedding
docker compose --env-file .env.production -f docker-compose.prod.yml ps
docker compose --env-file .env.production -f docker-compose.prod.yml logs --tail=100 api
docker compose --env-file .env.production -f docker-compose.prod.yml logs --tail=100 web
```

Nếu muốn chạy pull/restart thủ công:

```bash
cd /opt/the-wedding
docker compose --env-file .env.production -f docker-compose.prod.yml pull
docker compose --env-file .env.production -f docker-compose.prod.yml up -d
```

## 9. Kiểm Tra Sau Khi Di Dời

Kiểm tra API:

```bash
curl -I http://localhost:4000/api/v1/auth/capabilities
```

Kiểm tra Web:

```bash
curl -I http://localhost:3000
```

Kiểm tra từ máy cá nhân:

```bash
curl -I https://your-domain.com
curl -I https://api.your-domain.com/api/v1/auth/capabilities
```

Checklist thủ công:

- Mở trang login.
- Đăng nhập bằng tài khoản admin hoặc user test.
- Mở dashboard.
- Mở danh sách album.
- Mở public gallery.
- Kiểm tra ảnh cũ có hiển thị không.
- Upload thử một ảnh mới.
- Kiểm tra ảnh mới có hiển thị không.
- Kiểm tra download nếu album cho phép download.
- Kiểm tra log API không báo lỗi database/storage.

## 10. Đổi DNS Hoặc Reverse Proxy

Chỉ đổi DNS sau khi smoke test host mới ổn.

Các bản ghi thường cần đổi:

```txt
your-domain.com      -> NEW_VPS_IP
api.your-domain.com  -> NEW_VPS_IP
```

Nếu dùng Cloudflare proxy, kiểm tra:

- SSL mode phù hợp.
- Cache không làm hỏng API.
- WebSocket hoặc long polling nếu sau này có realtime.
- Upload size limit nếu upload đi qua proxy.

Nếu dùng Nginx/Caddy trên VPS, cập nhật upstream sang container/port mới:

```txt
web -> localhost:3000
api -> localhost:4000
```

## 11. Rollback Khi Host Mới Có Lỗi

Nếu chưa đổi DNS:

- Dừng deploy sang host mới.
- Giữ người dùng trên host cũ.
- Kiểm tra lại database/storage/env.

Nếu đã đổi DNS:

1. Đổi DNS/reverse proxy về host cũ.
2. Nếu database mới đã nhận ghi mới, cần quyết định:
   - giữ database mới và sửa host mới; hoặc
   - đồng bộ dữ liệu mới ngược về database cũ trước khi rollback.
3. Không xóa backup cũ cho đến khi chắc chắn dữ liệu mới đã đầy đủ.

Rollback image trên host mới:

```env
IMAGE_TAG=<old-commit-sha>
```

Sau đó:

```bash
docker compose --env-file .env.production -f docker-compose.prod.yml pull
docker compose --env-file .env.production -f docker-compose.prod.yml up -d
```

## 12. Những Lỗi Thường Gặp

### API Không Kết Nối Được Database

- Kiểm tra `DATABASE_URL`.
- Kiểm tra firewall mở port SQL Server nếu database nằm ngoài Docker network.
- Kiểm tra username/password.
- Kiểm tra database name.
- Kiểm tra `trustServerCertificate=true` nếu dùng SQL Server certificate chưa chuẩn.

### Web Gọi Sai API

- Kiểm tra `NEXT_PUBLIC_API_URL`.
- Build lại Web image sau khi đổi public env.
- Kiểm tra `CORS_ORIGINS` có đúng domain Web không.

### Ảnh Cũ Không Hiển Thị

- Nếu local storage: kiểm tra volume/thư mục ảnh đã copy đúng chưa.
- Nếu R2: kiểm tra `S3_ENDPOINT`, `S3_BUCKET`, access key, secret key.
- Kiểm tra database `media.storageProvider` và `media.storageKey`.
- Kiểm tra API không expose raw storage key ra frontend.

### Upload Ảnh Mới Bị Lỗi

- Kiểm tra quyền ghi vào local volume hoặc bucket R2.
- Kiểm tra giới hạn upload của reverse proxy.
- Kiểm tra `MAX_UPLOAD_BYTES`.
- Kiểm tra log API.

### CI/CD Không Deploy Vào Host Mới

- Kiểm tra `VPS_HOST`, `VPS_USER`, `VPS_SSH_KEY`, `VPS_APP_DIR`.
- Kiểm tra user SSH có quyền chạy Docker.
- Kiểm tra `DEPLOY_ENABLED=true` nếu muốn auto deploy khi push `main`.
- Chạy workflow thủ công để xem log chi tiết.

## 13. Mẫu Biên Bản Di Dời

Nên ghi lại mỗi lần di dời:

```txt
Ngày di dời:
Người thực hiện:
Host cũ:
Host mới:
Database cũ:
Database mới:
Storage cũ:
Storage mới:
Backup database:
Backup storage:
Commit/image đang deploy:
Thời điểm đổi DNS:
Kết quả smoke test:
Vấn đề phát sinh:
Rollback plan:
```

Giữ biên bản này trong nơi quản lý vận hành riêng, không ghi secret thật vào repo.
