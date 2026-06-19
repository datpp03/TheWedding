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

[NEW] Định hướng kinh doanh: đây là hệ thống SaaS cho website ảnh cưới, dùng chung một nền tảng kỹ thuật nhưng mỗi khách hàng có không gian website, giao diện, media, cấu hình và trải nghiệm chia sẻ độc lập.

[NEW] Nguồn thu chính là các gói dịch vụ tạo website cưới cho cô dâu/chú rể, phân cấp theo dung lượng, số lượng ảnh/video, theme, tên miền riêng, bảo mật và tính năng nâng cao.

[NEW] Nguồn thu phụ/B2B là gói thuê bao cho studio/nhiếp ảnh gia để quản lý nhiều khách hàng, tạo album trực tuyến chuyên nghiệp, chia sẻ review/delivery link và gắn branding studio.

[NEW] Dịch vụ mở rộng gồm mua thêm dung lượng, tên miền riêng, giao diện cao cấp, bảo mật nâng cao, watermark, chỉnh sửa ảnh/video online, AI phân loại/tìm kiếm/tối ưu chất lượng ảnh và các add-on giá trị gia tăng khác.

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
- Quản lý tham số hệ thống/feature flags để bật tắt đăng ký, đăng nhập, upload, download, public gallery, payment và các chức năng lớn mà không cần deploy lại
- Quản lý gói dịch vụ, thanh toán, dung lượng lưu trữ, premium feature và admin entitlement unlock
- Sẵn sàng mở rộng cho thanh toán, gói dịch vụ, Cloudflare R2, CDN, watermark, AI tagging, chỉnh sửa ảnh/video nâng cao
- Thanh toán ưu tiên MoMo trước, nhưng kiến trúc phải hỗ trợ thêm provider sau này
- Public album URL phải có user handle/id cá nhân hóa giống TikTok để nhiều user có album trùng tên vẫn không xung đột đường dẫn
- [NEW] Trang đầu tiên khi vào website là trang chủ public hiển thị album công khai nổi bật trong ngày và trong tuần, không phải trang đăng nhập.
- [NEW] Album có 3 mức riêng tư rõ ràng: công khai, chỉ người có link, riêng tư.
- [NEW] User phải đăng nhập mới được gửi lời chúc hoặc yêu thích/tặng biểu tượng cho album.
- [NEW] Biểu tượng yêu thích/reaction không cố định toàn hệ thống; mỗi album/theme có thể dùng tim, sao, hoa anh đào, lá cây, cá hoặc biểu tượng khác đã được validate.
- [NEW] Nếu user chưa đăng nhập mà bấm gửi lời chúc hoặc reaction, hệ thống chuyển sang đăng nhập và sau khi đăng nhập thành công quay lại đúng album trước đó.
- [NEW] Hỗ trợ đăng nhập Google và Facebook trên nền auth/session hiện có.
- [NEW] Sau khi đăng nhập, user có thể tìm kiếm album theo tiêu chí được phép như độ tuổi, khu vực, thời gian, địa điểm và chủ đề.
- [NEW] Audit log/truy vết hoạt động phục vụ bảo mật, thống kê và quản trị, nhưng không ghi mật khẩu, token, cookie, OTP, OAuth code hoặc provider secret.
- [NEW] Custom Theme cá nhân: mỗi album/site cho phép tùy chỉnh màu sắc hoặc chọn theme có sẵn; premium theme phải có plan/entitlement gate.
- [NEW] Admin Theme Control: admin có bảng điều khiển cấu hình màu chủ đạo, theme mặc định, theme cao cấp và fallback theme toàn hệ thống.
- [NEW] Dynamic Contextual Theme: hệ thống có thể tự đổi tông màu/hiệu ứng theo ngày đêm, thời tiết, mùa, lễ hội, sự kiện và vị trí nếu người dùng cho phép; luôn có opt-out và reduced-motion.
- [NEW] Automated Greetings: tự động kích hoạt lời chúc sinh nhật, kỷ niệm ngày cưới, Valentine, Tết, ngày cầu hôn hoặc custom date bằng template i18n/l10n.
- [NEW] Studio/B2B workspace: studio/nhiếp ảnh gia có thể quản lý client, album delivery, branding, quota và subscription riêng.
- [NEW] SEO/GEO: mọi trang public phải tối ưu cho search engines và AI answer/search engines bằng canonical URL, metadata, sitemap, structured data, Open Graph, robots/AI crawler policy, performance và privacy-first indexing. Không được index hoặc expose album private, unlisted/link-only, auth/admin/dashboard, callback, signed media, raw storage key hoặc dữ liệu nhạy cảm.

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
/docs/SEO_GEO_GUIDELINES.md
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
- Google OAuth login
- Facebook OAuth login
- Return-to-album sau đăng nhập cho các action cần auth như lời chúc/reaction
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
- Không log OAuth authorization code/provider token/provider secret
- Chặn open redirect trong `returnTo`, chỉ cho relative same-origin path hoặc allowlist rõ ràng
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
- publicHandle/userHandle unique, cho phép người dùng tự đặt giống TikTok ID
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
- Có canonical URL, Open Graph metadata, sitemap eligibility và structured data theo `docs/SEO_GEO_GUIDELINES.md`
- Có thể cấu hình sharing image
- Có thể cấu hình download permission

