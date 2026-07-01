# Project Completion Prompts

Thu muc nay chua cac prompt ban co the gui lan luot cho Codex de hoan thanh du an The Wedding.

## Cach Dung

1. Mo file prompt theo thu tu.
2. Copy toan bo noi dung trong file.
3. Gui cho Codex trong workspace `D:\AJT\TheWedding`.
4. Sau moi phase, doi Codex chay test, cap nhat docs, commit va push.
5. Chi sang prompt tiep theo khi prompt truoc da pass verification.
6. Khi mot prompt da hoan thanh 100% acceptance criteria, Codex phai xoa file prompt do khoi thu muc `prompts/` sau khi phase da duoc verify, commit va push thanh cong.

## Bat Dau & Ban Giao [NEW]

Truoc khi chay bat ky prompt nao, Codex phai doc `AGENTS.md` (role/quy tac) va `docs/SYSTEM_MAP.md` (so do tong quan: thu muc nao chua gi, file nao lam gi, code moi dat o dau, docs nao phai cap nhat) de lam dung vi tri va tiet kiem token.

Moi prompt deu co:

- Muc `## Carryover Khan Cap Tu Prompt Truoc` o dau: neu co noi dung, xu ly TRUOC. Prompt truoc se chen loi chua sua / viec phai lam ngay vao day.
- Muc `## Ban Giao Sau Prompt (Bat Buoc)` truoc Acceptance Criteria.

Sau khi chay xong (hoac dung do con viec), Codex phai:

1. Cap nhat `viec-can-lam/` bang file rieng cho tung viec NGUOI DUNG can lam (credentials, config, dich vu tra phi, QA thu cong, quyet dinh san pham) va acceptance chua hoan thanh. Dung `viec-can-lam/_TEMPLATE.md`, dat file vao dung muc do (`00_khan_cap`, `01_uu_tien`, `02_co_the_doi`, `03_quyet_dinh_san_pham`, `99_da_xu_ly`), roi them link/trang thai vao `viec-can-lam/README.md` nhu muc luc ngan.
2. Neu con loi/viec khan cap, tao/cap nhat file trong `viec-can-lam/00_khan_cap/` va chen tom tat + link task vao `## Carryover Khan Cap Tu Prompt Truoc` o dau prompt KE TIEP theo thu tu khuyen nghi ben duoi; neu da la prompt cuoi thi ghi link vao muc "Khan Cap" cua `viec-can-lam/README.md`.
3. Ghi y tuong nang cap/mo rong tu nghi ra vao file rieng trong `y-tuong-nang-cap/` bang `y-tuong-nang-cap/_TEMPLATE.md`, roi cap nhat `y-tuong-nang-cap/README.md`.
4. Cap nhat `docs/SYSTEM_MAP.md` neu cau truc thay doi.

## Product Plan Bat Buoc [NEW]

Truoc moi phase tinh nang, Codex phai doc:

- `docs/PRODUCT_PLAN.md`
- `docs/PROJECT_OVERVIEW.md`
- `docs/ROADMAP.md`
- `docs/UI_UX_DESIGN.md`
- `docs/ai/taste-skill-integration.md` khi prompt cham frontend, UI, layout, component, form, dashboard, admin, public page, redesign, accessibility hoac responsive QA.
- `docs/SEO_GEO_GUIDELINES.md` khi prompt chạm public route, metadata, sitemap, robots, custom domain, public discovery, media delivery, marketing/help content, release QA hoặc prompt rules.

Moi feature moi phai duoc map vao:

- Business model: B2C SaaS, B2B studio, add-on/value-added service, admin/internal, hoac future placeholder.
- Workflow: couple, guest, studio/photographer, admin/support.
- Gate: free/paid plan, subscription, entitlement, feature flag, system parameter, hoac admin-only.
- UI/UX: emotion cua man hinh, first-look hierarchy, accent color, spacing, card hierarchy, responsive behavior, va day du states.
- SEO/GEO: index/noindex policy, canonical URL, sitemap eligibility, robots.txt, structured data, Open Graph/Twitter metadata, i18n/hreflang metadata, AI crawler policy, performance, va privacy boundary.
- Docs/tests: roadmap, changelog, development log, user guide neu hanh vi nguoi dung thay doi, va test phu hop.

Khong code UI moi truoc khi da co design gate: phan tich cam xuc man hinh, de xuat layout/mau/spacing/animation/states, va ghi ro signoff truoc implementation. Neu khong co mockup rieng, ghi signoff ngan trong final summary hoac development log.

Khi task lien quan den frontend, UI, layout, component, form, dashboard hoac page design, bat buoc tham chieu Taste Skill Frontend Rule (`docs/ai/taste-skill-integration.md` va `.cursor/rules/taste-skill-frontend.mdc`) truoc khi code.

## Thu Tu Khuyen Nghi

Trang thai hien tai: Phase 6 admin dashboard, Phase 7 media processing, Phase 7A public album/social expansion, va Phase 8 enterprise hardening da hoan thanh. App da co duong deploy free bang Vercel + Render + Neon. VPS/Docker pipeline la tuy chon sau, khong con la buoc chan truoc cac phase tinh nang.

Bo prompt `08A` den `08G` tach cac phan dang do tu nhieu phase truoc de de implement va verify tung lat nho truoc khi vao Phase 9 scale lon:

1. `08a_auth_email_mfa_oauth_completion.md`: SMTP/email production, login regression, MFA/TOTP, Google/Facebook OAuth callback exchange va account linking.
2. `08b_public_discovery_moderation_audit_completion.md`: Featured curation, owner opt-in, wish moderation, search metadata consent, pagination/sort, audit filters/export.
3. `08c_i18n_accessibility_ui_qa_completion.md`: App-wide i18n/l10n, locale selector/persistence, accessibility, responsive screenshot QA.
4. `08d_media_security_delivery_completion.md`: Malware scanning, video preview extraction, signed URLs, R2/S3 adapter, upload sessions, CDN docs, local-to-object migration.
5. `08e_admin_operations_monitoring_reports.md`: Monitoring dashboard, health checks, role editor, audit export, operational reports, backup/restore drill.
6. `08f_public_site_visual_redesign_ui_qa.md`: Redesign public wedding site UI, fix responsive/empty/error states, apply SEO/GEO/privacy gate cho public route.
7. `08g_realtime_webhook_event_platform.md`: Event backbone, transactional outbox, SSE realtime, inbound provider webhooks, outbound signed webhooks, privacy-safe channels.
8. `08_phase_9_scale_features.md`: Payment/plans, B2C/B2B SaaS, entitlements, custom domains, user handles, analytics, AI, watermark, theme automation, greeting automation. Neu cac phan storage/media/realtime da xong trong `08d`/`08g`, chi verify compatibility va khong implement trung lap.
9. `09_final_release_qa.md`: Full release QA va cleanup.
10. `10_phase_10_cicd_docker_vps.md`: Tuy chon neu muon chuyen sang VPS/Docker hoac can self-host thay cho Vercel/Render.

Cloudflare R2 adapter da duoc tich hop cho API-managed uploads qua `StorageService`. Chi bat `STORAGE_PROVIDER=r2` tren production sau khi tao bucket/access key, cau hinh env host, redeploy va smoke test theo `docs/guides/CLOUDFLARE_R2_SETUP.md`. Signed URL/upload-session flow, direct upload, multipart upload, migration tooling va CDN hardening van la follow-up, khong duoc xem la production-ready trong final QA.

## Nguyen Tac Chung Cho Moi Prompt

