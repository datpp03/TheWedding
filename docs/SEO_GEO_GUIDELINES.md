# SEO/GEO Guidelines

> Mục tiêu: mọi thay đổi public-facing của The Wedding phải giúp search engines và AI answer engines hiểu đúng nội dung công khai, đồng thời không làm lộ album riêng tư, album chỉ có link, dữ liệu cá nhân, token, storage key, hoặc nội dung chưa được owner đồng ý public.

Trong tài liệu này:

- **SEO** = Search Engine Optimization cho Google/Bing/search engines truyền thống.
- **GEO** = Generative Engine Optimization, tức tối ưu để AI search/answer engines hiểu, tóm tắt và trích dẫn đúng nội dung công khai. Nếu một feature dùng dữ liệu địa lý/location, vẫn phải tuân thủ phần privacy/location bên dưới.

## Nguyên Tắc Bắt Buộc

1. **Privacy trước SEO/GEO**: chỉ index nội dung `public` và được owner opt-in khi có lựa chọn. `private`, `unlisted/link-only`, dashboard, admin, auth callback, payment callback, signed URL, original/private media phải không xuất hiện trong sitemap, search results hoặc AI-facing structured content.
2. **Canonical rõ ràng**: mỗi public site/album/media landing page phải có canonical URL ổn định. Khi có user handle, URL canonical dùng dạng `/@{userHandle}/{siteSlug}/albums/{albumSlugOrShortId}`; route cũ redirect hoặc trỏ canonical về route mới.
3. **Không keyword stuffing**: copy phải tự nhiên, hữu ích, đúng ngữ cảnh cưới/studio. Không nhồi từ khóa, hidden text, doorway page, cloaking hoặc structured data không khớp nội dung nhìn thấy.
4. **Structured data trung thực**: JSON-LD/schema.org chỉ dùng cho dữ liệu hiển thị hoặc owner-approved. Không markup wish/reaction/venue/person nếu owner chưa cho phép public.
5. **I18n-aware**: public route có metadata theo locale, `hreflang` khi có locale route, và fallback rõ ràng. Title/description phải fit tiếng Việt, English, Japanese.
6. **Media-first nhưng crawlable**: ảnh/video cần `alt`, caption/title an toàn, width/height ổn định, optimized URLs, lazy loading hợp lý, Open Graph image rõ ràng, và không expose raw object keys.
7. **AI crawler policy có chủ đích**: robots.txt phải định nghĩa chính sách cho Googlebot/Bingbot và AI crawlers như `OAI-SearchBot`/`GPTBot` theo quyết định sản phẩm. Nếu chưa chốt, allow public marketing/discovery pages và disallow private/app/API/signed paths.
8. **Performance là SEO/GEO input**: public pages phải giữ Core Web Vitals tốt bằng optimized images, stable layout, cache/CDN cho derivatives public, và không block first render bởi effects/contextual themes.
9. **Audit được quyết định index**: khi admin/owner bật featured, public discovery, custom domain hoặc public metadata, cần audit log nếu dữ liệu đó ảnh hưởng khả năng được index/discover.
10. **Realtime/webhook không phải feed public mặc định**: SSE/WebSocket/debug/webhook routes phải noindex và không vào sitemap; chỉ public-safe album events mới được hiển thị trên public page đã indexable.

## Checklist Cho Mỗi Public Route

- Route có index policy: `index` hoặc `noindex` được ghi rõ.
- Có canonical URL tuyệt đối và tránh duplicate giữa slug cũ, handle mới, custom domain và default domain.
- Có title, description, Open Graph/Twitter metadata, và image fallback.
- Có structured data phù hợp:
  - Public home: `WebSite`, `Organization` nếu brand-level.
  - Public wedding site: `WebSite` hoặc `Event` khi owner cho phép public tên/ngày/địa điểm.
  - Public album: `ImageGallery`/`CreativeWork`/`CollectionPage` khi album public.
  - Studio public profile sau này: `LocalBusiness` hoặc `ProfessionalService` chỉ khi studio opt-in.
- Có robots controls phù hợp: `noindex,nofollow` cho auth/admin/dashboard/private routes; `max-image-preview:large` cho public gallery nếu owner cho phép preview ảnh.
- Sitemap chỉ include public/indexable canonical URLs.
- Không include private/unlisted album trong public home, sitemap, structured data, search endpoint, AI summary hoặc feed.
- Không include private/unlisted/admin/payment/signed-media/provider payload trong realtime public streams hoặc webhook debug pages.
- Có alt text/caption an toàn; nếu user-generated caption thiếu, fallback mô tả generic không suy đoán nhạy cảm.
- Có smoke test metadata bằng view-source/build output hoặc test helper.

## Checklist Cho GEO/AI Discoverability

