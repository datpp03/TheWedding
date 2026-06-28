# System Map (Sơ Đồ Tổng Quan Hệ Thống)

> Mục đích: cho agent (Codex) một bản đồ ngắn gọn về "thư mục nào chứa gì, file nào để làm gì, code mới nên đặt ở đâu, docs nào phải cập nhật". Đọc file này TRƯỚC khi sửa code hoặc tạo/sửa prompt để biết đúng vị trí và tiết kiệm token (không phải quét lại toàn repo).
>
> Khi cấu trúc thay đổi (thêm module/route/doc/prompt), PHẢI cập nhật file này trong cùng lần thay đổi.

## 1. Stack & Kiến Trúc

- Monorepo pnpm workspace + Turborepo (`pnpm-workspace.yaml`, `turbo.json`).
- Backend: NestJS (`apps/api`) theo Clean Architecture + DDD, Modular Monolith.
- Frontend: Next.js App Router (`apps/web`).
- Database: PostgreSQL qua TypeORM (lịch sử trước dùng SQL Server, nay là Postgres/Neon).
- Queue: BullMQ/Redis (fallback inline khi không có `REDIS_URL`).
- Chi tiết kiến trúc: `docs/ARCHITECTURE.md`. Quy tắc tầng: `docs/CLEAN_ARCHITECTURE_RULES.md`.

## 2. Cây Thư Mục Gốc

```txt
apps/api        Backend NestJS (Clean Architecture)
apps/web        Frontend Next.js (App Router)
packages/shared Types/constants/utils dùng chung cho api + web
packages/ui     React UI primitives dùng chung
packages/config eslint / tsconfig dùng chung
docs            Tài liệu sản phẩm + kỹ thuật (nguồn sự thật)
docker          Dockerfile + env mẫu cho runtime/production
scripts         Helper vận hành (PowerShell)
prompts         Prompt gửi cho Codex theo từng phase
.github         CI workflows, PR/issue templates
AGENTS.md       Role/quy tắc bắt buộc cho agent (đọc đầu tiên)
VIEC_CAN_LAM.md         Việc người dùng cần làm (do agent ghi sau mỗi prompt)
Y_TUONG_NANG_CAP.md     Ý tưởng nâng cấp/mở rộng (do agent đề xuất)
sieu_prompt_agent_web_anh_cuoi.md  Super prompt gốc định hướng toàn dự án
```

## 3. Backend `apps/api/src`

Mỗi domain module trong `apps/api/src/modules/<module>` theo 4 tầng:

```txt
domain/         Entity thuần, value object, interface repository, domain service (KHÔNG phụ thuộc framework/ORM)
application/    Use case / service, orchestration, authorization, transaction; file *.service.ts + *.spec.ts
infrastructure/ TypeORM *.orm-entity.ts, repository implementation, provider ngoài (storage/mail/queue)
presentation/   *.controller.ts, *.dto.ts, mapper request/response
<module>.module.ts   Khai báo NestJS module
README.md       Có khi logic phức tạp
```

Quy tắc: controller KHÔNG chứa business logic, KHÔNG gọi DB trực tiếp. Domain entity KHÔNG phụ thuộc ORM. Repository interface ở domain/application, implement ở infrastructure.

Modules hiện có (`apps/api/src/modules/`):

| Module          | Chức năng                                                                                                                                                                                                 | Trạng thái chính                                                                                              |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `auth`          | Đăng ký/đăng nhập/refresh/logout, session, forgot/reset, verify email, CSRF, OAuth (start + returnTo), MFA-ready                                                                                          | OAuth callback exchange & MFA enrollment CHƯA xong                                                            |
| `users`         | Domain user, MFA types, ORM entity                                                                                                                                                                        | MVP                                                                                                           |
| `tenants`       | Site/tenant CRUD, membership, public site, visibility                                                                                                                                                     | MVP done                                                                                                      |
| `albums`        | Album CRUD, cover, visibility, allow-download                                                                                                                                                             | MVP done                                                                                                      |
| `media`         | Upload, list, reorder, move, delete, serve, processing pipeline (Sharp + BullMQ)                                                                                                                          | Video preview metadata-only; malware scan & signed URL chưa có                                                |
| `public-albums` | Public home, featured, wishes, reactions, reaction symbols, search metadata                                                                                                                               | Featured curation/wish moderation/search consent chưa hoàn chỉnh                                              |
| `themes`        | Theme preset, màu, layout, preview/activate/clone/reset                                                                                                                                                   | MVP done                                                                                                      |
| `admin`         | Stats, quản lý user/tenant/media, audit, settings, feature flag, system parameters                                                                                                                        | MVP; monitoring/role editor/report nâng cao chưa có                                                           |
| `audit-logs`    | Ghi & đọc audit, redaction metadata nhạy cảm                                                                                                                                                              | Done; export/filter nâng cao chưa có                                                                          |
| `permissions`   | Role + permission ORM entity                                                                                                                                                                              | MVP                                                                                                           |
| `settings`      | System setting, feature flag, system parameters service                                                                                                                                                   | MVP                                                                                                           |
| `storage`       | `StorageService` adapter, local filesystem, S3-compatible/R2 object storage, local storage controller                                                                                                     | R2 adapter có cho API-managed upload; signed URL/direct upload/multipart chưa có                              |
| `scale`         | Phase 9 SaaS scale foundation: B2C/B2B plan catalog, add-ons, entitlements, user handles, tenant quota summaries, analytics events, payment-event idempotency, custom-domain/studio/greeting placeholders | Foundation done; real MoMo checkout/webhook, direct upload sessions, canonical public handle routes chưa xong |

