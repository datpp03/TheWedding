# Local Control Panel Presets Theo Môi Trường

- Nhóm: Vận hành & chất lượng.
- Trạng thái: Gợi ý.
- Tác động: trung bình.
- Độ phức tạp: thấp-trung bình.
- Phụ thuộc: env docs, deployment workflow, scripts/local-control.ps1.

## Mô Tả

Mở rộng local control panel để chọn preset `local`, `staging`, `production-readonly`, tự kiểm tra env bắt buộc và hiện checklist trước migration/seed.

## Giá Trị

- Giảm lỗi vận hành.
- Làm dev/QA trên Windows dễ hơn.

## Gợi Ý Triển Khai

1. Thêm preset config trong script.
2. Validate env bắt buộc theo preset.
3. Chặn migration production nếu không xác nhận rõ.
4. Ghi log rõ ràng.

## Rủi Ro / Lưu Ý

- Tránh command nguy hiểm với production.
- Không in secret ra console/log.

## Prompt Sau

- Làm trong prompt tooling/devops.
