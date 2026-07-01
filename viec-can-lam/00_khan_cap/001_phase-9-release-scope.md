# [x] Chốt Cách Xử Lý Phase 9 Trước Final Release

- Mức độ: Đã xử lý.
- Nguồn: `viec-can-lam/README.md` mục Khẩn Cấp và Prompt 08 Phase 9.
- Owner: Người dùng đã quyết định, agent đã cập nhật prompt/docs theo quyết định.
- Trạng thái: `[x]` đã làm.

## Mục Tiêu

Quyết định rõ trước khi chạy final release QA: tiếp tục triển khai các phần Phase 9 còn thiếu, hay release với các phần đó là placeholder/gated feature chưa bật production.

Quyết định đã chốt: chọn hướng B, release với Phase 9 ở trạng thái foundation an toàn. Các phần chưa production-ready phải tiếp tục ở dạng placeholder/gated/admin-only hoặc follow-up sau release. Cloudflare R2 đã được tích hợp trong phần mềm cho API-managed upload qua `StorageService`; việc còn lại là cấu hình credential/môi trường thật và smoke test trước khi dựa vào R2 trên production.

## Chuẩn Bị

- Đọc `prompts/09_final_release_qa.md`, nhất là phần carryover đã cập nhật.
- Xem trạng thái Phase 9 trong `docs/ROADMAP.md`, `docs/PRODUCT_PLAN.md`, `docs/HUONG_DAN_SU_DUNG.md`.
- Với R2 production, chuẩn bị riêng Cloudflare bucket/access key/env host và làm theo `docs/guides/CLOUDFLARE_R2_SETUP.md`.

## Các Bước Thực Hiện

1. Khi chạy final QA, coi Phase 9 là foundation release: chỉ kiểm tra các phần đã có, không bắt buộc hoàn thành toàn bộ scale roadmap.
2. Xác nhận các phần chưa xong không bị expose như production-ready: MoMo thật, realtime/webhook, direct upload, multipart upload, canonical handle route, studio workflow, custom-domain DNS verification, watermark, AI, contextual theme và greeting scheduler.
3. Với R2, xác nhận adapter/API-managed upload đã có trong phần mềm; nếu bật production thì phải hoàn tất task cấu hình/smoke test R2 riêng.
4. Nếu phát hiện feature chưa xong nhưng đang mở cho người dùng cuối, tạo task khẩn cấp mới trong `viec-can-lam/00_khan_cap/` và cập nhật Prompt 09 trước khi release.

## Nơi Cấu Hình / Kiểm Tra

- `prompts/09_final_release_qa.md`
- `prompts/README.md`
- `docs/ROADMAP.md`
- `docs/PRODUCT_PLAN.md`
- `docs/HUONG_DAN_SU_DUNG.md`
- `docs/CHANGELOG.md`
- `docs/guides/CLOUDFLARE_R2_SETUP.md`

## Xác Nhận Hoàn Tất

- Prompt 09 có thể chạy release QA với trạng thái Phase 9 rõ ràng.
- Không bật MoMo/R2 direct/custom-domain public khi chưa verify.
- Các feature chưa xong có gate hoặc admin-only guard.
- `docs/ROADMAP.md`, `docs/PRODUCT_PLAN.md`, `docs/HUONG_DAN_SU_DUNG.md`, `docs/CHANGELOG.md`, `prompts/09_final_release_qa.md` và `prompts/README.md` đã ghi rõ quyết định release với gated placeholder.

## Docs Liên Quan

- `docs/ROADMAP.md`
- `docs/PRODUCT_PLAN.md`
- `docs/HUONG_DAN_SU_DUNG.md`
- `docs/STORAGE_STRATEGY.md`
- `docs/ENVIRONMENT_VARIABLES.md`
- `docs/SEO_GEO_GUIDELINES.md`

## Ghi Chú Cho Prompt Sau

- Việc quyết định scope đã xong. Khi chạy Prompt 09, xử lý các mục Phase 9 còn lại như follow-up/gated placeholder, không coi là blocker nếu đã được tắt hoặc ghi rõ giới hạn.
- Task khẩn cấp `viec-can-lam/00_khan_cap/002_rotate-r2-access-key.md` vẫn cần xử lý riêng trước khi dùng R2 production nếu access key từng bị lộ.