### 4.4 Module Album

Album thuộc tenant.

Album gồm:

- id
- tenantId
- title
- slug hoặc shortId dùng cho URL, chỉ cần unique trong phạm vi user/tenant; public URL canonical phải có userHandle
- description
- coverMediaId
- visibility
- privacy/visibility gồm public, unlisted/link-only, private
- sortOrder
- layoutType
- themeOverride json
- reactionSymbols json hoặc cấu hình symbol theo theme/album
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
- Album công khai có thể xuất hiện trên trang chủ/search/timeline.
- Album chỉ người có link không xuất hiện công khai, chỉ ai có link mới xem được.
- Album riêng tư chỉ chủ album hoặc admin/support được phép xem.
- Chỉ album công khai, owner-approved/indexable mới được vào sitemap, structured data hoặc AI-facing summaries; unlisted/private không bao giờ vào public discovery/SEO/GEO.
- Gửi lời chúc cho album, yêu cầu đăng nhập.
- Yêu thích/tặng biểu tượng cho album, yêu cầu đăng nhập.
- Cấu hình biểu tượng reaction theo album/theme, không hardcode một icon duy nhất.
- Redirect sang login khi user chưa đăng nhập bấm wish/reaction và quay lại đúng album sau khi login thành công.
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
- [NEW] Album-level theme override nếu cần cho từng album riêng.
- [NEW] Admin global theme control cho màu chủ đạo, theme mặc định, premium theme availability và fallback.
- [NEW] Contextual theme resolver theo ngày/đêm, mùa, lễ hội, thời tiết, sự kiện và vị trí opt-in.
- [NEW] Automated greeting visuals gắn với birthday, wedding anniversary, Valentine, Tết, proposal anniversary hoặc custom dates.

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
- Plans/subscriptions
- Payment/MoMo transactions
- Manual entitlement unlock/revoke cho user/tenant
- [NEW] Global theme settings, premium theme availability, contextual theme rules và automated greeting rules
- [NEW] Studio/B2B accounts, studio subscriptions, client albums và delivery/reporting status

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
- Quản lý tham số hệ thống:
  - bật/tắt đăng ký người dùng mới
  - bật/tắt đăng nhập; khi tắt thì người dùng chỉ được xem public/read-only theo cấu hình
  - bật/tắt upload, download, public gallery, payment checkout và các feature lớn khác
  - thông báo bảo trì/disabled flow
- Quản lý plan/subscription:
  - giới hạn dung lượng theo gói
  - mở khóa chức năng nâng cao
  - admin có thể tự mở khóa quyền hoặc tăng quota cho bất kỳ user/tenant nào

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
- plans
- plan_features
- subscriptions
- payments
- payment_events
- entitlements
- [NEW] oauth_accounts
- [NEW] album_wishes
- [NEW] album_reactions
- [NEW] album_reaction_symbols
- [NEW] album_featured_entries
- [NEW] album_search_metadata
- [NEW] studio_profiles
- [NEW] studio_clients
- [NEW] studio_client_albums
- [NEW] theme_system_settings
- [NEW] contextual_theme_rules
- [NEW] greeting_rules
- [NEW] greeting_events

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
- users.publicHandle phải unique
- album slug/display name có thể trùng giữa các user; canonical public album URL phải chứa userHandle hoặc userId

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

