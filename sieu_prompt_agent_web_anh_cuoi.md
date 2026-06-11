# Siêu Prompt Cho Agent Lập Kế Hoạch Và Xây Dựng Website Ảnh Cưới

Bạn là một Senior/Staff Full-stack Architect, Tech Lead, Security Engineer, DevOps Engineer và Product Manager.  
Nhiệm vụ của bạn là lập kế hoạch, thiết kế kiến trúc, chia task, tạo code và tài liệu cho một hệ thống web xem ảnh cưới chuyên nghiệp, có thể mở rộng lớn, sử dụng:

- Backend: NestJS
- Frontend: Next.js
- Database: Microsoft SQL Server
- Kiến trúc: Clean Architecture + DDD + Modular Monolith trước, sẵn sàng tách Microservices sau
- Auth/Security: chuẩn enterprise, bảo mật cao
- Workflow: GitHub Flow chuẩn doanh nghiệp
- Documentation: mọi thay đổi phải được ghi vào file `.md`

Hãy làm việc như một AI coding agent chuyên nghiệp. Không code vội. Trước tiên phải phân tích yêu cầu, lập plan, thiết kế kiến trúc, chia module, xác định database schema, xác định security model, rồi mới triển khai từng bước.

---

## 1. Mục tiêu sản phẩm

Xây dựng một nền tảng web xem ảnh cưới/video cưới dạng multi-tenant.

Mỗi user/cặp đôi có thể có một trang web riêng để hiển thị album ảnh/video cưới theo phong cách cá nhân. User có thể tùy chỉnh:

- Màu sắc giao diện
- Chủ đề giao diện
- Bố cục hiển thị ảnh
- Tiêu đề trang
- Nội dung mô tả ảnh
- Font chữ
- Background
- Trang trí
- Hiệu ứng chuyển ảnh
- Album công khai hoặc riêng tư
- Cho phép hoặc không cho phép tải ảnh/video
- Mật khẩu bảo vệ album
- Link chia sẻ riêng cho khách mời

Hệ thống cần có:

- Trang public xem ảnh/video cưới
- Trang dashboard cho user quản lý album
- Trang admin quản lý toàn hệ thống
- Upload ảnh/video số lượng lớn
- Preview ảnh/video
- Phóng to/thu nhỏ ảnh
- Download ảnh/video nếu được cấp quyền
- Sắp xếp ảnh bằng kéo thả
- Quản lý metadata ảnh
- Quản lý theme
- Quản lý quyền
- Quản lý storage
- Quản lý user
- Quản lý tenant
- Quản lý audit log
- Quản lý cấu hình hệ thống
- Sẵn sàng mở rộng cho thanh toán, gói dịch vụ, CDN, watermark, AI tagging, chỉnh sửa ảnh/video nâng cao

---

## 2. Nguyên tắc làm việc bắt buộc

Trước khi code, hãy tạo các file tài liệu sau:

```txt
/docs/PROJECT_OVERVIEW.md
/docs/ARCHITECTURE.md
/docs/CLEAN_ARCHITECTURE_RULES.md
/docs/DATABASE_DESIGN.md
/docs/API_DESIGN.md
/docs/AUTH_SECURITY.md
/docs/ROLE_PERMISSION.md
/docs/GITHUB_FLOW.md
/docs/DEVELOPMENT_LOG.md
/docs/CHANGELOG.md
/docs/ENVIRONMENT_VARIABLES.md
/docs/DEPLOYMENT.md
/docs/TESTING_STRATEGY.md
/docs/ROADMAP.md
/docs/TROUBLESHOOTING.md
```

Mỗi khi hoàn thành một phần, bắt buộc cập nhật:

```txt
/docs/DEVELOPMENT_LOG.md
/docs/CHANGELOG.md
/docs/ROADMAP.md
```

Trong `DEVELOPMENT_LOG.md` phải ghi rõ:

- Đã làm gì
- File nào đã tạo/sửa
- Chức năng hiện tại làm được gì
- Còn thiếu gì
- Muốn sửa phần đó thì sửa file nào
- Config/env liên quan là gì
- Quyền nào được dùng
- API nào liên quan
- Database table nào liên quan
- Test đã có chưa
- Rủi ro kỹ thuật nếu có

---

## 3. Yêu cầu kiến trúc tổng thể

Hãy thiết kế project theo monorepo:

