# Deployment

## Local

```bash
pnpm install
docker compose up -d sqlserver redis
pnpm dev
```

For the current verified Windows local setup, SQL Server is installed on the machine instead of Docker. The API connects to database `TheWedding` through `DATABASE_URL` in the gitignored `.env` file.

## Build

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

## Services

- `api`: NestJS application.
- `web`: Next.js application.
- `sqlserver`: Microsoft SQL Server.
- `redis`: queue/session-support service for future media processing.

## Production Notes

- Use managed SQL Server or hardened container orchestration.
- Use S3-compatible storage with private buckets.
- Put CDN in front of public optimized media only.
- Keep original media private by default.
- Configure backup/restore and retention policy before launch.
