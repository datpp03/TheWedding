# SEO/GEO Release Smoke Tự Động Trong CI

- Nhóm: Vận hành & chất lượng.
- Trạng thái: Gợi ý.
- Tác động: trung bình.
- Độ phức tạp: trung bình.
- Phụ thuộc: Next.js build, public test fixtures, SEO/GEO policy, CI browser/HTTP tooling.

## Mô Tả

Thêm một job CI hoặc script release smoke để build web app, chạy server tạm, gọi `/`, `/robots.txt`, `/sitemap.xml`, public site mẫu và public album mẫu, rồi kiểm tra canonical, robots/noindex, Open Graph, JSON-LD và sitemap filtering.

## Giá Trị

- Giảm nguy cơ deploy public route thiếu canonical/robots hoặc vô tình đưa route private/unlisted vào sitemap.
- Hữu ích cho admin/support trước release vì SEO/GEO lỗi thường chỉ được phát hiện sau deploy.
- Bảo vệ policy privacy-first khi các route public handle/custom-domain được thêm sau này.

## Gợi Ý Triển Khai

1. Tạo script `scripts/seo-geo-smoke` hoặc web test suite chạy sau `pnpm build`.
2. Dùng fixture API/mock hoặc staging seed để có một album `public`, một album `unlisted`, và một album `private`.
3. Kiểm tra `/robots.txt` disallow app/private/API paths, sitemap chỉ có public/indexable URL, public album có JSON-LD khớp visible content, route auth/admin/dashboard noindex.
4. Cập nhật `docs/TESTING_STRATEGY.md`, `docs/SEO_GEO_GUIDELINES.md`, và CI workflow.

## Rủi Ro / Lưu Ý

- Không được query DB trực tiếp để sinh fixture nếu bỏ qua permission/privacy filter.
- Nếu dùng staging thật, cần tránh đưa dữ liệu cá nhân vào snapshot/log CI.
- Custom domain và locale route sau này cần test riêng để tránh canonical duplicate.

## Prompt Sau

- Có thể đưa vào prompt hardening/CI sau Prompt 10 hoặc một prompt riêng về SEO/GEO automation.