Hạ tầng chung (`apps/api/src/`):

```txt
common/decorators   @CurrentUser, @Public, @Roles, @Permissions
common/guards       auth.guard, roles.guard, permissions.guard, tenant-access.guard
common/filters      http-exception.filter
common/interceptors api-response.interceptor (chuẩn hóa { success, data, message, meta })
common/middleware   request-correlation.middleware (x-correlation-id)
common/security     audit-redaction (xóa token/secret trước khi log)
common/types        authenticated-user, express-request
config/             env.validation.ts (Joi/zod env), cấu hình app
database/           data-source.ts, typeorm.config.ts, migrations/*, seeds/seed-roles-permissions.ts
main.ts             Bootstrap NestJS, prefix /api/v1
app.module.ts       Wire toàn bộ module
```

Migrations: `apps/api/src/database/migrations/` đặt tên `<timestamp>-<Name>.ts`. Migration mới phải có timestamp tăng dần và cập nhật `docs/DATABASE_DESIGN.md`.

## 4. Frontend `apps/web/src`

```txt
app/(public)/                Trang chủ public + site công khai
  page.tsx                   Trang chủ public (featured albums) = màn hình đầu tiên
  (public)/[siteSlug]/       Public wedding site theo slug
  (public)/albums/[albumId]/ Public album detail + social panel
app/(auth)/                  login, register, forgot-password, reset-password, verify-email
app/(dashboard)/dashboard/   Owner: albums, media, themes, settings
app/(admin)/admin/           Admin: users, tenants, media, audit-logs, settings
app/(admin)/admin/scale      Admin Scale: plans/add-ons/feature gates/entitlement unlock foundation
app/layout.tsx, globals.css  Layout gốc + style
middleware.ts                Bảo vệ route dashboard/admin
components/                  app-shell, page-header, metric-card (UI dùng lại nội bộ web)
features/<domain>/           Logic + API client + component theo domain
  auth/, media/, themes/, tenants/, admin/, public-albums/
  scale/                      Phase 9 admin scale API client + dashboard
  *-api.ts                   Gọi API backend
  *.tsx                      Component feature
lib/api-client.ts            Fetch wrapper + CSRF
lib/i18n/locales.ts          Từ điển i18n (vi, en, ja) — KHÔNG hard-code text UI
lib/navigation.ts            Route constants
stores/, hooks/, types/      State, hooks, type FE
```

Quy tắc FE: text hiển thị phải qua i18n key trong `lib/i18n/locales.ts` (vi/en/ja). UI theo `docs/UI_UX_DESIGN.md`. Trang đầu là public home, không ép login.

## 5. Packages dùng chung

```txt
packages/shared/src/
  api-response.ts   Kiểu response chuẩn
  media.ts          Hằng số/kiểu media + processing status
  permissions.ts    Hằng số permission
  roles.ts          Hằng số role
  tenant.ts         Kiểu tenant + ALBUM_VISIBILITY (public/unlisted/private)
  theme.ts          Theme preset/settings/validation
  index.ts          Re-export
packages/ui/src/    button.tsx, status-badge.tsx, index.ts
packages/config/    eslint base, tsconfig (base/nest/next)
```

Khi thêm type/constant dùng cho cả api + web: đặt ở `packages/shared/src`, export trong `index.ts`, chạy build shared.

## 6. Docs Index (`docs/`)

