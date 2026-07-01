# Observability Cho API/Queue/Storage

- Nhóm: Vận hành & chất lượng.
- Trạng thái: Gợi ý.
- Tác động: cao.
- Độ phức tạp: trung bình.
- Phụ thuộc: logging, metrics, tracing, deployment provider.

## Mô Tả

Tích hợp log/metric/trace cho API, queue và storage.

## Giá Trị

- Debug production nhanh hơn.
- Theo dõi upload, processing, auth, webhook và payment tốt hơn.

## Gợi Ý Triển Khai

1. Chuẩn hóa structured logging với correlation id.
2. Thêm metrics cho request latency, queue depth, processing failures.
3. Thêm tracing nếu provider hỗ trợ.
4. Tạo dashboard/alert tối thiểu.

## Rủi Ro / Lưu Ý

- Không log secret/token/PII.
- Chi phí observability có thể tăng.

## Prompt Sau

- Phù hợp admin operations/monitoring prompt.