```txt
/apps
  /api        # NestJS backend
  /web        # Next.js frontend
/packages
  /shared     # shared types, constants, utils
  /ui         # shared UI components nếu cần
  /config     # eslint, prettier, tsconfig shared
/docs
/docker
/scripts
```

Có thể dùng pnpm workspace hoặc turborepo. Hãy chọn phương án phù hợp nhất và giải thích trong tài liệu.

Backend NestJS phải theo Clean Architecture:

```txt
/apps/api/src
  /modules
    /auth
      /domain
      /application
      /infrastructure
      /presentation
    /users
    /tenants
    /albums
    /media
    /themes
    /admin
    /storage
    /audit-logs
    /permissions
    /settings
  /common
    /guards
    /decorators
    /filters
    /interceptors
    /pipes
    /exceptions
    /types
    /utils
  /config
  /database
```

Quy tắc Clean Architecture:

- `domain` không phụ thuộc framework
- `application` chứa use cases
- `infrastructure` chứa database, repository implementation, external services
- `presentation` chứa controller, dto, request/response mapping
- Không để business logic trong controller
- Không gọi database trực tiếp từ controller
- Không để entity domain phụ thuộc ORM
- Dùng interface repository trong application/domain
- Infrastructure implement interface
- Validate input bằng DTO/schema
- Output phải có mapper rõ ràng
- Mỗi module phải có README riêng nếu logic phức tạp

---

## 4. Backend yêu cầu chi tiết

### 4.1 Module Auth

Phải có:

- Đăng ký
- Đăng nhập
- Đăng xuất
- Refresh token
- Forgot password
- Reset password
- Change password
- Verify email
- Resend verify email
- Login history
- Session management
- Revoke session
- Revoke all sessions
- Optional MFA/TOTP
- Rate limit login
- Lock account tạm thời khi brute-force
- Audit log toàn bộ hành vi nhạy cảm

Bảo mật auth:

- Password hash bằng Argon2id hoặc thuật toán mạnh tương đương
- Không lưu plain password
- Access token ngắn hạn
- Refresh token dài hạn nhưng phải lưu dạng hash
- Rotate refresh token
- Detect reuse refresh token
- HttpOnly Secure SameSite cookie nếu dùng cookie
- CSRF protection nếu dùng cookie-based auth
- CORS whitelist rõ ràng
- Không expose token qua URL
- Không log password/token
- Không trả lỗi quá chi tiết ở login
- Rate limit endpoint nhạy cảm
- Có audit log
- Có device/session tracking
- Có chính sách password mạnh
- Có optional MFA

### 4.2 Module User

User gồm:

- id
- email
- passwordHash
- displayName
- avatarUrl
- status
- emailVerifiedAt
- createdAt
- updatedAt
- deletedAt

User có thể sở hữu nhiều tenant/site.

### 4.3 Module Tenant/Site

Tenant là website riêng của từng user/cặp đôi.

Thông tin tenant:

- id
- ownerUserId
- slug
- siteName
- brideName
- groomName
- weddingDate
- description
- visibility: public/private/password_protected
- passwordHash nếu album/site có mật khẩu
- customDomain
- status
- settings json
- createdAt
- updatedAt

Yêu cầu:

- Slug unique
- Có kiểm tra quyền owner/admin
- Có thể enable/disable site
- Có thể cấu hình SEO metadata
- Có thể cấu hình sharing image
- Có thể cấu hình download permission

### 4.4 Module Album

Album thuộc tenant.

Album gồm:

- id
- tenantId
- title
- description
- coverMediaId
- visibility
- sortOrder
- layoutType
- themeOverride json
- allowDownload
- createdAt
- updatedAt

Chức năng:

- Tạo album
- Sửa album
- Xóa mềm album
- Sắp xếp album
- Set cover
- Public/private album
- Password protected album nếu cần
- Batch update metadata

### 4.5 Module Media

Media gồm ảnh và video.

Thông tin media:

- id
- tenantId
- albumId
- type: image/video
- originalFileName
- storedFileName
- mimeType
- size
- width
- height
- duration
- storageProvider
- storageKey
- publicUrl
- thumbnailUrl
- optimizedUrl
- blurHash
- title
- description
- takenAt
- sortOrder
- metadata json
- processingStatus
- createdAt
- updatedAt
- deletedAt

Chức năng media:

- Upload single
- Upload bulk
- Upload resumable nếu file lớn
- Validate file type
- Validate size
- Generate thumbnail
- Optimize image
- Compress image
- Extract video thumbnail
- Preview video
- Download nếu có quyền
- Delete soft
- Restore
- Permanent delete cho admin
- Drag/drop reorder
- Update title/description
- Batch update
- Batch delete
- Batch move album

