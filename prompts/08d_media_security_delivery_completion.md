# Prompt 08D: Media Security And Delivery Completion

PLEASE IMPLEMENT THIS PROMPT.

IMPORTANT PROMPT LIFECYCLE: Chi xoa file prompt nay sau khi hoan thanh tat ca muc trong prompt, pass verification, cap nhat docs, commit va push thanh cong. Neu con bat ky hang muc nao chua xong, giu nguyen file prompt va ghi ro phan con lai.

TRUOC KHI BAT DAU: Doc `AGENTS.md` va `docs/SYSTEM_MAP.md` de biet cau truc thu muc, file lien quan, va quy tac ban giao (tiet kiem token, khong quet lai toan repo). Neu muc `## Carryover Khan Cap Tu Prompt Truoc` ben duoi co noi dung, xu ly cac muc do TRUOC.

Taste Skill Frontend Rule: Khi task cham frontend/UI/layout/component/form/dashboard/admin/public page/redesign/accessibility/responsive QA, doc `docs/ai/taste-skill-integration.md` va `.cursor/rules/taste-skill-frontend.mdc` truoc khi code; audit man hinh hien tai va giu nguyen API/props/state/permission/routing/business logic neu task chi la UI.

## Carryover Khan Cap Tu Prompt Truoc

(Trong. Prompt truoc se chen loi chua sua / viec phai lam ngay vao day.)

Ban dang lam trong repo `D:\AJT\TheWedding`. Hay hoan tat media security va delivery readiness: malware scanning, video preview extraction, signed URLs, object storage/R2 adapter, upload sessions, CDN docs, va migration path.

Truoc khi lam, doc:

- `docs/STORAGE_STRATEGY.md`
- `docs/API_DESIGN.md`
- `docs/AUTH_SECURITY.md`
- `docs/ENVIRONMENT_VARIABLES.md`
- `docs/DEPLOYMENT.md`
- `docs/TROUBLESHOOTING.md`
- `docs/TESTING_STRATEGY.md`
- `docs/SEO_GEO_GUIDELINES.md`
- `docs/REALTIME_WEBHOOK_PLAN.md`
- `docs/HUONG_DAN_SU_DUNG.md`

## Muc Tieu

Media pipeline phai du san sang cho production scale: upload duoc scan, video co preview tot hon metadata-only khi worker support, private media duoc serve qua signed URLs, va Cloudflare R2/S3-compatible storage co du adapter/test/docs truoc khi enable production.

## Tasks

- Storage adapter readiness:
  - Implement hoac hoan tat S3-compatible storage adapter voi Cloudflare R2 la provider dau tien.
  - Giu `STORAGE_PROVIDER=local` la default; app khong crash khi R2 env chua cau hinh.
  - Them env validation ro rang cho R2/S3 endpoint, bucket, region/account, access key, secret, public CDN base URL neu dung.
  - Preserve `StorageService` boundary va khong leak raw object keys/credentials trong API response.
  - Viet migration/guide cho local media -> object storage neu local media da ton tai.
- Signed URLs and delivery:
  - Signed download URLs cho original/private media voi TTL ngan, target default 900 seconds.
  - Public optimized derivatives co the dung CDN/public URL neu album/media privacy cho phep.
  - Private/unlisted/protected flows khong dung public original URLs.
  - Tests cho TTL, permissions, privacy boundaries, va URL generation.
- Direct/resumable upload sessions:
  - API tao upload session cho web va future React Native.
  - Signed PUT cho file nho; multipart/resumable session cho video lon neu scope phu hop.
  - Upload session phai reserve quota/validate MIME/extension/size truoc khi client upload.
  - Completion endpoint phai verify object exists, size/type expected, scan/processing status, va tenant ownership.
  - Web upload UI hien progress/retry/cancel neu flow duoc expose.
- Malware scanning:
  - Them scanner adapter, mac dinh disabled/local no-op, va ClamAV hoac provider tuong duong khi cau hinh.
  - Uploaded media vao `pending_scan`/`quarantined`/`rejected`/`ready` statuses theo pattern hien co.
  - Positive scan khong duoc public/download/process; ghi audit event va safe error.
  - Scanner timeout/error policy ro rang: fail closed cho public-facing production, configurable cho local dev.
- Video preview extraction:
  - Neu ffmpeg hoac equivalent co san, extract thumbnail/short preview/metadata.
  - Neu khong co ffmpeg, fallback metadata-only khong crash.
  - Worker image/docs phai noi ro cach enable ffmpeg.
  - UI phai hien video preview/placeholder/states ro rang.
- Realtime media events:
  - Neu `08g_realtime_webhook_event_platform.md` da duoc implement, media upload/scan/processing phai publish events theo shared event envelope.
  - Owner dashboard co the nhan `media.upload.accepted`, `media.processing.started`, `media.processing.completed`, `media.processing.failed`, `media.scan.quarantined`, va `media.scan.rejected` de cap nhat khong can refresh.
  - Public gallery chi nhan event media-ready public-safe cho public album/media; khong phat raw object key, original URL, signed URL, EXIF/location, hoac private/unlisted data.
- CDN/cache:
  - Document CDN behavior cho optimized public derivatives.
  - Cache invalidation/versioning cho replaced media/derivatives.
  - Khong cache private originals cong khai.
