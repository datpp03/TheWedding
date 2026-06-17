# Prompt 08D: Media Security And Delivery Completion

PLEASE IMPLEMENT THIS PROMPT.

IMPORTANT PROMPT LIFECYCLE: Chi xoa file prompt nay sau khi hoan thanh tat ca muc trong prompt, pass verification, cap nhat docs, commit va push thanh cong. Neu con bat ky hang muc nao chua xong, giu nguyen file prompt va ghi ro phan con lai.

Ban dang lam trong repo `D:\AJT\TheWedding`. Hay hoan tat media security va delivery readiness: malware scanning, video preview extraction, signed URLs, object storage/R2 adapter, upload sessions, CDN docs, va migration path.

Truoc khi lam, doc:

- `docs/STORAGE_STRATEGY.md`
- `docs/API_DESIGN.md`
- `docs/AUTH_SECURITY.md`
- `docs/ENVIRONMENT_VARIABLES.md`
- `docs/DEPLOYMENT.md`
- `docs/TROUBLESHOOTING.md`
- `docs/TESTING_STRATEGY.md`
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
- CDN/cache:
  - Document CDN behavior cho optimized public derivatives.
  - Cache invalidation/versioning cho replaced media/derivatives.
  - Khong cache private originals cong khai.

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
- Web tests/smoke cho upload progress va media cards states neu UI thay doi.
- Run verification phu hop: `pnpm format:check`, `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`.

## Docs

- Update `docs/STORAGE_STRATEGY.md`, `docs/API_DESIGN.md`, `docs/AUTH_SECURITY.md`, `docs/ENVIRONMENT_VARIABLES.md`, `docs/DEPLOYMENT.md`, `docs/TROUBLESHOOTING.md`, `docs/TESTING_STRATEGY.md`, `docs/ROADMAP.md`, `docs/CHANGELOG.md`, `docs/DEVELOPMENT_LOG.md`.
- Them huong dan tieng Viet trong `docs/HUONG_DAN_SU_DUNG.md` cho upload progress, loi scan/rejected, video preview, va gioi han storage.
- Them guide Cloudflare/R2: dang ky Cloudflare, tao R2 bucket, tao access key least-privilege, cau hinh CORS neu direct upload, env vars, smoke test, rollback ve local, va cach khong bat billing/R2 truoc khi adapter pass.

## Acceptance Criteria

- Local storage van chay nhu mac dinh va khong can R2 credentials.
- R2/S3 adapter co tests, docs, env validation, smoke path, va rollback guidance.
- Signed URLs duoc permission-check va TTL-limited cho private/original media.
- Upload session/direct upload khong bypass quota, MIME/extension validation, scan, processing, hoac tenant ownership.
- Malware scanner adapter co fail-safe policy va positive scan block delivery.
- Video preview co extraction path khi available va fallback an toan khi unavailable.
- Production docs noi ro chi set `STORAGE_PROVIDER=r2` sau khi adapter/smoke tests pass.
- Commit va push len `origin/main`.