- Public content có câu trả lời rõ cho: đây là site/album gì, của ai/đơn vị nào, thời gian/ngữ cảnh gì, người xem có thể làm gì tiếp.
- Entity facts ổn định: brand name, site name, couple/studio name, public handle, custom domain, social image, contact/support nếu public.
- Structured data không mâu thuẫn với visible content.
- Nội dung quan trọng render được server-side hoặc có HTML fallback; không để AI/search bot chỉ thấy skeleton rỗng.
- Nếu tạo FAQ/help/guide public, dùng heading rõ, câu trả lời ngắn, tránh nội dung trùng lặp nhiều page.
- Không đưa dữ liệu cá nhân nhạy cảm, ảnh private, signed URL, provider secret, token, email nội bộ, audit metadata, hoặc dashboard data vào AI-facing copy/schema.

## Local/Location SEO Khi Có Địa Điểm

- Venue/location/region chỉ được public nếu owner/studio opt-in.
- Không suy luận tuổi, địa điểm, quan hệ gia đình hoặc thông tin nhạy cảm từ ảnh/EXIF để đưa vào SEO/GEO.
- EXIF/location metadata từ media phải được strip hoặc không expose mặc định; chỉ dùng field owner nhập và đồng ý public.
- Studio/B2B profile có thể dùng địa chỉ/khu vực phục vụ khi studio xác nhận, có quyền chỉnh sửa và có noindex fallback khi chưa verify.

## Robots, Sitemap Và AI Crawlers

- `robots.txt` không thay thế authorization. Private data phải bị chặn bằng auth/permission, không chỉ dựa vào robots.
- Default đề xuất:
  - Allow: public home, public site, public album canonical, public guide/marketing pages.
  - Disallow: `/api/`, `/admin`, `/dashboard`, `/login`, `/register`, `/forgot-password`, `/reset-password`, `/verify-email`, MFA challenge/enrollment/account settings routes, OAuth callback/linking/error callback routes, payment callback, realtime/SSE/WebSocket endpoints, webhook endpoints/debug pages, signed media, private storage paths.
  - AI crawlers: cấu hình rõ `OAI-SearchBot` và `GPTBot`; nếu chưa có quyết định pháp lý/sản phẩm, chỉ allow public/indexable pages và disallow app/private/API paths.
- Sitemap phải tạo từ dữ liệu public/indexable đã được permission-check, không query thẳng toàn bộ album.

## Auth/OAuth/MFA Noindex Policy

- App Router route groups `(auth)`, `(dashboard)`, and `(admin)` are private/noindex surfaces. Login, register, forgot-password, reset-password, verify-email, MFA challenge, OAuth linking/account settings, dashboard, and admin pages must not be included in sitemap.
- OAuth callback URLs live on the API and redirect back to the app after exchange. They must never render authorization `code`, signed `state`, provider errors, MFA challenge tokens, reset tokens, verification tokens, cookies, or provider payloads in title, description, Open Graph, structured data, visible copy, logs, or analytics.
- Public home remains indexable/public discovery. When a signed-in session is restored on public home, the UI may show signed-in navigation only; it must not render private tenant/admin data into indexable HTML.

## Verification Bắt Buộc

- Unit/integration tests cho function tạo canonical URL, robots policy, sitemap filtering, structured data builder.
- Tests privacy: private/unlisted/admin/auth/payment/signed URLs không xuất hiện trong sitemap hoặc metadata indexable.
- Tests privacy: realtime/webhook routes are noindex/no sitemap, and public event streams do not expose private/unlisted/admin/payment/signed-media data.
- Build/smoke check cho metadata của public home, public site, public album, custom domain nếu implemented.
- Lighthouse hoặc browser smoke cho Core Web Vitals quan trọng khi route public thay đổi.
- Manual QA sau deploy: Google/Bing URL inspection nếu có quyền, kiểm tra robots.txt, sitemap.xml, canonical, Open Graph preview.

## Prompt 09 Release Status

Implemented:

- `apps/web/src/app/robots.ts` renders `robots.txt` with public root allowed and API/auth/dashboard/admin/payment/realtime/webhook/storage/raw-media paths disallowed.
- `apps/web/src/app/sitemap.ts` renders `sitemap.xml` with the public root and public featured album URLs only when the public-home API is reachable.
- Public home, public site, and public album routes define canonical/Open Graph metadata.
- Public album route emits `ImageGallery` JSON-LD only for `public` albums.
- Public site and album metadata returns noindex for unavailable, password-gated, or non-public-indexable states.

Remaining follow-up:

- Canonical handle route `/@{userHandle}/{siteSlug}/albums/{albumSlugOrShortId}` and redirect/canonical migration.
- Full sitemap source for all owner-approved public sites/albums, beyond the current featured public album feed.
- Locale route/hreflang implementation if the product later adds locale-prefixed public URLs.
- Production Open Graph image QA with real public-safe images and custom domains.

## Nguồn Tham Chiếu Chính Thức

- Google Search Central SEO Starter Guide: https://developers.google.com/search/docs/fundamentals/seo-starter-guide
- Google structured data introduction: https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data
- Google robots meta tag docs: https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag
- Google AI features and your website: https://developers.google.com/search/docs/appearance/ai-features
- Bing Webmaster Guidelines: https://www.bing.com/webmasters/help/webmaster-guidelines-30fba23a
- OpenAI crawler documentation: https://developers.openai.com/api/docs/bots