- SEO/GEO media delivery:
  - Public optimized derivatives co stable, cacheable URL khi album/media public va owner cho phep preview; private originals/signed URLs/raw object keys khong indexable.
  - Anh public can alt/caption/title fallback an toan, khong suy luan thong tin nhay cam tu EXIF/AI.
  - EXIF/location metadata phai stripped hoac khong expose mac dinh; chi expose field owner opt-in.
  - Open Graph image phai dung derivative public an toan, khong dung signed URL ngan han.
  - Media sitemap/structured data neu implemented chi include public/indexable media derivatives.

## UX

- Owner upload UI phai hien progress, queued/scan/processing/ready/failed/rejected states ro.
- Guest gallery phai uu tien optimized media va placeholder dep khi preview chua san sang.
- Error copy phai than thien, khong lo storage bucket/object key/provider secret.
- Tat ca copy moi phai dung i18n/l10n keys, co `vi`, `en`, `ja`.

## Tests

- Unit/integration tests cho local storage, R2/S3 adapter mocked, signed URL permissions/TTL, object key safety.
- Tests cho upload session quota/MIME/extension/size/ownership/completion.
- Tests cho malware scanner disabled/success/positive/timeout/error policies.
- Tests cho video preview fallback khi ffmpeg missing va extraction success khi tool available/mocked.
- Tests cho media realtime event payload/redaction/privacy neu event platform da co.
- Web tests/smoke cho upload progress va media cards states neu UI thay doi.
- SEO/GEO tests/smoke cho public derivative URL, Open Graph image fallback, signed/private URL noindex/no sitemap, va EXIF/location privacy.
- Run verification phu hop: `pnpm format:check`, `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`.

## Docs

- Update `docs/STORAGE_STRATEGY.md`, `docs/API_DESIGN.md`, `docs/AUTH_SECURITY.md`, `docs/ENVIRONMENT_VARIABLES.md`, `docs/DEPLOYMENT.md`, `docs/TROUBLESHOOTING.md`, `docs/TESTING_STRATEGY.md`, `docs/SEO_GEO_GUIDELINES.md` neu thay doi media index/CDN/metadata policy, `docs/REALTIME_WEBHOOK_PLAN.md` neu them/sua media events, `docs/ROADMAP.md`, `docs/CHANGELOG.md`, `docs/DEVELOPMENT_LOG.md`.
- Them huong dan tieng Viet trong `docs/HUONG_DAN_SU_DUNG.md` cho upload progress, loi scan/rejected, video preview, va gioi han storage.
- Them guide Cloudflare/R2: dang ky Cloudflare, tao R2 bucket, tao access key least-privilege, cau hinh CORS neu direct upload, env vars, smoke test, rollback ve local, va cach khong bat billing/R2 truoc khi adapter pass.

## Ban Giao Sau Prompt (Bat Buoc)

Theo `AGENTS.md` muc 3, sau khi hoan tat (hoac dung do con viec):

- Tao/cap nhat task file trong `viec-can-lam/` cho viec nguoi dung can lam (credentials/config/QA thu cong/quyet dinh san pham), acceptance chua xong va ly do. Dung `viec-can-lam/_TEMPLATE.md`, dat vao dung muc do, roi cap nhat `viec-can-lam/README.md` nhu muc luc link/trang thai. Moi task file phai co huong dan chi tiet de nguoi dung tu lam duoc: can chuan bi gi, cac buoc thuc hien, file/env/dashboard/URL lien quan, cach smoke test/xac nhan pass, va docs lien quan.
- Neu con loi chua sua hoac viec phai lam ngay, tao/cap nhat file trong `viec-can-lam/00_khan_cap/`, roi chen tom tat + link vao muc `## Carryover Khan Cap Tu Prompt Truoc` o DAU prompt ke tiep (theo thu tu `prompts/README.md`); neu day la prompt cuoi, ghi link vao muc "Khan Cap" cua `viec-can-lam/README.md`.
- Tao/cap nhat file y tuong trong `y-tuong-nang-cap/` bang `y-tuong-nang-cap/_TEMPLATE.md`, roi cap nhat `y-tuong-nang-cap/README.md`.
- Cap nhat `docs/SYSTEM_MAP.md` neu cau truc thu muc/module/route/doc thay doi.

## Acceptance Criteria

- Local storage van chay nhu mac dinh va khong can R2 credentials.
- R2/S3 adapter co tests, docs, env validation, smoke path, va rollback guidance.
- Signed URLs duoc permission-check va TTL-limited cho private/original media.
- Upload session/direct upload khong bypass quota, MIME/extension validation, scan, processing, hoac tenant ownership.
- Malware scanner adapter co fail-safe policy va positive scan block delivery.
- Video preview co extraction path khi available va fallback an toan khi unavailable.
- Production docs noi ro chi set `STORAGE_PROVIDER=r2` sau khi adapter/smoke tests pass.
- Public media SEO/GEO khong expose private originals, signed URLs, raw object keys, EXIF/location nhay cam, hoac unlisted/private media.
- Media realtime events, neu implemented, cap nhat owner UI an toan va khong expose private originals/raw storage/signed URLs.
- `viec-can-lam/`, `viec-can-lam/README.md` va `y-tuong-nang-cap/README.md` da duoc cap nhat; moi task file trong `viec-can-lam/` co huong dan thuc hien chi tiet; viec khan cap (neu co) da chuyen sang prompt ke tiep hoac `viec-can-lam/00_khan_cap/`.
- Commit va push len `origin/main`.
