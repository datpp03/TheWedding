# Quota Forecast Và Cảnh Báo Nâng Cấp Gói

- Nhóm: Sản phẩm & doanh thu.
- Trạng thái: Gợi ý.
- Tác động: trung bình-cao.
- Độ phức tạp: trung bình.
- Phụ thuộc: scale upload policy, notification/email, payment checkout sau này.

## Mô Tả

Dùng usage/limit Phase 9 để dự báo khi tenant sắp hết dung lượng, số ảnh hoặc số video.

## Giá Trị

- Giảm upload failure bất ngờ.
- Tăng conversion nâng cấp gói/add-on.

## Gợi Ý Triển Khai

1. Tính usage percentage và forecast đơn giản.
2. Hiển thị cảnh báo sớm trong dashboard.
3. Gửi email/admin notification khi vượt ngưỡng.
4. Gợi ý gói/add-on phù hợp.

## Rủi Ro / Lưu Ý

- Không spam email.
- Gợi ý nâng cấp cần tôn trọng trạng thái payment chưa production-ready.

## Prompt Sau

- Làm sau khi plan/entitlement QA pass.