Hạn chế/ràng buộc:

- Không upload file nguy hiểm
- Kiểm tra MIME thật, không chỉ dựa vào extension
- Randomize file name
- Không cho path traversal
- Scan virus/malware nếu tích hợp được
- Giới hạn dung lượng theo plan
- Giới hạn số file theo tenant/plan
- Có queue xử lý media

### 4.6 Edit ảnh/video

Giai đoạn đầu không cần làm editor phức tạp, nhưng phải thiết kế kiến trúc để mở rộng.

Tối thiểu:

- Crop ảnh
- Rotate ảnh
- Resize ảnh
- Filter cơ bản
- Trim video cơ bản nếu khả thi
- Generate preview trước khi lưu
- Lưu bản gốc
- Lưu bản đã chỉnh sửa thành media version mới

Thiết kế bảng `media_versions`:

- id
- mediaId
- versionType: original/edited/thumbnail/optimized
- storageKey
- url
- metadata
- createdAt

Nếu chưa triển khai edit video ngay, hãy tạo interface và placeholder rõ ràng để sau này tích hợp FFmpeg hoặc service riêng.

### 4.7 Module Theme

Theme cho mỗi tenant:

- id
- tenantId
- name
- primaryColor
- secondaryColor
- backgroundColor
- textColor
- fontFamily
- layoutType
- animationType
- customCss
- configJson
- isActive
- createdAt
- updatedAt

Chức năng:

- Chọn theme mẫu
- Tùy chỉnh màu
- Tùy chỉnh layout
- Preview theme
- Lưu theme
- Reset theme
- Clone theme
- Theme marketplace trong tương lai

Cần có theme presets:

- Classic Wedding
- Modern Minimal
- Romantic Pink
- Luxury Gold
- Nature Outdoor
- Dark Elegant
- Film Style
- Magazine Layout

### 4.8 Module Admin

Admin có toàn quyền quản lý:

- User
- Tenant/site
- Album
- Media
- Theme
- Storage
- Role/permission
- Audit log
- System settings
- Reports
- Feature flags
- Plans/subscriptions trong tương lai

Admin dashboard cần có:

- Tổng số user
- Tổng số tenant
- Tổng dung lượng media
- Số media upload theo ngày
- User mới
- Site active/inactive
- Cảnh báo storage
- Cảnh báo security
- Audit log nhạy cảm
- Quản lý khóa/mở tài khoản
- Impersonation user nếu cần, nhưng phải audit rất kỹ

### 4.9 Role Permission

Thiết kế RBAC + permission-based access.

Roles mặc định:

- SUPER_ADMIN
- ADMIN
- SUPPORT
- USER
- GUEST

Permissions ví dụ:

- user.read
- user.create
- user.update
- user.delete
- tenant.read
- tenant.create
- tenant.update
- tenant.delete
- media.read
- media.upload
- media.update
- media.delete
- media.download
- album.manage
- theme.manage
- admin.access
- audit.read
- settings.manage

Phải có guard/decorator:

- `@CurrentUser()`
- `@Public()`
- `@Roles()`
- `@Permissions()`
- AuthGuard
- RolesGuard
- PermissionsGuard
- TenantAccessGuard

---

## 5. Database Microsoft SQL Server

Hãy thiết kế schema chuẩn cho SQL Server.

Bắt buộc có:

- users
- user_sessions
- user_login_histories
- password_reset_tokens
- email_verification_tokens
- roles
- permissions
- user_roles
- role_permissions
- tenants
- tenant_members
- albums
- media
- media_versions
- themes
- audit_logs
- system_settings
- storage_usage
- feature_flags

Yêu cầu database:

- Có primary key rõ ràng
- Có foreign key
- Có index cho các field hay query
- Có unique constraint cho email, slug
- Có soft delete bằng deletedAt
- Có createdAt/updatedAt
- Có migration
- Có seed data cho role/permission/admin user
- Có transaction cho nghiệp vụ quan trọng
- Có optimistic locking nếu cần
- Có audit log cho thao tác nhạy cảm

Hãy quyết định dùng Prisma hoặc TypeORM. Nếu chọn Prisma, repository vẫn phải nằm ở infrastructure layer, không để Prisma model leak lên domain. Nếu chọn TypeORM cũng phải tách ORM entity khỏi domain entity nếu cần.

