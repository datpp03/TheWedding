# [~] Chạy Migration Trên DB Sạch Và Smoke Test API/Web

- Mức độ: Có thể đợi, bắt buộc trước release-ready.
- Nguồn: release QA handoff và Prompt 09.
- Owner: Người dùng hoặc agent nếu có DB test.
- Trạng thái: `[~]` đang chờ DB sạch/staging hoặc Docker/PostgreSQL local.

## Mục Tiêu

Xác nhận toàn bộ migration chạy được trên DB sạch và app API/Web smoke test pass trước khi coi là release-ready.

## Chuẩn Bị

- Database sạch/staging.
- Quyền chạy migration.
- Env API/Web hợp lệ.
- Account test sau seed hoặc tạo mới.
- Docker Desktop hoặc PostgreSQL local/staging có thể kết nối được. Trong Prompt 09, `docker` không có trong PATH nên agent không chạy được migration clean/local an toàn.

## Các Bước Thực Hiện

1. Backup DB nếu dùng staging có dữ liệu quan trọng.
2. Tạo DB sạch hoặc reset staging theo quy trình an toàn.
3. Chạy migration từ đầu đến cuối bằng `pnpm.cmd --filter @the-wedding/api migration:run`.
4. Chạy seed roles/permissions nếu cần bằng `pnpm.cmd --filter @the-wedding/api seed:roles`.
5. Start API/Web.
6. Smoke test register/login/dashboard.
7. Smoke test public home/public album nếu có data.
8. Smoke test upload nếu storage đã cấu hình.
9. Ghi lại migration nào fail nếu có.

## Nơi Cấu Hình / Kiểm Tra

- Database migration logs.
- API logs.
- Web app.
- `.env` / host env: `DATABASE_URL`, `DATABASE_SSL`, `NODE_ENV`.
- `docs/DEPLOYMENT.md` workflow.

## Xác Nhận Hoàn Tất

- Migration pass từ DB sạch.
- API/Web boot thành công.
- Auth/public/media smoke không fail do schema thiếu.

## Docs Liên Quan

- `docs/DATABASE_DESIGN.md`
- `docs/DEPLOYMENT.md`
- `docs/TESTING_STRATEGY.md`

## Ghi Chú Cho Prompt Sau

- Nếu migration fail, ghi tên migration, SQL error và DB version vào carryover.
