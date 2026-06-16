# Troubleshooting

## Node or pnpm Not Found

Install Node.js 22 LTS, then enable pnpm:

```bash
corepack enable
corepack prepare pnpm@10.12.1 --activate
```

## PostgreSQL Container Fails to Start

- Ensure Docker Desktop is running.
- Check port `5432` is free.
- If local data is disposable, remove the `postgres-data` Docker volume and start again.

## API Cannot Connect to Database

- Confirm `DATABASE_URL`.
- Confirm PostgreSQL container health with `docker compose ps`.
- For Neon, ensure the URL includes `sslmode=require` and `DATABASE_SSL=true`.
- Run migrations after dependencies are installed.

## CORS Errors

- Add the frontend origin to `CORS_ORIGINS`.
- Keep production origins explicit; do not use `*` with credentials.

## Auth Cookie Issues

- In local HTTP development, secure cookies may need environment-specific config.
- In production, cookies must be Secure and SameSite-protected.

## Media Processing Issues

- Uploaded media stays queued: confirm the API is running, `REDIS_URL` points to a reachable Redis instance in production, and the BullMQ worker logs do not show connection errors.
- Media fails processing: open the owner media dashboard or admin media dashboard and inspect `processingFailureReason`. Use retry after fixing the root cause.
- No thumbnail or optimized image appears: confirm the original exists in storage, Sharp is installed, and the derivative keys under `tenants/{tenantId}/media/{mediaId}/versions/` were written.
- Public gallery does not show a just-uploaded item: this is expected while status is queued or processing. Public galleries only use optimized derivatives by default so original files stay private.
- Video preview is metadata-only in this phase. Add ffmpeg to the worker image before expecting extracted preview frames.

## CI/CD Docker VPS Issues

See `docs/guides/CI_CD_DOCKER_VPS.md` for the full setup.

- Registry login fails: confirm Docker Hub/GHCR username, token, package permissions, and that the VPS can run `docker login`.
- GitHub Actions cannot push image: confirm workflow permissions include `packages: write` for GHCR or Docker Hub secrets are present for Docker Hub.
- SSH deploy fails: confirm `VPS_HOST`, `VPS_USER`, `VPS_SSH_KEY`, firewall rules, and that the deploy user can run Docker commands.
- VPS pulls old image: confirm `.env.production` uses the expected `IMAGE_TAG`, then run `docker compose --env-file .env.production -f docker-compose.prod.yml pull`.
- Container restarts but app is down: check `docker compose --env-file .env.production -f docker-compose.prod.yml logs --tail=100 api` and `web`, then verify `.env.production`.
- Rollback needed: pin `IMAGE_TAG` to a previous commit SHA and run `docker compose --env-file .env.production -f docker-compose.prod.yml pull` followed by `docker compose --env-file .env.production -f docker-compose.prod.yml up -d`.