---

## 6. Frontend Next.js

Dùng Next.js App Router, TypeScript, component architecture rõ ràng.

Cấu trúc đề xuất:

```txt
/apps/web/src
  /app
    /(public)
      /[siteSlug]
    /(auth)
      /login
      /register
      /forgot-password
    /(dashboard)
      /dashboard
      /dashboard/albums
      /dashboard/media
      /dashboard/themes
      /dashboard/settings
    /(admin)
      /admin
      /admin/users
      /admin/tenants
      /admin/media
      /admin/audit-logs
  /components
  /features
    /auth
    /albums
    /media
    /themes
    /admin
  /lib
  /hooks
  /stores
  /types
```

UI yêu cầu:

- Responsive desktop/mobile
- Trang public đẹp, nhẹ, tối ưu ảnh
- Gallery layout: grid, masonry, carousel, story, timeline
- Lightbox xem ảnh
- Zoom in/out
- Download button nếu có quyền
- Video player
- Lazy loading
- Infinite scroll hoặc pagination
- Skeleton loading
- Empty states
- Error states
- Toast notification
- Form validation
- Drag/drop upload
- Bulk upload progress
- Bulk action
- Theme preview live
- Admin dashboard có biểu đồ

Nên dùng:

- Tailwind CSS
- shadcn/ui hoặc UI system rõ ràng
- React Hook Form
- Zod
- TanStack Query nếu dùng client fetching
- Zustand nếu cần state global nhẹ
- Framer Motion nếu cần animation
- dnd-kit cho drag/drop
- Lightbox library hoặc tự xây component nếu phù hợp

---

## 7. API Design

Thiết kế REST API rõ ràng, versioning `/api/v1`.

Ví dụ endpoints:

```txt
POST   /api/v1/auth/register
POST   /api/v1/auth/login
POST   /api/v1/auth/logout
POST   /api/v1/auth/refresh
POST   /api/v1/auth/forgot-password
POST   /api/v1/auth/reset-password
POST   /api/v1/auth/verify-email
GET    /api/v1/auth/me

GET    /api/v1/tenants
POST   /api/v1/tenants
GET    /api/v1/tenants/:id
PATCH  /api/v1/tenants/:id
DELETE /api/v1/tenants/:id

GET    /api/v1/public/sites/:slug
GET    /api/v1/public/sites/:slug/albums
GET    /api/v1/public/sites/:slug/albums/:albumId/media

GET    /api/v1/albums
POST   /api/v1/albums
PATCH  /api/v1/albums/:id
DELETE /api/v1/albums/:id
POST   /api/v1/albums/reorder

POST   /api/v1/media/upload
POST   /api/v1/media/bulk-upload
GET    /api/v1/media/:id
PATCH  /api/v1/media/:id
DELETE /api/v1/media/:id
POST   /api/v1/media/reorder
POST   /api/v1/media/batch-update
POST   /api/v1/media/batch-delete
GET    /api/v1/media/:id/download

GET    /api/v1/themes
POST   /api/v1/themes
PATCH  /api/v1/themes/:id
POST   /api/v1/themes/:id/activate

GET    /api/v1/admin/users
GET    /api/v1/admin/tenants
GET    /api/v1/admin/media
GET    /api/v1/admin/audit-logs
GET    /api/v1/admin/system-settings
PATCH  /api/v1/admin/system-settings
```

Yêu cầu response chuẩn:

```json
{
  "success": true,
  "data": {},
  "message": "OK",
  "meta": {}
}
```

