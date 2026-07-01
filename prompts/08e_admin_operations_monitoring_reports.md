# Prompt 08E: Admin Operations, Monitoring, And Reports

PLEASE IMPLEMENT THIS PROMPT.

IMPORTANT PROMPT LIFECYCLE: Chi xoa file prompt nay sau khi hoan thanh tat ca muc trong prompt, pass verification, cap nhat docs, commit va push thanh cong. Neu con bat ky hang muc nao chua xong, giu nguyen file prompt va ghi ro phan con lai.

TRUOC KHI BAT DAU: Doc `AGENTS.md` va `docs/SYSTEM_MAP.md` de biet cau truc thu muc, file lien quan, va quy tac ban giao (tiet kiem token, khong quet lai toan repo). Neu muc `## Carryover Khan Cap Tu Prompt Truoc` ben duoi co noi dung, xu ly cac muc do TRUOC.

Taste Skill Frontend Rule: Khi task cham frontend/UI/layout/component/form/dashboard/admin/public page/redesign/accessibility/responsive QA, doc `docs/ai/taste-skill-integration.md` va `.cursor/rules/taste-skill-frontend.mdc` truoc khi code; audit man hinh hien tai va giu nguyen API/props/state/permission/routing/business logic neu task chi la UI.

## Carryover Khan Cap Tu Prompt Truoc

(Trong. Prompt truoc se chen loi chua sua / viec phai lam ngay vao day.)

Ban dang lam trong repo `D:\AJT\TheWedding`. Hay hoan tat admin/operations gaps: monitoring dashboard, health checks, role editor, audit export, reports, va backup/restore drill.

Truoc khi lam, doc:

- `docs/PRODUCT_PLAN.md`
- `docs/API_DESIGN.md`
- `docs/ROLE_PERMISSION.md`
- `docs/AUTH_SECURITY.md`
- `docs/DEPLOYMENT.md`
- `docs/TROUBLESHOOTING.md`
- `docs/TESTING_STRATEGY.md`
- `docs/SEO_GEO_GUIDELINES.md`
- `docs/REALTIME_WEBHOOK_PLAN.md`
- `docs/HUONG_DAN_SU_DUNG.md`

## Muc Tieu

Admin/support can co cong cu van hanh that su: xem health/metrics, dieu tra audit, xuat report, sua role co permission ro rang, va co quy trinh backup/restore duoc smoke test.

## Tasks

- Health and monitoring:
  - Them health endpoints hoac hoan tat endpoints hien co cho API, DB, storage, Redis/queue, email provider, OAuth provider config, va worker/media processing.
  - Them admin monitoring dashboard hien status, latency/basic metrics, queue depth, recent failures, storage usage, upload errors, auth failures, realtime event outbox/webhook delivery health neu implemented, va runtime system parameters.
  - Runtime status phai khong leak secrets.
  - Neu external monitoring chua co, document manual monitoring va alert thresholds.
- Admin reports:
  - Dashboard/report summaries cho users, tenants, albums, media, storage, uploads, downloads, public discovery, wishes/reactions, failed jobs, auth failures, va payments/entitlements neu implemented.
  - Date range filters, pagination, export CSV/JSON where useful.
  - Reports phai ton trong permissions va tenant isolation.
- Audit explorer/export:
  - Them advanced filters theo actor, entity, event type, date range, requestId, IP/userAgent summary.
  - Export CSV/JSON voi redaction bat buoc.
  - Retention/redaction docs ro rang.
  - Add audit events neu monitoring/admin mutations con thieu.
- Realtime/webhook operations:
  - Neu `08g_realtime_webhook_event_platform.md` da duoc implement, admin monitoring phai hien event outbox depth, failed/dead-letter count, outbound webhook failures, disabled endpoints, inbound webhook signature failures, va last successful dispatch.
  - Them admin-only replay/debug controls neu outbound webhooks da co; tat ca replay phai audit log.
  - Khong expose webhook secrets, signature headers, raw provider payload nhay cam, hoac response bodies co token trong UI/export.
- Role editor:
  - Them richer role/permission editor neu chua co: view roles, assign/revoke permission, compare role permissions, prevent self-lockout.
  - Admin role changes phai yeu cau permission rieng, CSRF, audit log, va safe confirmation.
  - Khong cho user tu xoa quyen admin cuoi cung neu khong co admin khac.
- Operations playbooks:
  - Backup/restore drill cho database va app-managed media.
  - Troubleshooting cho login disabled, upload disabled, queue down, storage unavailable, email/OAuth misconfig, public gallery disabled, va payment checkout disabled.
  - Production readiness checklist cho Render/Vercel/Neon va optional VPS/Docker.
