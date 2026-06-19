# Deployment

## Local

```bash
pnpm install
docker compose up -d postgres redis
pnpm dev
```

The local setup uses PostgreSQL through Docker Compose. Production database hosting is currently targeted at Neon PostgreSQL Free for the low-cost MVP path.

## Build

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

## CI/CD Docker VPS Plan

Production deployment should follow the documented Docker VPS flow:

```txt
GitHub Actions build Docker image
        ->
Push image to Docker Hub or GHCR
        ->
VPS pull new image
        ->
Restart container
```

The repo includes `.github/workflows/deploy-docker-vps.yml`, `docker-compose.prod.yml`, and `docker/production.env.example` for this early deployment path. See [CI/CD Docker VPS guide](guides/CI_CD_DOCKER_VPS.md) for the setup steps, GitHub Secrets, registry options, VPS commands, verification, and rollback.

## Services

- `api`: NestJS application.
- `web`: Next.js application.
- `postgres`: PostgreSQL for local development.
- `redis`: BullMQ queue backend for media processing jobs.

## Media Processing Deployment

- Set `REDIS_URL` to enable BullMQ-backed media processing workers.
- Set `MEDIA_PROCESSING_CONCURRENCY` to tune worker throughput; start with `2` on small instances.
- If `REDIS_URL` is omitted in local development, the API uses an inline async processor so uploads can still move from queued to ready for smoke testing.
- Production should run Redis and keep original media private. Only optimized derivatives should be exposed to normal gallery/lightbox display.
- Video preview extraction is metadata-only until the production worker image includes ffmpeg or another approved media extraction backend.

## Production Notes

- Use managed PostgreSQL for production; Neon is the current free-tier target for early usage.
- Before public launch, verify SEO/GEO deployment basics from `docs/SEO_GEO_GUIDELINES.md`: HTTPS canonical domain, redirects between default/custom domains, `robots.txt`, `sitemap.xml`, noindex for auth/admin/dashboard/private routes, Open Graph image reachability, and cache rules that do not expose private/API/signed-media responses.
- Use Cloudflare R2 through the S3-compatible storage adapter as the first production object-storage target after the adapter is implemented and verified. Keep original media private and generate signed URLs for protected access.
- Put CDN in front of public optimized media only.
- Keep original media private by default.
- R2 setup checklist for the owner when the adapter is ready:
  1. Create or sign in to a Cloudflare account.
  2. Enable R2 and create a private bucket for production media.
  3. Generate least-privilege R2 access keys for object read/write in that bucket.
  4. Set `STORAGE_PROVIDER=r2`, `S3_ENDPOINT`, `S3_REGION=auto`, `S3_BUCKET`, `S3_ACCESS_KEY`, `S3_SECRET_KEY`, `STORAGE_PUBLIC_BASE_URL`, and `STORAGE_SIGNED_URL_TTL_SECONDS` in the API environment.
  5. Configure CORS on the bucket only if direct browser/mobile upload sessions are exposed.
  6. Run upload, processing, optimized-display, signed-download, and rollback smoke tests before switching production traffic.
- Configure backup/restore and retention policy before launch.
- See `docs/STORAGE_STRATEGY.md` for the storage rollout plan, mobile upload model, CDN direction, and provider boundary.
- See `docs/guides/CI_CD_DOCKER_VPS.md` before enabling automated production deploys.
- See `docs/guides/HUONG_DAN_DI_DOI_HOST_DATABASE_STORAGE.md` before moving VPS/host, database, or media storage.

## Backup And Restore

### PostgreSQL / Neon

- Take an on-demand logical backup before releases that include migrations: `pg_dump --format=custom --no-owner --no-acl "$DATABASE_URL" > backup.dump`.
- Keep at least daily production backups and a 7-day retention window for the MVP stage; increase retention before paid plans launch.
- Test restore into a staging database with `pg_restore --clean --if-exists --no-owner --no-acl --dbname "$STAGING_DATABASE_URL" backup.dump`.
- Run migrations against staging after restore, then smoke test auth, tenant dashboard, media listing, upload, public gallery, and admin audit logs.
- Never restore production data into a developer laptop without a documented privacy reason and redaction plan.

### App-Managed Media Storage

- Local/Render filesystem storage must be backed up with the database because media rows point to backend-generated storage keys.
- Back up `LOCAL_STORAGE_PATH` as a versioned archive before deployments and before host moves.
- Restore order: database first, media archive second, then run a smoke check that thumbnails/optimized versions referenced by `media_versions` exist.
- For future R2/S3 storage, enable bucket versioning or lifecycle-retained object backups, keep originals private, and verify restore with both optimized public display and permission-checked original download.
