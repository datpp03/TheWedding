# Project Completion Prompts

Thu muc nay chua cac prompt ban co the gui lan luot cho Codex de hoan thanh du an The Wedding.

## Cach Dung

1. Mo file prompt theo thu tu.
2. Copy toan bo noi dung trong file.
3. Gui cho Codex trong workspace `D:\AJT\TheWedding`.
4. Sau moi phase, doi Codex chay test, cap nhat docs, commit va push.
5. Chi sang prompt tiep theo khi prompt truoc da pass verification.
6. Khi mot prompt da hoan thanh 100% acceptance criteria, Codex phai xoa file prompt do khoi thu muc `prompts/` sau khi phase da duoc verify, commit va push thanh cong.

## Product Plan Bat Buoc [NEW]

Truoc moi phase tinh nang, Codex phai doc:

- `docs/PRODUCT_PLAN.md`
- `docs/PROJECT_OVERVIEW.md`
- `docs/ROADMAP.md`
- `docs/UI_UX_DESIGN.md`

Moi feature moi phai duoc map vao:

- Business model: B2C SaaS, B2B studio, add-on/value-added service, admin/internal, hoac future placeholder.
- Workflow: couple, guest, studio/photographer, admin/support.
- Gate: free/paid plan, subscription, entitlement, feature flag, system parameter, hoac admin-only.
- UI/UX: emotion cua man hinh, first-look hierarchy, accent color, spacing, card hierarchy, responsive behavior, va day du states.
- Docs/tests: roadmap, changelog, development log, user guide neu hanh vi nguoi dung thay doi, va test phu hop.

Khong code UI moi truoc khi da co design gate: phan tich cam xuc man hinh, de xuat layout/mau/spacing/animation/states, va ghi ro signoff truoc implementation. Neu khong co mockup rieng, ghi signoff ngan trong final summary hoac development log.

## Thu Tu Khuyen Nghi

Trang thai hien tai: Phase 6 admin dashboard, Phase 7 media processing, Phase 7A public album/social expansion, va Phase 8 enterprise hardening da hoan thanh. App da co duong deploy free bang Vercel + Render + Neon. VPS/Docker pipeline la tuy chon sau, khong con la buoc chan truoc cac phase tinh nang.

1. `08_phase_9_scale_features.md`: Payment, CDN, Cloudflare R2/S3 adapter, custom domain model, AI, analytics, user handles.
2. `09_final_release_qa.md`: Full release QA va cleanup.
3. `10_phase_10_cicd_docker_vps.md`: Tuy chon neu muon chuyen sang VPS/Docker hoac can self-host thay cho Vercel/Render.

Cloudflare R2 khong bat truoc khi `08_phase_9_scale_features.md` implement xong adapter S3/R2, signed URL/upload-session flow, docs, tests, va smoke test. Truoc do production tiep tuc de `STORAGE_PROVIDER=local` de tranh cau hinh nua voi.

## Nguyen Tac Chung Cho Moi Prompt

- Doc docs hien co truoc khi sua code.
- Doc `docs/PRODUCT_PLAN.md` truoc khi them/sua feature lien quan den business model, workflow, UI/UX, theme, studio/B2B, payment, AI, automation, hoac premium gates. [NEW]
- Ton trong kien truc Clean Architecture backend va App Router frontend.
- Giao dien phai theo `docs/UI_UX_DESIGN.md`: tre trung, nang dong, Gen Z-friendly, UX muot, responsive moi kich thuoc.
- UI moi phai co diem nhan mau ro rang, spacing hop ly, card hierarchy ro, va khong duoc chi dung trang/xam don dieu. [NEW]
- Trang dau vao website la public home/featured albums khi feature discovery duoc trien khai; khong dua user vao login truoc khi ho co nhu cau dang nhap. [NEW]
- Wish/reaction/search nang cao phai ton trong privacy public/unlisted/private va yeu cau login dung cho tung flow. [NEW]
- Cac feature Custom Theme ca nhan, Admin Theme Control, Dynamic Contextual Theme, Automated Greetings, B2B studio subscription, va value-added services phai ship theo feature flag/plan gate/admin setting khi chua duoc verify day du. [NEW]
- Neu them/sua text hien thi tren UI, phai dung i18n/l10n key trong file ngon ngu, khong hard-code text truc tiep trong component/application code. Ngon ngu muc tieu ban dau: `vi`, `en`, `ja`.
- Khong revert thay doi khong do minh tao.
- Chay verification phu hop: format, lint, typecheck, test, build, smoke test.
- Cap nhat `docs/DEVELOPMENT_LOG.md`, `docs/CHANGELOG.md`, `docs/ROADMAP.md`.
- Cap nhat `docs/HUONG_DAN_SU_DUNG.md` bang tieng Viet neu phase them/sua bat ky hanh vi, route, tai khoan test, quyen, workflow, hoac gioi han nao ma nguoi dung/QA can biet.
- Commit va push sau khi hoan thanh.
- Chi duoc xoa file prompt dang chay sau khi hoan thanh tat ca muc trong prompt, pass verification, cap nhat docs, commit/push thanh cong. Neu con bat ky hang muc nao chua xong, giu nguyen prompt va ghi ro ly do/chua xong trong final summary.