- [NEW] Trước khi code UI, agent phải thực hiện quy trình 3 bước:
  1. Phân tích cảm xúc màn hình và xác định yếu tố người dùng cần thấy đầu tiên.
  2. Đề xuất layout, màu sắc, spacing, typography, animation và các trạng thái hover/focus/loading/empty/error/success.
  3. Chốt hướng thiết kế rõ ràng rồi mới chuyển sang code; nếu không có mockup riêng thì ghi checklist signoff trong summary hoặc docs.
- [NEW] Không được làm giao diện chỉ trắng/xám đơn điệu; mỗi màn hình chính phải có điểm nhấn màu có chủ đích.
- [NEW] Mỗi section phải có khoảng thở hợp lý, tránh nhồi nội dung.
- [NEW] Card component phải có hierarchy rõ ràng: image/thumbnail, title, subtitle, metadata nếu cần và action chính.
- Responsive desktop/mobile
- Trang public đẹp, nhẹ, tối ưu ảnh
- Trang public phải có semantic heading, title/description, canonical, Open Graph, alt/caption fallback, structured data nếu phù hợp, sitemap eligibility và noindex policy rõ ràng cho nội dung không public.
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
GET    /api/v1/auth/oauth/google
GET    /api/v1/auth/oauth/google/callback
GET    /api/v1/auth/oauth/facebook
GET    /api/v1/auth/oauth/facebook/callback

GET    /api/v1/tenants
POST   /api/v1/tenants
GET    /api/v1/tenants/:id
PATCH  /api/v1/tenants/:id
DELETE /api/v1/tenants/:id

GET    /api/v1/public/sites/:slug
GET    /api/v1/public/sites/:slug/albums
GET    /api/v1/public/sites/:slug/albums/:albumId/media
GET    /api/v1/public/home
GET    /api/v1/public/albums/featured?window=today|week
GET    /api/v1/albums/search

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
POST   /api/v1/albums/:id/wishes
GET    /api/v1/public/albums/:id/wishes
POST   /api/v1/albums/:id/reactions
GET    /api/v1/public/albums/:id/reactions

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
- Public home/search/timeline chỉ trả album public; không leak album chỉ người có link hoặc riêng tư
- Public SEO/GEO cũng phải chỉ dùng dữ liệu public/owner-approved; không đưa dữ liệu private/unlisted vào canonical, sitemap, structured data, Open Graph, AI crawler output hoặc public cache
- Wish/reaction yêu cầu đăng nhập; anonymous action phải redirect login an toàn và quay lại đúng album
- OAuth Google/Facebook phải chống open redirect và không log provider token/code/secret
- Private site yêu cầu auth hoặc password
- Download media phải kiểm tra quyền

---

## 9. Storage/media architecture

Thiết kế storage adapter để dễ đổi:

- Local storage cho development
- Cloudflare R2/S3-compatible storage cho production
- Azure Blob hoặc AWS S3 trong tương lai nếu cần
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
- Resize/nén ảnh async; frontend ưu tiên hiển thị bản optimized/compressed
- Flow mục tiêu: người dùng upload ảnh gốc -> backend validate, resize/nén -> lưu original private và bản optimized lên Cloudflare R2 qua StorageService -> frontend tải bản đã nén/optimized để hiển thị
- Xử lý video async
- Lưu trạng thái processing
- Có retry failed jobs
- Có logs
- Khi tới bước triển khai R2, phải hướng dẫn người dùng đăng ký Cloudflare, bật R2, tạo bucket, tạo access key, cấu hình env/CORS và smoke test upload

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
- SEO/GEO smoke test cho public metadata, canonical, sitemap, robots/noindex, structured data, Open Graph, i18n metadata và private/unlisted exclusion

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
/docs/guides
  /CI_CD_DOCKER_VPS.md
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
- CI/CD plan: GitHub Actions build Docker image -> push Docker Hub/GHCR -> VPS pull image mới -> restart container

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

