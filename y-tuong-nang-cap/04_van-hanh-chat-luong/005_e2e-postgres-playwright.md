# E2E Test Thật Với Postgres + Browser

- Nhóm: Vận hành & chất lượng.
- Trạng thái: Gợi ý.
- Tác động: cao.
- Độ phức tạp: trung bình.
- Phụ thuộc: test DB, Playwright, seed data, CI.

## Mô Tả

Phủ các critical flows auth/media/admin bằng E2E chạy với Postgres thật và browser.

## Giá Trị

- Bắt regression giữa API/Web/DB mà unit test không thấy.
- Tăng tự tin trước release.

## Gợi Ý Triển Khai

1. Tạo test DB isolated.
2. Seed account/tenant/album/media tối thiểu.
3. Viết flow login/dashboard/upload/public album/admin.
4. Chạy trong CI hoặc local command rõ.

## Rủi Ro / Lưu Ý

- E2E dễ flaky nếu seed/cleanup không chặt.
- Cần không dùng credential production.

## Prompt Sau

- Phù hợp final release QA hardening.