| File                          | Dùng để                                                                                                                          | Cập nhật khi                                                     |
| ----------------------------- | -------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| `PRODUCT_PLAN.md`             | Business model, gói B2C/B2B, add-on, design gate                                                                                 | Thêm/sửa feature liên quan business/UX                           |
| `PROJECT_OVERVIEW.md`         | Tóm tắt sản phẩm, user, định hướng                                                                                               | Đổi định hướng sản phẩm                                          |
| `ARCHITECTURE.md`             | Kiến trúc tổng thể, boundary                                                                                                     | Đổi kiến trúc/integration                                        |
| `CLEAN_ARCHITECTURE_RULES.md` | Quy tắc tầng backend                                                                                                             | Đổi quy ước tầng                                                 |
| `DATABASE_DESIGN.md`          | Schema, bảng, migration                                                                                                          | Thêm/sửa bảng/migration                                          |
| `API_DESIGN.md`               | Hợp đồng REST `/api/v1`                                                                                                          | Thêm/sửa endpoint                                                |
| `AUTH_SECURITY.md`            | Auth/security model                                                                                                              | Đổi auth/security                                                |
| `ROLE_PERMISSION.md`          | RBAC, role, permission                                                                                                           | Thêm/sửa role/permission                                         |
| `STORAGE_STRATEGY.md`         | Storage local/R2/CDN/signed URL                                                                                                  | Đổi storage/media delivery                                       |
| `SEO_GEO_GUIDELINES.md`       | Quy tắc SEO + Generative Engine Optimization, robots, sitemap, canonical, structured data, AI crawler policy, privacy index gate | Đổi public route/content/metadata/custom domain/discovery/prompt |
| `UI_UX_DESIGN.md`             | Hướng dẫn UI/UX + design gate                                                                                                    | Thêm/sửa UI                                                      |
| `TESTING_STRATEGY.md`         | Chiến lược test                                                                                                                  | Thêm loại test                                                   |
| `ENVIRONMENT_VARIABLES.md`    | Biến môi trường                                                                                                                  | Thêm/sửa env                                                     |
| `DEPLOYMENT.md`               | Deploy Vercel/Render/Neon + VPS                                                                                                  | Đổi deploy                                                       |
| `ROADMAP.md`                  | Trạng thái phase (done/planned)                                                                                                  | Sau mỗi phase                                                    |
| `CHANGELOG.md`                | Lịch sử thay đổi                                                                                                                 | Mỗi thay đổi                                                     |
| `DEVELOPMENT_LOG.md`          | Nhật ký chi tiết (đã làm/thiếu/file/risk)                                                                                        | Mỗi phase                                                        |
| `HUONG_DAN_SU_DUNG.md`        | Hướng dẫn dùng (tiếng Việt)                                                                                                      | Đổi hành vi người dùng                                           |
| `TROUBLESHOOTING.md`          | Lỗi thường gặp                                                                                                                   | Phát hiện lỗi/cách xử lý                                         |
| `GITHUB_FLOW.md`              | Quy trình Git/PR                                                                                                                 | Đổi quy trình                                                    |
| `guides/`                     | Hướng dẫn vận hành (CI/CD, free hosting, di dời host)                                                                            | Đổi vận hành                                                     |

## 7. Prompts (`prompts/`)

- `README.md`: thứ tự chạy + nguyên tắc chung + workflow bàn giao.
- `08a..08e`: các slice hoàn thiện (auth/email/MFA/OAuth; public discovery/moderation/audit; i18n/a11y/UI QA; media security/delivery; admin ops/monitoring/reports).
- `08_phase_9_scale_features.md`: payment/plan/B2B/R2/theme automation/greeting.
- `09_final_release_qa.md`: QA cuối + cleanup.
- `10_phase_10_cicd_docker_vps.md`: CI/CD Docker VPS (tùy chọn).
- Vòng đời prompt: chỉ xóa file prompt khi đã xong 100% + verify + docs + commit/push.

## 8. "Code/Việc Này Nên Đặt Ở Đâu" (Decision Guide)

- Endpoint/REST mới → controller + DTO ở `presentation/`, use case ở `application/`, repo interface ở `domain/`, repo TypeORM ở `infrastructure/`; cập nhật `docs/API_DESIGN.md`.
- Bảng DB mới → ORM entity ở `infrastructure/<entity>.orm-entity.ts` + migration mới ở `database/migrations/`; cập nhật `docs/DATABASE_DESIGN.md`.
- Type/constant dùng chung api+web → `packages/shared/src` + export `index.ts`.
- Trang web mới → route group đúng `(public|auth|dashboard|admin)` trong `apps/web/src/app`, logic ở `features/<domain>`, text qua `lib/i18n/locales.ts`.
- Permission/role mới → `packages/shared/src/permissions.ts|roles.ts` + seed `database/seeds/seed-roles-permissions.ts` + `docs/ROLE_PERMISSION.md`.
- Env mới → `apps/api/src/config/env.validation.ts` + `.env.example` + `docs/ENVIRONMENT_VARIABLES.md`.
- Provider ngoài (mail/storage/scanner/oauth) → adapter sau interface trong `infrastructure/`, không leak secret, có flag bật/tắt.
- Tạo/sửa prompt → đặt trong `prompts/`, theo cấu trúc chuẩn (xem `prompts/README.md` và `AGENTS.md`), tham chiếu đúng file/thư mục theo bản đồ này.
- Public route/metadata/SEO/GEO → đọc `docs/SEO_GEO_GUIDELINES.md`; cập nhật canonical, robots/noindex, sitemap, structured data, Open Graph, i18n metadata, privacy guard và tests phù hợp.

## 9. Verification chuẩn

`pnpm format:check`, `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build` (và smoke test khi đổi runtime). Có thể chạy theo filter, ví dụ `pnpm.cmd --filter @the-wedding/api test`.
