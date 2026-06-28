# Ý Tưởng Nâng Cấp / Mở Rộng / Tính Năng Mới

> File này do agent (Codex) bổ sung sau mỗi prompt: các ý tưởng nâng cấp, mở rộng hoặc tính năng mới agent TỰ NGHĨ RA, làm tiền đề phát triển sau này. Mỗi ý tưởng ghi: tên, mô tả ngắn, lý do/giá trị, mức tác động, độ phức tạp ước lượng, phụ thuộc. Không trùng lặp — nếu đã có thì bổ sung/làm rõ.
>
> Đây là backlog gợi ý, KHÔNG phải cam kết. Người dùng quyết định ý tưởng nào đưa vào roadmap.

## Khách Mời & Tương Tác

- **RSVP & quản lý khách mời**: form xác nhận tham dự, danh sách khách, lời nhắn. Giá trị cao cho cô dâu/chú rể. Tác động: cao · Phức tạp: trung bình · Phụ thuộc: auth/tenant.
- **Guest photo upload có kiểm duyệt**: khách tải ảnh lên album chung, owner duyệt trước khi public. Tác động: cao · Phức tạp: trung bình · Phụ thuộc: media + moderation.
- **QR code & thiệp mời điện tử**: sinh QR/thiệp dẫn tới site cưới, kèm e-card i18n. Tác động: trung bình · Phức tạp: thấp.
- **Sổ lưu bút (guestbook) realtime**: mở rộng từ wish, hiển thị dạng dòng thời gian/tường. Tác động: trung bình · Phức tạp: thấp-trung bình.

## Trải Nghiệm Media

- **Tải ảnh hàng loạt dạng ZIP**: cho phép tải cả album (nếu allow-download) qua job nén async. Tác động: cao · Phức tạp: trung bình · Phụ thuộc: queue/storage.
- **Slideshow/“live wall” trình chiếu tại tiệc**: chế độ toàn màn hình tự động chạy ảnh mới. Tác động: trung bình · Phức tạp: thấp.
- **Tách private originals và public derivatives trên R2/CDN**: giữ original trong private prefix/bucket, còn thumbnail/gallery WebP có public custom domain/CDN riêng. Giá trị: public gallery nhanh hơn, không lộ original, dễ kiểm soát SEO/GEO media. Tác động: cao · Phức tạp: trung bình · Phụ thuộc: R2 adapter, media processing, custom domain/CDN policy.
- **AI auto-highlight reel**: tự chọn ảnh đẹp + ghép video ngắn. Tác động: cao · Phức tạp: cao · Phụ thuộc: AI/ffmpeg, Phase 9.
- **Nhóm khuôn mặt (opt-in, có đồng ý)**: gom ảnh theo người để khách tìm ảnh của mình. Tác động: cao · Phức tạp: cao · Lưu ý: quyền riêng tư.
- **BlurHash/LQIP + PWA offline gallery**: cải thiện cảm nhận tốc độ và xem offline. Tác động: trung bình · Phức tạp: trung bình.

## Sản Phẩm & Doanh Thu

- **Album hết hạn / lịch publish**: hẹn giờ công khai hoặc tự ẩn sau ngày X (gói trả phí). Tác động: trung bình · Phức tạp: thấp.
- **Watermark gallery theo gói**: đóng dấu bản optimized cho B2B/studio. Tác động: trung bình · Phức tạp: trung bình · Phụ thuộc: media processing.
- **Trang social share card (OG image động)**: tạo ảnh chia sẻ đẹp theo theme khi share link. Tác động: trung bình · Phức tạp: trung bình.
- **Entitlement timeline/audit diff UI**: màn admin xem lịch sử cấp/thu hồi quyền theo user/tenant, so sánh plan hiện tại với quyền override. Giá trị: giảm nhầm lẫn khi support khách trả phí. Tác động: trung bình · Phức tạp: thấp-trung bình · Phụ thuộc: Phase 9 entitlement foundation.
- **Plan simulator trước khi mua**: cho couple/studio kéo thả số ảnh, video, dung lượng dự kiến để app gợi ý gói phù hợp. Giá trị: tăng conversion và giảm chọn sai gói. Tác động: trung bình · Phức tạp: trung bình · Phụ thuộc: shared scale catalog.
- **Custom domain health monitor**: job định kỳ kiểm tra DNS/CNAME/TXT và cảnh báo admin/user khi domain lỗi. Giá trị: giảm downtime cho khách premium. Tác động: trung bình · Phức tạp: trung bình · Phụ thuộc: custom domain verification.

- **Quota forecast va canh bao nang cap goi**: dung usage/limit Phase 9 de du bao khi tenant sap het dung luong, so anh hoac so video; hien canh bao som trong dashboard va goi y goi/add-on phu hop. Gia tri: giam upload failure bat ngo va tang conversion nang cap. Tac dong: trung binh-cao · Phuc tap: trung binh · Phu thuoc: scale upload policy, notification/email, payment checkout sau nay.

## Vận Hành & Chất Lượng

- **i18n key completeness CI check**: script tự fail khi thiếu key ở vi/en/ja. Tác động: trung bình · Phức tạp: thấp.
- **E2E test thật với Postgres + browser (Playwright)**: phủ auth/media/admin critical flows. Tác động: cao · Phức tạp: trung bình.
- **Observability**: tích hợp log/metric/trace (vd Datadog) cho API/queue/storage. Tác động: cao · Phức tạp: trung bình.
