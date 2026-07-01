# [ ] Smoke Test /admin/scale Với Tài Khoản Admin Thật

- Mức độ: Có thể đợi.
- Nguồn: Phase 9 plan-aware upload gates handoff.
- Owner: Người dùng.
- Trạng thái: `[ ]` chưa làm.

## Mục Tiêu

Kiểm tra `/admin/scale` với dữ liệu thật, responsive và form cấp entitlement.

## Chuẩn Bị

- App web/API đang chạy.
- Tài khoản admin có `admin.access`.
- Browser desktop/mobile emulator.
- Dữ liệu tenant/user test.

## Các Bước Thực Hiện

1. Mở `/admin/scale` ở width 320, 360, 390, 414, 768, 1024 và desktop.
2. Kiểm tra metric cards.
3. Kiểm tra plan cards và add-on cards.
4. Kiểm tra feature gate list.
5. Kiểm tra entitlement form.
6. Thử label dài ở tiếng Việt/English/Japanese nếu locale switch đã bật.
7. Submit form entitlement hợp lệ.
8. Submit form thiếu `subjectId` để xem loading/error/success.

## Nơi Cấu Hình / Kiểm Tra

- `http://localhost:3000/admin/scale` hoặc production URL.
- DevTools responsive mode.
- API logs.

## Xác Nhận Hoàn Tất

- Không có horizontal overflow.
- Text không overlap.
- Nút/form không vỡ layout.
- Card hierarchy rõ.
- Accent rose/teal/amber hiển thị đúng.

## Docs Liên Quan

- `docs/UI_UX_DESIGN.md`
- `docs/PRODUCT_PLAN.md`
- `docs/TESTING_STRATEGY.md`

## Ghi Chú Cho Prompt Sau

- Nếu UI vỡ, đưa breakpoint và screenshot vào prompt UI QA.
