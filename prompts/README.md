# Project Completion Prompts

Thu muc nay chua cac prompt ban co the gui lan luot cho Codex de hoan thanh du an The Wedding.

## Cach Dung

1. Mo file prompt theo thu tu.
2. Copy toan bo noi dung trong file.
3. Gui cho Codex trong workspace `D:\AJT\TheWedding`.
4. Sau moi phase, doi Codex chay test, cap nhat docs, commit va push.
5. Chi sang prompt tiep theo khi prompt truoc da pass verification.
6. Khi mot prompt da hoan thanh 100% acceptance criteria, Codex phai xoa file prompt do khoi thu muc `prompts/` trong cung commit hoan thanh phase.

## Thu Tu Khuyen Nghi

Trang thai hien tai: app da co duong deploy free bang Vercel + Render + Neon. VPS/Docker pipeline la tuy chon sau, khong con la buoc chan truoc cac phase tinh nang.

1. `05_phase_6_admin_dashboard.md`: Admin dashboard, system parameters, settings, users, tenants, media, audit logs.
2. `06_phase_7_media_processing.md`: Queue, thumbnails, optimized media versions, processing status.
3. `07_phase_8_hardening.md`: Security, monitoring, backup, QA, i18n/l10n coverage.
4. `08_phase_9_scale_features.md`: Payment, CDN, Cloudflare R2/S3 adapter, custom domain model, AI, analytics, user handles.
5. `09_final_release_qa.md`: Full release QA va cleanup.
6. `10_phase_10_cicd_docker_vps.md`: Tuy chon neu muon chuyen sang VPS/Docker hoac can self-host thay cho Vercel/Render.

Cloudflare R2 khong bat truoc khi `08_phase_9_scale_features.md` implement xong adapter S3/R2, signed URL/upload-session flow, docs, tests, va smoke test. Truoc do production tiep tuc de `STORAGE_PROVIDER=local` de tranh cau hinh nua voi.

## Nguyen Tac Chung Cho Moi Prompt

- Doc docs hien co truoc khi sua code.
- Ton trong kien truc Clean Architecture backend va App Router frontend.
- Giao dien phai theo `docs/UI_UX_DESIGN.md`: tre trung, nang dong, Gen Z-friendly, UX muot, responsive moi kich thuoc.
- Neu them/sua text hien thi tren UI, phai dung i18n/l10n key trong file ngon ngu, khong hard-code text truc tiep trong component/application code. Ngon ngu muc tieu ban dau: `vi`, `en`, `ja`.
- Khong revert thay doi khong do minh tao.
- Chay verification phu hop: format, lint, typecheck, test, build, smoke test.
- Cap nhat `docs/DEVELOPMENT_LOG.md`, `docs/CHANGELOG.md`, `docs/ROADMAP.md`.
- Cap nhat `docs/HUONG_DAN_SU_DUNG.md` bang tieng Viet neu phase them/sua bat ky hanh vi, route, tai khoan test, quyen, workflow, hoac gioi han nao ma nguoi dung/QA can biet.
- Commit va push sau khi hoan thanh.
- Chi duoc xoa file prompt dang chay sau khi hoan thanh tat ca muc trong prompt, pass verification, cap nhat docs, commit/push thanh cong. Neu con bat ky hang muc nao chua xong, giu nguyen prompt va ghi ro ly do/chua xong trong final summary.