### Priority Phase: CI/CD Docker VPS

Thực hiện trước các phase còn lại để có thể deploy lên host/VPS và xem tiến độ từ xa.

- GitHub Actions build API/Web Docker images
- Push image lên Docker Hub hoặc GHCR
- VPS pull image mới
- Restart container bằng Docker Compose
- GitHub Secrets cho registry và VPS SSH
- Tag image bằng latest/main và commit SHA để rollback
- Hướng dẫn cấu hình nằm trong `docs/guides/CI_CD_DOCKER_VPS.md`

### Phase 6: Admin Dashboard

- Manage users
- Manage tenants
- Manage media
- Manage settings
- Audit logs
- Reports
- System parameters/feature flags cho đăng ký, đăng nhập/read-only mode, upload, download, public gallery, payment và maintenance message

### Phase 7: Media Processing Advanced

- Queue
- Image optimization
- Resize/nén ảnh và ưu tiên frontend hiển thị bản optimized
- Video thumbnail
- Media versions
- Basic editor
- Storage usage limit

### Phase 8A: Public Album Discovery & Social Interaction

- Bảo mật và cấu trúc mở rộng cho album privacy public/unlisted/private
- Trang chủ public với album nổi bật trong ngày/tuần
- Lời chúc album và reaction theo biểu tượng tùy theme/album, yêu cầu đăng nhập
- Google/Facebook OAuth và redirect quay lại đúng album sau đăng nhập
- Tìm kiếm album nâng cao sau đăng nhập theo độ tuổi, khu vực, thời gian, địa điểm, chủ đề
- Audit log/truy vết hoạt động cho OAuth, privacy change, featured curation, wish/reaction moderation và search abuse, không ghi dữ liệu nhạy cảm

### Phase 8: Enterprise Hardening

- MFA
- Feature flags
- Monitoring
- Backup
- Rate limit nâng cao
- Security audit
- Performance optimization

### Phase 9: Scale Future

- Payment/subscription với MoMo là provider đầu tiên
- Plan, premium feature, storage quota upgrades và admin entitlement unlock/revoke
- [NEW] B2C SaaS packages theo storage, số lượng ảnh/video, premium theme, custom domain, privacy/security, analytics và add-on
- [NEW] B2B studio subscription foundation cho studio profile, client management, branding, delivery/review link và quota cao hơn
- [NEW] Value-added services: extra storage, custom domain, premium themes, advanced security, watermark, online editing và AI utilities
- Custom domain
- CDN
- Cloudflare R2 production storage, signed URLs và hướng dẫn đăng ký/cấu hình R2
- Multi-region storage nếu provider hỗ trợ hoặc cần mở rộng
- AI tagging/search
- Theme marketplace
- Guest comment/reaction
- Guest photo upload
- Watermark
- Analytics
- Notification/email campaign
- User public handle giống TikTok và canonical album URL có userHandle để tránh trùng tên album giữa các user
- [NEW] Admin Theme Control, Dynamic Contextual Theme và Automated Greetings nếu core SaaS đã ổn định; nếu chưa thì để placeholder rõ ràng sau feature flag/admin setting
- [NEW] SEO/GEO hardening: robots.txt, sitemap.xml, canonical handle/custom-domain routing, structured data, Open Graph previews, AI crawler policy và noindex coverage cho protected routes.

---

## 15. Cách agent phải phản hồi

Khi bắt đầu, không code ngay. Hãy trả lời theo format:

```md
# Project Plan

## 1. Tóm tắt sản phẩm

## 2. Business model và phân khúc người dùng [NEW]

## 3. Giả định kỹ thuật

## 4. Kiến trúc đề xuất

## 5. Danh sách module

## 6. Database schema draft

## 7. API draft

## 8. UI/UX execution workflow [NEW]

## 9. Security checklist

## 10. GitHub Flow

## 11. Roadmap theo phase

## 12. File/folder sẽ tạo

## 13. Task đầu tiên sẽ thực hiện
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
