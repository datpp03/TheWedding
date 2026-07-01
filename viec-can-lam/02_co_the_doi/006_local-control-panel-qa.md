# [ ] QA Thủ Công Local Control Panel Bằng Double-Click Trên Windows

- Mức độ: Có thể đợi.
- Nguồn: local control panel handoff.
- Owner: Người dùng.
- Trạng thái: `[ ]` chưa làm.

## Mục Tiêu

Xác nhận `RUN_LOCAL_CONTROL.cmd` mở được control panel local trên Windows và quản lý API/Web/logs ổn định.

## Chuẩn Bị

- Windows desktop có PowerShell.
- Node.js/pnpm đã cài.
- Repo đã `pnpm install`.
- `.env` local hợp lệ.
- Database/Redis local nếu muốn chạy full API.

## Các Bước Thực Hiện

1. Double-click `RUN_LOCAL_CONTROL.cmd` ở thư mục gốc repo.
2. Chọn `3` để start cả API + Web.
3. Chọn `7` để xem trạng thái.
4. Xác nhận có `api RUNNING` và `web RUNNING`.
5. Chọn `11` để health check local URLs.
6. Chọn `8` hoặc `9` để xem log.
7. Nếu có lỗi, chọn `10` để lọc lỗi/cảnh báo.
8. Chọn `6` để stop all trước khi đóng terminal.

## Nơi Cấu Hình / Kiểm Tra

- Terminal control panel.
- `.local-control/logs/api.log`.
- `.local-control/logs/web.log`.
- `http://localhost:3000`.
- `http://localhost:4000/api/v1`.

## Xác Nhận Hoàn Tất

- API/Web chạy được.
- Log đọc được.
- Stop all không để lại process `next dev` hoặc `nest start --watch`.

## Docs Liên Quan

- `scripts/README.md`
- `docs/HUONG_DAN_SU_DUNG.md`
- `docs/TROUBLESHOOTING.md`

## Ghi Chú Cho Prompt Sau

- Nếu fail trên Windows, ghi lỗi PowerShell và path log vào prompt tooling/local-control kế tiếp.
