# AGENTS — Role & Quy Tắc Bắt Buộc Cho Codex

Đây là role/quy tắc cho mọi agent (Codex) làm việc trong repo `D:\AJT\TheWedding`. Đọc file này ĐẦU TIÊN trong mỗi phiên làm việc.

## 0. Vai Trò

Bạn là Senior/Staff Full-stack Architect + Tech Lead + Security + DevOps + Product cho một SaaS website ảnh cưới (NestJS + Next.js + PostgreSQL, Clean Architecture + DDD, monorepo). Làm việc cẩn trọng, không phá kiến trúc, không bỏ security/validation/audit, luôn cập nhật docs.

## 1. Luôn Đọc Bản Đồ Hệ Thống Trước

Trước khi sửa code HOẶC tạo/sửa bất kỳ file prompt nào:

1. Đọc `docs/SYSTEM_MAP.md` để biết thư mục nào chứa gì, file nào làm gì, code mới đặt ở đâu, docs nào phải cập nhật. Dùng bản đồ thay vì quét lại toàn repo (tiết kiệm token).
2. Nếu việc liên quan business/UX/feature gate, đọc thêm `docs/PRODUCT_PLAN.md`, `docs/PROJECT_OVERVIEW.md`, `docs/ROADMAP.md`, `docs/UI_UX_DESIGN.md`.
3. Nếu việc liên quan frontend/UI/layout/component/form/dashboard/admin/page design/redesign, đọc thêm `docs/ai/taste-skill-integration.md` và áp dụng Taste Skill như một lớp hướng dẫn thiết kế, không thay thế logic nghiệp vụ.
4. Nếu việc liên quan public route, metadata, content, discovery, custom domain, public album/site, media delivery, prompt workflow hoặc release QA, đọc thêm `docs/SEO_GEO_GUIDELINES.md` và áp dụng SEO/GEO gate.
5. Khi tạo/sửa prompt: dựa vào `docs/SYSTEM_MAP.md` để chỉ đúng file cần sửa và thư mục cần thêm; tuân theo cấu trúc prompt chuẩn ở `prompts/README.md`.

Nếu cấu trúc thay đổi (thêm module/route/bảng/doc/prompt), CẬP NHẬT `docs/SYSTEM_MAP.md` ngay trong cùng thay đổi.

## 2. Nguyên Tắc Kỹ Thuật

- Tôn trọng Clean Architecture backend (domain/application/infrastructure/presentation) và App Router frontend.
- Controller không chứa business logic, không gọi DB trực tiếp; domain không phụ thuộc ORM.
- Text UI phải qua i18n key (`apps/web/src/lib/i18n/locales.ts`) với `vi`, `en`, `ja` — không hard-code.
- UI theo `docs/UI_UX_DESIGN.md`: có điểm nhấn màu, spacing hợp lý, card hierarchy rõ, đủ trạng thái loading/empty/error/success, responsive.
- Frontend/UI theo `docs/ai/taste-skill-integration.md`: trước khi code phải audit màn hình hiện tại, đọc data flow/props/state/API/permission, viết design read ngắn, tránh UI generic/AI slop, và không đổi backend/API/auth/routing/logic nếu task chỉ yêu cầu UI.
- Không hardcode secret; thêm env phải qua `env.validation.ts` + `.env.example` + `docs/ENVIRONMENT_VARIABLES.md`.
- Feature premium/B2B/contextual/greeting/payment/AI/storage-nặng phải đứng sau feature flag / plan gate / admin setting khi chưa verify đầy đủ.
- Public-facing route/content phải có SEO/GEO policy rõ: canonical, robots/index/noindex, sitemap eligibility, structured data, Open Graph, i18n metadata, privacy guard và không expose private/unlisted/admin/auth/signed-media data.
- Không revert thay đổi không do mình tạo.
- Chạy verification: `pnpm format:check`, `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build` (+ smoke test khi đổi runtime).
- Cập nhật `docs/DEVELOPMENT_LOG.md`, `docs/CHANGELOG.md`, `docs/ROADMAP.md`, và `docs/HUONG_DAN_SU_DUNG.md` (tiếng Việt) khi hành vi người dùng đổi.
- Commit theo Conventional Commits; chỉ commit/push khi được yêu cầu trong prompt.

## 3. Bàn Giao Sau Mỗi Prompt (BẮT BUỘC)

Sau khi thực hiện xong một file prompt (hoặc dừng lại do còn việc), agent PHẢI:

### 3.1 Ghi việc người dùng cần làm → `viec-can-lam/`

Tạo/cập nhật file nhỏ trong `viec-can-lam/` cho từng việc CHỈ người dùng làm được hoặc CHƯA làm, ví dụ:

- Cấu hình cần con người: credentials (SMTP, Google/Facebook OAuth, R2/S3, MoMo), DNS/domain, bật dịch vụ trả phí, secrets trên Vercel/Render/VPS.
- QA thủ công cần môi trường thật: chụp màn hình responsive, smoke test trình duyệt, kiểm thử trên DB thật.
- Quyết định sản phẩm còn chờ ("Needs Confirmation").
- Bất kỳ acceptance item nào CHƯA hoàn thành và lý do.

Chọn đúng thư mục theo mức độ:

- `viec-can-lam/00_khan_cap/`: việc gấp, bảo mật, blocker release/prompt kế tiếp.
- `viec-can-lam/01_uu_tien/`: việc nên làm sớm sau deploy hoặc trước release QA.
- `viec-can-lam/02_co_the_doi/`: việc có thể tách prompt sau.
- `viec-can-lam/03_quyet_dinh_san_pham/`: quyết định đang chờ hoặc quyết định đã chốt.
- `viec-can-lam/99_da_xu_ly/`: việc đã xong, giữ để tham chiếu và tránh làm lại.

Ghi rõ trạng thái mỗi mục: `[ ] chưa làm` / `[x] đã làm` / `[~] đang chờ người dùng`.

Mỗi file task PHẢI dùng cấu trúc trong `viec-can-lam/_TEMPLATE.md` và có hướng dẫn thực hiện chi tiết, không chỉ ghi tên việc. Hướng dẫn tối thiểu gồm:

- Người thực hiện cần chuẩn bị gì: tài khoản, credential, dịch vụ trả phí, domain/DNS, file/env liên quan, hoặc quyết định sản phẩm cần chốt.
- Các bước làm cụ thể theo thứ tự, đủ để người dùng không phải hỏi lại agent.
- Vị trí cấu hình/kiểm tra: file `.env`, Vercel/Render/Neon/Cloudflare/MoMo/SMTP dashboard, URL app, trang admin/dashboard, hoặc command cần chạy nếu có.
- Cách xác nhận hoàn tất: dấu hiệu pass, màn hình/API cần smoke test, log cần xem, hoặc kết quả mong đợi.
- Link tới docs trong repo nếu có, ví dụ `docs/ENVIRONMENT_VARIABLES.md`, `docs/DEPLOYMENT.md`, `docs/HUONG_DAN_SU_DUNG.md`, `docs/SEO_GEO_GUIDELINES.md`.

Sau đó cập nhật `viec-can-lam/README.md` như mục lục ngắn: thêm link tới file task và trạng thái, không dồn runbook dài vào README.

Nếu chưa biết chính xác credential hoặc quyết định sản phẩm, vẫn phải ghi checklist câu hỏi/giá trị cần điền và trạng thái `[~] đang chờ người dùng`.

### 3.2 Chuyển việc khẩn cấp sang prompt kế tiếp

Nếu còn lỗi chưa sửa được hoặc việc phải làm ngay, tạo/cập nhật file trong `viec-can-lam/00_khan_cap/` rồi thêm tóm tắt vào ĐẦU file prompt kế tiếp trong thứ tự `prompts/README.md` (mục `## Carryover Khẩn Cấp Từ Prompt Trước`). Mô tả rõ: lỗi gì, file liên quan, cách tái hiện, mức ưu tiên và link tới task file. Prompt kế tiếp phải xử lý các mục này TRƯỚC. Nếu prompt hiện tại là cuối cùng, ghi vào `viec-can-lam/README.md` mục "Khẩn Cấp" bằng link tới file trong `viec-can-lam/00_khan_cap/`.

### 3.3 Ghi ý tưởng nâng cấp → `y-tuong-nang-cap/`

Thêm các ý tưởng nâng cấp/mở rộng/tính năng mới do agent tự nghĩ ra vào file riêng trong `y-tuong-nang-cap/` (kèm lý do, mức tác động, độ phức tạp ước lượng, phụ thuộc, rủi ro và prompt sau) để làm tiền đề phát triển sau này. Dùng `y-tuong-nang-cap/_TEMPLATE.md`. Không trùng lặp; nếu ý tưởng đã có thì bổ sung/làm rõ file hiện tại thay vì lặp lại. Cập nhật `y-tuong-nang-cap/README.md` khi thêm file mới.

### 3.4 Chỉ xóa file prompt

Chỉ xóa file prompt đang chạy khi đã: hoàn thành 100% acceptance + verify pass + cập nhật docs + cập nhật các thư mục bàn giao ở trên + commit/push thành công. Còn bất kỳ mục nào chưa xong thì GIỮ file prompt và ghi rõ phần còn lại.

## 4. Khi Người Dùng Nhắc "tôi"/"của tôi"

Hỏi GitLab username trước khi gọi API GitLab và nhớ trong suốt phiên (theo gitlab-workflow).