- Doc docs hien co truoc khi sua code.
- Doc `docs/PRODUCT_PLAN.md` truoc khi them/sua feature lien quan den business model, workflow, UI/UX, theme, studio/B2B, payment, AI, automation, hoac premium gates. [NEW]
- Ton trong kien truc Clean Architecture backend va App Router frontend.
- Giao dien phai theo `docs/UI_UX_DESIGN.md`: tre trung, nang dong, Gen Z-friendly, UX muot, responsive moi kich thuoc.
- Khi task cham frontend/UI/layout/component/form/dashboard/page design/redesign, doc `docs/ai/taste-skill-integration.md` va `.cursor/rules/taste-skill-frontend.mdc` truoc khi code; audit man hinh hien tai va giu nguyen API/props/state/permission/routing/business logic neu task chi la UI. [NEW]
- UI moi phai co diem nhan mau ro rang, spacing hop ly, card hierarchy ro, va khong duoc chi dung trang/xam don dieu. [NEW]
- Trang dau vao website la public home/featured albums khi feature discovery duoc trien khai; khong dua user vao login truoc khi ho co nhu cau dang nhap. [NEW]
- Wish/reaction/search nang cao phai ton trong privacy public/unlisted/private va yeu cau login dung cho tung flow. [NEW]
- Public route/content/metadata phai theo `docs/SEO_GEO_GUIDELINES.md`: canonical, robots/noindex, sitemap, structured data, Open Graph, i18n metadata, AI crawler policy, performance va khong leak private/unlisted/admin/auth/signed-media data. [NEW]
- Realtime/webhook work phai theo `docs/REALTIME_WEBHOOK_PLAN.md`: event envelope, outbox, channel authorization, signature verification, idempotency, retry/dead-letter, va privacy-safe payloads. [NEW]
- Cac feature Custom Theme ca nhan, Admin Theme Control, Dynamic Contextual Theme, Automated Greetings, B2B studio subscription, va value-added services phai ship theo feature flag/plan gate/admin setting khi chua duoc verify day du. [NEW]
- Neu them/sua text hien thi tren UI, phai dung i18n/l10n key trong file ngon ngu, khong hard-code text truc tiep trong component/application code. Ngon ngu muc tieu ban dau: `vi`, `en`, `ja`.
- Khong revert thay doi khong do minh tao.
- Chay verification phu hop: format, lint, typecheck, test, build, smoke test.
- Cap nhat `docs/DEVELOPMENT_LOG.md`, `docs/CHANGELOG.md`, `docs/ROADMAP.md`.
- Cap nhat `docs/HUONG_DAN_SU_DUNG.md` bang tieng Viet neu phase them/sua bat ky hanh vi, route, tai khoan test, quyen, workflow, hoac gioi han nao ma nguoi dung/QA can biet.
- Cap nhat `docs/SEO_GEO_GUIDELINES.md` hoac tham chieu no trong docs/prompt neu thay doi SEO/GEO policy, public route, custom domain, sitemap, robots, metadata, structured data, AI crawler policy hoac privacy indexing.
- Khi ghi viec can lam, khong ghi task ngan chung chung. Tao file task rieng trong `viec-can-lam/` co mini-runbook bang tieng Viet: muc tieu, prerequisites/credentials, cac buoc thao tac, noi can cau hinh/kiem tra, expected result, docs lien quan, va ghi chu cho prompt sau. `viec-can-lam/README.md` chi giu link/trang thai.
- Khi ghi y tuong nang cap, tao/cap nhat file rieng trong `y-tuong-nang-cap/` co gia tri, tac dong, do phuc tap, phu thuoc, rui ro/luu y va prompt sau. `y-tuong-nang-cap/README.md` chi giu muc luc.
- Commit va push sau khi hoan thanh.
- Chi duoc xoa file prompt dang chay sau khi hoan thanh tat ca muc trong prompt, pass verification, cap nhat docs, commit/push thanh cong. Neu con bat ky hang muc nao chua xong, giu nguyen prompt va ghi ro ly do/chua xong trong final summary.
