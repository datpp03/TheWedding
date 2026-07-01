# AI Auto-Highlight Reel

- Nhóm: Trải nghiệm media.
- Trạng thái: Gợi ý.
- Tác động: cao.
- Độ phức tạp: cao.
- Phụ thuộc: AI, ffmpeg, media processing, plan gate.

## Mô Tả

Tự chọn ảnh đẹp và ghép video ngắn highlight reel cho album cưới.

## Giá Trị

- Tạo tính năng premium có giá trị cảm xúc cao.
- Hữu ích cho studio và couple muốn chia sẻ nhanh.

## Gợi Ý Triển Khai

1. Bắt đầu với rule-based selection trước AI nếu cần.
2. Thêm job async và queue status.
3. Gate theo plan/add-on.
4. Export MP4/WebM với watermark nếu gói yêu cầu.

## Rủi Ro / Lưu Ý

- Chi phí compute/AI cao.
- Cần consent nếu dùng nhận diện khuôn mặt hoặc metadata nhạy cảm.

## Prompt Sau

- Chỉ làm sau khi media pipeline và billing/gate ổn định.
