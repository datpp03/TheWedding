# [ ] R2 Direct Upload, Signed URL Và Multipart Flow

- Mức độ: Có thể đợi.
- Nguồn: Phase 9/08D storage carryover.
- Owner: Agent sau khi người dùng chốt R2 production.
- Trạng thái: `[ ]` chưa làm.

## Mục Tiêu

Hoàn thiện upload session/direct upload/signed URL/multipart thay vì chỉ API-managed upload, phục vụ file lớn và CDN policy an toàn.

## Chuẩn Bị

- R2 production bucket đã cấu hình.
- Quyết định public/private derivative policy.
- CORS R2 nếu direct upload từ browser.
- Smoke test upload hiện tại đã pass.

## Các Bước Thực Hiện

1. Đọc `docs/STORAGE_STRATEGY.md`.
2. Thiết kế upload session endpoint có permission/tenant guard.
3. Ký URL upload ngắn hạn, không expose secret.
4. Thêm multipart flow cho file lớn nếu cần.
5. Tách original private và derivative public/signed theo policy.
6. Thêm migration/rollback hoặc tool di dời local-to-object nếu cần.
7. Test upload success/failure/cancel/expired URL.
8. Cập nhật docs và release QA checklist.

## Nơi Cấu Hình / Kiểm Tra

- Backend storage module.
- R2 CORS config.
- Dashboard Media.
- R2 bucket object paths.

## Xác Nhận Hoàn Tất

- Browser không nhận secret R2.
- Signed URL hết hạn đúng TTL.
- Upload file lớn không timeout API.
- Private/unlisted media không bị index hoặc public nhầm.

## Docs Liên Quan

- `docs/STORAGE_STRATEGY.md`
- `docs/API_DESIGN.md`
- `docs/SEO_GEO_GUIDELINES.md`
- `docs/TESTING_STRATEGY.md`

## Ghi Chú Cho Prompt Sau

- Nếu 08D triển khai signed URL, cập nhật file này thành `[x]`.