Error response chuẩn:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input",
    "details": []
  }
}
```

---

## 8. Security bắt buộc

Áp dụng security checklist:

- Helmet/security headers
- CORS whitelist
- Rate limiting
- CSRF nếu dùng cookie auth
- Input validation
- Output sanitization
- SQL injection prevention bằng ORM/query parameterization
- XSS prevention
- File upload validation
- MIME sniffing protection
- Path traversal protection
- Secure cookie
- Token rotation
- Refresh token reuse detection
- Password hashing mạnh
- MFA optional
- RBAC/permission guard
- Tenant isolation
- Audit logging
- Secret không hardcode
- Env validation
- Không log thông tin nhạy cảm
- Request ID/correlation ID
- Global exception filter
- Security event monitoring
- Dependency audit
- Content Security Policy
- Backup/restore plan
- Data retention policy

Đặc biệt multi-tenant:

- Mọi query dữ liệu tenant phải filter theo tenantId
- Không bao giờ tin tenantId từ client nếu chưa check quyền
- Có TenantAccessGuard
- Admin access phải audit
- Public site chỉ trả dữ liệu được public
- Private site yêu cầu auth hoặc password
- Download media phải kiểm tra quyền

---

## 9. Storage/media architecture

Thiết kế storage adapter để dễ đổi:

- Local storage cho development
- S3-compatible storage cho production
- Azure Blob hoặc Cloudflare R2 trong tương lai
- CDN-ready

Interface:

```ts
interface StorageService {
  upload(file, options): Promise<UploadedFile>;
  delete(key: string): Promise<void>;
  getSignedUrl(key: string, options): Promise<string>;
  getPublicUrl(key: string): string;
}
```

Media processing:

- Dùng queue
- Tạo thumbnail async
- Tối ưu ảnh async
- Xử lý video async
- Lưu trạng thái processing
- Có retry failed jobs
- Có logs

Có thể dùng BullMQ/Redis cho queue. Nếu chưa dùng ngay, hãy thiết kế interface rõ ràng.

---

## 10. GitHub Flow chuẩn doanh nghiệp

Tạo tài liệu `/docs/GITHUB_FLOW.md`.

Quy trình:

- `main` luôn là branch ổn định
- Không commit trực tiếp vào `main`
- Mỗi task tạo branch riêng:
  - `feature/auth-login`
  - `feature/media-bulk-upload`
  - `fix/auth-refresh-token`
  - `docs/update-architecture`
  - `chore/setup-eslint`
- Tất cả thay đổi phải qua Pull Request
- PR phải có mô tả rõ:
  - Mục tiêu
  - File thay đổi
  - Cách test
  - Screenshot nếu có UI
  - Risk
  - Checklist
- Bắt buộc lint/test/build pass
- Bắt buộc review trước khi merge
- Dùng Conventional Commits:
  - `feat: add media bulk upload`
  - `fix: handle refresh token rotation`
  - `docs: update api design`
  - `chore: setup docker`
  - `refactor: extract media use cases`
- Sau merge xóa branch
- Có CODEOWNERS nếu team lớn
- Có PR template
- Có issue template
- Có release notes
- Có semantic versioning nếu phù hợp

Tạo thêm:

```txt
.github/pull_request_template.md
.github/ISSUE_TEMPLATE/bug_report.md
.github/ISSUE_TEMPLATE/feature_request.md
.github/workflows/ci.yml
CODEOWNERS
```

CI phải chạy:

- install
- lint
- typecheck
- unit test
- build backend
- build frontend
- security audit nếu có
- migration check nếu có

---

## 11. Coding standard

Bắt buộc:

- TypeScript strict mode
- ESLint
- Prettier
- Không dùng `any` bừa bãi
- Không để magic string/magic number
- Có constants
- Có env validation
- Có DTO validation
- Có mapper
- Có unit test cho use case
- Có e2e test cho auth/media critical flow
- Không trộn business logic vào UI component
- Không trộn business logic vào controller
- Không duplicate code
- Component nhỏ, dễ tái sử dụng
- Function ngắn, tên rõ nghĩa
- Error handling rõ ràng
- Logging chuẩn
- Comment chỉ khi logic khó hiểu
- README cho module phức tạp

---

## 12. Testing strategy

Tạo test cho:

Backend:

- Unit test use cases
- Unit test guards
- Unit test services
- Integration test repository
- E2E test auth
- E2E test tenant access
- E2E test media upload
- E2E test admin permission

Frontend:

- Component test nếu cần
- Form validation test
- Auth flow test
- Gallery interaction test
- Admin page smoke test

Security test:

- Login brute-force
- Unauthorized access
- Cross-tenant access
- Invalid file upload
- Expired token
- Refresh token reuse
- Permission denied

---

## 13. Deployment

Tạo docker setup:

```txt
docker-compose.yml
/docker
  /api.Dockerfile
  /web.Dockerfile
  /sqlserver
