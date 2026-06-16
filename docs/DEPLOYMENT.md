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
- Use Cloudflare R2 through the S3-compatible storage adapter as the first production object-storage target. Keep original media private and generate signed URLs for protected access.
- Put CDN in front of public optimized media only.
- Keep original media private by default.
- Document the R2 registration/setup flow when the R2 adapter is implemented: create Cloudflare account, enable R2, create bucket, generate least-privilege credentials, configure env vars, configure CORS for direct uploads if used, and run upload/optimized-display smoke tests.
- Configure backup/restore and retention policy before launch.
- See `docs/STORAGE_STRATEGY.md` for the storage rollout plan, mobile upload model, CDN direction, and provider boundary.
- See `docs/guides/CI_CD_DOCKER_VPS.md` before enabling automated production deploys.
- See `docs/guides/HUONG_DAN_DI_DOI_HOST_DATABASE_STORAGE.md` before moving VPS/host, database, or media storage.