- SEO/GEO operations:
  - Admin/dashboard/report/audit/health routes phai `noindex`, khong vao sitemap, va khong co public structured data.
  - Reports/exports khong duoc tao public URL crawlable; download/export URL phai auth/permission-check va khong expose qua metadata.
  - Monitoring phai co check robots.txt/sitemap/canonical health cho public site neu implemented.
  - Audit/report metadata khong duoc dua vao SEO/GEO, Open Graph, AI-facing summaries, hoac public cache.

## UX

- Admin UI phai quiet, dense, scan-friendly, khong marketing-heavy.
- Dung tables, filters, tabs, status chips, menus, icon buttons, va compact cards dung luc.
- Monitoring states phai co healthy/degraded/down/unknown, last checked, va next action.
- Report/export actions phai co loading/success/error feedback.
- Tat ca copy moi phai dung i18n/l10n keys, co `vi`, `en`, `ja`.

## Tests

- Backend tests cho health endpoints khong leak secrets va report permissions.
- Backend tests cho audit filter/export redaction.
- Backend tests cho realtime/webhook monitoring khong leak secrets neu implemented.
- Backend tests cho role editor guardrails: permission required, self-lockout prevention, last-admin prevention, audit logs.
- Web tests/smoke cho monitoring dashboard, audit export, role editor, va reports responsive states.
- SEO/GEO smoke cho admin/report/health/export routes: noindex/no sitemap/no public structured data, va public robots/sitemap health neu co monitor.
- Backup/restore drill command/docs checked where safe.
- Run verification phu hop: `pnpm format:check`, `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`.

## Docs

- Update `docs/API_DESIGN.md`, `docs/ROLE_PERMISSION.md`, `docs/AUTH_SECURITY.md`, `docs/DEPLOYMENT.md`, `docs/TROUBLESHOOTING.md`, `docs/TESTING_STRATEGY.md`, `docs/SEO_GEO_GUIDELINES.md` neu thay doi admin/noindex/robots monitoring policy, `docs/REALTIME_WEBHOOK_PLAN.md` neu them/sua event ops/webhook monitoring, `docs/ROADMAP.md`, `docs/CHANGELOG.md`, `docs/DEVELOPMENT_LOG.md`.
- Update `docs/HUONG_DAN_SU_DUNG.md` bang tieng Viet cho admin monitoring, audit export, role editor, reports, va operations troubleshooting.
- Neu monitoring provider ngoai chua duoc cau hinh, docs phai noi ro manual fallback va feature flags.

## Ban Giao Sau Prompt (Bat Buoc)

Theo `AGENTS.md` muc 3, sau khi hoan tat (hoac dung do con viec):

- Tao/cap nhat task file trong `viec-can-lam/` cho viec nguoi dung can lam (credentials/config/QA thu cong/quyet dinh san pham), acceptance chua xong va ly do. Dung `viec-can-lam/_TEMPLATE.md`, dat vao dung muc do, roi cap nhat `viec-can-lam/README.md` nhu muc luc link/trang thai. Moi task file phai co huong dan chi tiet de nguoi dung tu lam duoc: can chuan bi gi, cac buoc thuc hien, file/env/dashboard/URL lien quan, cach smoke test/xac nhan pass, va docs lien quan.
- Neu con loi chua sua hoac viec phai lam ngay, tao/cap nhat file trong `viec-can-lam/00_khan_cap/`, roi chen tom tat + link vao muc `## Carryover Khan Cap Tu Prompt Truoc` o DAU prompt ke tiep (theo thu tu `prompts/README.md`); neu day la prompt cuoi, ghi link vao muc "Khan Cap" cua `viec-can-lam/README.md`.
- Tao/cap nhat file y tuong trong `y-tuong-nang-cap/` bang `y-tuong-nang-cap/_TEMPLATE.md`, roi cap nhat `y-tuong-nang-cap/README.md`.
- Cap nhat `docs/SYSTEM_MAP.md` neu cau truc thu muc/module/route/doc thay doi.

## Acceptance Criteria

- Admin co dashboard theo doi health/queue/storage/auth/upload/runtime settings.
- Admin co the theo doi event outbox/webhook delivery health neu realtime platform da duoc implement.
- Audit explorer/export co filters va redaction pass.
- Reports co date range/pagination/export cho cac operational metrics chinh.
- Role editor co guardrails chong self-lockout/last-admin removal va co audit logs.
- Backup/restore va troubleshooting docs du de van hanh production co ban.
- Admin/operations/reporting routes noindex/no sitemap/no public structured data; monitoring co the phat hien robots/sitemap/canonical loi neu implemented.
- UI responsive, accessible, i18n-complete cho `vi`, `en`, `ja`.
- `viec-can-lam/`, `viec-can-lam/README.md` va `y-tuong-nang-cap/README.md` da duoc cap nhat; moi task file trong `viec-can-lam/` co huong dan thuc hien chi tiet; viec khan cap (neu co) da chuyen sang prompt ke tiep hoac `viec-can-lam/00_khan_cap/`.
- Commit va push len `origin/main`.
