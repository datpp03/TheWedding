# [ ] Canonical Public Route /@{userHandle}/{siteSlug}/albums/{albumSlugOrShortId}

- Mức độ: Có thể đợi.
- Nguồn: Phase 9 scale carryover.
- Owner: Agent.
- Trạng thái: `[ ]` chưa làm.

## Mục Tiêu

Expose canonical public route đẹp theo user handle/site slug/album slug và redirect route cũ an toàn.

## Chuẩn Bị

- User handle foundation đã có.
- Album slug migration đã pass.
- SEO/GEO policy cho public routes.
- Dữ liệu test public/unlisted/private.

## Các Bước Thực Hiện

1. Đọc `docs/SEO_GEO_GUIDELINES.md`.
2. Thiết kế canonical route cho public album.
3. Implement lookup handle/site/album với privacy guard.
4. Redirect route cũ `/albums/{albumIdOrSlug}` sang canonical khi eligible.
5. Không redirect private hoặc non-existing album sang URL có thể leak dữ liệu.
6. Cập nhật sitemap eligibility.
7. Cập nhật structured data/Open Graph/canonical metadata.
8. Test public/unlisted/private và old URL compatibility.

## Nơi Cấu Hình / Kiểm Tra

- Next.js public routes.
- API public album endpoints.
- Sitemap/robots metadata.
- Browser route tests.

## Xác Nhận Hoàn Tất

- Public album có canonical đúng.
- Old link không vỡ.
- Private album không expose nội dung hoặc metadata.
- Sitemap chỉ chứa route eligible.

## Docs Liên Quan

- `docs/SEO_GEO_GUIDELINES.md`
- `docs/API_DESIGN.md`
- `docs/ROADMAP.md`
- `docs/HUONG_DAN_SU_DUNG.md`

## Ghi Chú Cho Prompt Sau

- Xử lý sau khi `01_uu_tien/005_album-slug-migration-smoke.md` pass.
