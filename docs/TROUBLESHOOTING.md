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
- If a mutation fails with `Invalid CSRF token`, request `GET /api/v1/auth/csrf`, keep the returned cookie, and send the same value in the `x-csrf-token` header.
- If a response includes `x-correlation-id`, copy that value into bug reports so API logs and client reports can be matched.
- If login/register/reset returns HTTP 429, wait for the route-level rate-limit window to reset before retrying.

## Media Processing Issues

- Uploaded media stays queued: confirm the API is running, `REDIS_URL` points to a reachable Redis instance in production, and the BullMQ worker logs do not show connection errors.
- Media fails processing: open the owner media dashboard or admin media dashboard and inspect `processingFailureReason`. Use retry after fixing the root cause.
- No thumbnail or optimized image appears: confirm the original exists in storage, Sharp is installed, and the derivative keys under `tenants/{tenantId}/media/{mediaId}/versions/` were written.
- Public gallery does not show a just-uploaded item: this is expected while status is queued or processing. Public galleries only use optimized derivatives by default so original files stay private.
- Video preview is metadata-only in this phase. Add ffmpeg to the worker image before expecting extracted preview frames.
- Media fails after R2 creates `thumb_360.webp`, `gallery_1280.webp`, and `lightbox_2048.webp` with `value too long for type character varying(200)`: deploy the media blur placeholder length guard, then retry processing from the owner media dashboard.
- Image request returns `200 OK` but the browser shows `net::ERR_BLOCKED_BY_RESPONSE.NotSameOrigin`: confirm the media file/download response includes `Cross-Origin-Resource-Policy: cross-origin`, then redeploy the API.
- Upload fails with "File extension does not match MIME type": rename/export the file with the correct extension for its MIME type before retrying.
- Upload fails with "File is empty": retry from the browser file picker instead of replaying a DevTools copied curl/fetch request, because copied multipart requests do not include the real binary file body.
- Upload fails with "Tenant storage quota exceeded": delete unused media, increase `TENANT_STORAGE_QUOTA_BYTES` for the environment, or wait for Phase 9 plan/entitlement quota controls.
- Upload fails with "Media storage is unavailable": confirm `LOCAL_STORAGE_PATH` is writable on the API host, restart/redeploy the API, and inspect server logs with the request id from the error response.
- Upload succeeds but the item stays queued: check `REDIS_URL`; if Redis is not configured, the API should log inline-processing fallback warnings and the owner can retry processing after the root cause is fixed.

## CI/CD Docker VPS Issues

See `docs/guides/CI_CD_DOCKER_VPS.md` for the full setup.

- Registry login fails: confirm Docker Hub/GHCR username, token, package permissions, and that the VPS can run `docker login`.
- GitHub Actions cannot push image: confirm workflow permissions include `packages: write` for GHCR or Docker Hub secrets are present for Docker Hub.
- SSH deploy fails: confirm `VPS_HOST`, `VPS_USER`, `VPS_SSH_KEY`, firewall rules, and that the deploy user can run Docker commands.
- VPS pulls old image: confirm `.env.production` uses the expected `IMAGE_TAG`, then run `docker compose --env-file .env.production -f docker-compose.prod.yml pull`.
- Container restarts but app is down: check `docker compose --env-file .env.production -f docker-compose.prod.yml logs --tail=100 api` and `web`, then verify `.env.production`.
- Rollback needed: pin `IMAGE_TAG` to a previous commit SHA and run `docker compose --env-file .env.production -f docker-compose.prod.yml pull` followed by `docker compose --env-file .env.production -f docker-compose.prod.yml up -d`.