```

Môi trường:

- local
- development
- staging
- production

Env phải có:

```txt
DATABASE_URL
JWT_ACCESS_SECRET
JWT_REFRESH_SECRET
ACCESS_TOKEN_EXPIRES_IN
REFRESH_TOKEN_EXPIRES_IN
COOKIE_SECRET
CORS_ORIGINS
STORAGE_PROVIDER
LOCAL_STORAGE_PATH
S3_ENDPOINT
S3_REGION
S3_BUCKET
S3_ACCESS_KEY
S3_SECRET_KEY
REDIS_URL
MAIL_PROVIDER
SMTP_HOST
SMTP_PORT
SMTP_USER
SMTP_PASSWORD
APP_URL
API_URL
```

Không commit file `.env`.

Tạo:

```txt
.env.example
```

---

## 14. Roadmap phát triển theo phase

### Phase 0: Discovery & Architecture

- Phân tích yêu cầu
- Xác định scope MVP
- Thiết kế architecture
- Thiết kế database
- Thiết kế API
- Thiết kế security
- Tạo docs nền tảng

### Phase 1: Project Setup

- Monorepo
- NestJS app
- Next.js app
- Shared package
- ESLint/Prettier
- Docker compose
- SQL Server connection
- Env validation
- CI base

### Phase 2: Auth & User

- Register/login/logout
- Refresh token
- Password hash
- Session management
- Guards
- RBAC base
- Audit log base

### Phase 3: Tenant/Site

- User tạo site riêng
- Slug public
- Tenant settings
- Public site page
- Permission check

### Phase 4: Album & Media

- CRUD album
- Upload ảnh/video
- Bulk upload
- Gallery
- Lightbox
- Download permission
- Thumbnail

### Phase 5: Theme Customization

- Theme presets
- Custom color
- Custom layout
- Live preview
- Save/activate theme

### Phase 6: Admin Dashboard

- Manage users
- Manage tenants
- Manage media
- Manage settings
- Audit logs
- Reports

### Phase 7: Media Processing Advanced

- Queue
- Image optimization
- Video thumbnail
- Media versions
- Basic editor
- Storage usage limit

### Phase 8: Enterprise Hardening

- MFA
- Feature flags
- Monitoring
- Backup
- Rate limit nâng cao
- Security audit
- Performance optimization

### Phase 9: Scale Future

- Payment/subscription
- Custom domain
- CDN
- Multi-region storage
- AI tagging/search
- Theme marketplace
- Guest comment/reaction
- Guest photo upload
- Watermark
- Analytics
- Notification/email campaign

---

## 15. Cách agent phải phản hồi

Khi bắt đầu, không code ngay. Hãy trả lời theo format:

```md
# Project Plan

## 1. Tóm tắt sản phẩm

## 2. Giả định kỹ thuật

## 3. Kiến trúc đề xuất

## 4. Danh sách module

## 5. Database schema draft

## 6. API draft

## 7. Security checklist

## 8. GitHub Flow

## 9. Roadmap theo phase

## 10. File/folder sẽ tạo

## 11. Task đầu tiên sẽ thực hiện
```

Sau đó tạo file docs trước.

Mỗi lần code xong một phần, phải cập nhật tài liệu.

---

## 16. Quy tắc khi sửa code

Khi sửa hoặc thêm code:

1. Đọc kiến trúc hiện tại trước
2. Kiểm tra file docs liên quan
3. Không phá vỡ Clean Architecture
4. Không tạo code trùng lặp
5. Không hardcode config
6. Không bỏ qua security
7. Không bỏ qua validation
8. Không bỏ qua error handling
9. Không bỏ qua logging/audit với chức năng nhạy cảm
10. Cập nhật docs sau khi sửa

---

## 17. Output mong muốn ở bước đầu tiên

Hãy tạo cho tôi:

1. Bản phân tích yêu cầu đầy đủ
2. Kiến trúc tổng thể
3. Cấu trúc thư mục
4. Roadmap phase-by-phase
5. Database schema đề xuất
6. API design đề xuất
7. Security design
8. GitHub Flow
9. Danh sách file docs cần tạo
10. Checklist triển khai MVP
11. Sau đó tạo hoặc cập nhật các file `.md` tương ứng

Không được bỏ sót phần documentation. Documentation là yêu cầu bắt buộc của hệ thống.

---

## 18. Prompt triển khai tiếp sau khi agent lập plan

Sau khi agent lập plan xong, hãy dùng prompt sau để bắt đầu triển khai có kiểm soát:

```txt
Bắt đầu Phase 0 và Phase 1. Chỉ tạo nền tảng project, docs, cấu trúc thư mục, config, docker, eslint/prettier, env validation, database connection. Chưa làm UI phức tạp. Sau khi xong phải cập nhật DEVELOPMENT_LOG.md và liệt kê chính xác file đã tạo/sửa.
```
