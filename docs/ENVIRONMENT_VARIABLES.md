# Environment Variables

Use `.env.example` as the template. Do not commit `.env` files.

## Application

- `NODE_ENV`: `local`, `development`, `staging`, `production`, or `test`.
- `APP_URL`: frontend base URL.
- `API_URL`: backend base URL.
- `NEXT_PUBLIC_APP_URL`: frontend public base URL used by the Next.js app for canonical URLs, `robots.txt`, and `sitemap.xml`. Set this to the deployed web origin, for example `https://thewedding.d-ajt.app`.
- `NEXT_PUBLIC_API_URL`: backend public base URL used by the Next.js app when calling the API.
- `CORS_ORIGINS`: comma-separated allowed origins.

## Database

- `DATABASE_URL`: PostgreSQL connection string. Use Neon production URLs with `sslmode=require`.
- `DATABASE_SSL`: `true`, `false`, or `auto`. Use `false` for local Docker PostgreSQL and `true` for Neon.
- `POSTGRES_DB`: local Docker PostgreSQL database name.
- `POSTGRES_USER`: local Docker PostgreSQL username.
- `POSTGRES_PASSWORD`: local Docker PostgreSQL password.

### Local PostgreSQL Notes

The default local setup uses Docker Compose service `postgres`, database `the_wedding`, TCP port `5432`, and a gitignored `.env` file based on `.env.example`.

## Auth

- `JWT_ACCESS_SECRET`: access token signing secret.
- `JWT_REFRESH_SECRET`: refresh token signing secret.
- `ACCESS_TOKEN_EXPIRES_IN`: access token TTL.
- `REFRESH_TOKEN_EXPIRES_IN`: refresh token TTL.
- `PASSWORD_RESET_TOKEN_EXPIRES_IN`: password reset token TTL.
- `EMAIL_VERIFICATION_TOKEN_EXPIRES_IN`: email verification token TTL.
- `COOKIE_SECRET`: cookie signing/encryption secret. Also used as server-side key material for MFA secret encryption and OAuth state signing; keep it strong and rotate carefully.

## Storage

- `STORAGE_PROVIDER`: `local`, `s3`, `azure`, or `r2`.
- `LOCAL_STORAGE_PATH`: local development storage path. With the default `./storage`, files are stored relative to the API process working directory; when running API from `apps/api`, this resolves to `apps/api/storage`.
- `TENANT_STORAGE_QUOTA_BYTES`: default tenant storage ceiling enforced before API-managed uploads write to storage. Default: `1073741824` bytes.
- `S3_ENDPOINT`, `S3_REGION`, `S3_BUCKET`, `S3_ACCESS_KEY`, `S3_SECRET_KEY`: S3-compatible storage. For Cloudflare R2, use the R2 S3 API endpoint and R2 access credentials.
- `STORAGE_PUBLIC_BASE_URL`: optional public/CDN base URL for optimized media derivatives.
- `STORAGE_SIGNED_URL_TTL_SECONDS`: signed URL lifetime for protected media.
- `MAX_UPLOAD_BYTES`, `MAX_VIDEO_UPLOAD_BYTES`: global upload limits before plan-specific limits are applied.

R2/S3 adapter support is available for API-managed uploads. Set `STORAGE_PROVIDER=r2` only after creating the Cloudflare R2 bucket/access keys and configuring the required `S3_*` variables on the API host. Direct browser/mobile upload sessions, multipart uploads, local-to-R2 migration tooling, and CDN-first delivery remain separate follow-up work. See `docs/guides/CLOUDFLARE_R2_SETUP.md`.

## Payments

MoMo variables are optional placeholders for the Phase 9 payment adapter foundation:

- `MOMO_PARTNER_CODE`, `MOMO_ACCESS_KEY`, `MOMO_SECRET_KEY`: MoMo merchant credentials.
- `MOMO_ENDPOINT`: MoMo checkout API endpoint.
- `MOMO_IPN_URL`: MoMo server-to-server notification URL.
- `MOMO_REDIRECT_URL`: browser return URL after checkout.

Do not commit real payment credentials. The current API stores idempotent admin-entered payment events only; real checkout and public webhook signature verification remain deferred.

## Realtime And Webhooks [NEW]

No realtime/webhook env is active yet. When `prompts/08g_realtime_webhook_event_platform.md` is implemented, expected future env may include feature flags/system parameters for SSE/webhook enablement, webhook signing secrets or secret encryption keys, inbound provider signature config, and delivery retry limits.

Do not expose public provider webhook URLs until signature verification, replay protection, idempotency, safe logging, and smoke tests pass. See `docs/REALTIME_WEBHOOK_PLAN.md`.

## Queue and Mail

- `REDIS_URL`: BullMQ/Redis connection.
- `MEDIA_PROCESSING_CONCURRENCY`: number of BullMQ media jobs a worker handles concurrently. Default: `2`.
- `MAIL_PROVIDER`: mail provider key. Use `smtp` for Brevo/SendGrid/Mailgun-compatible SMTP delivery.
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASSWORD`, `SMTP_FROM`, `SMTP_REPLY_TO`: SMTP settings for password reset and email verification delivery. For Brevo port `587`, use `SMTP_SECURE=false`; keep `SMTP_PASSWORD` only in local `.env` or host secrets. Local dev SMTP can omit user/password when using MailHog/Mailpit.

## OAuth

- `GOOGLE_OAUTH_ENABLED`: set `true` only when Google client ID/secret and callback URL are configured.
- `GOOGLE_OAUTH_CLIENT_ID`, `GOOGLE_OAUTH_CLIENT_SECRET`: Google OAuth credentials for authorization URL, callback code exchange, and verified-email profile fetch.
- `FACEBOOK_OAUTH_ENABLED`: set `true` only when Facebook app ID/secret and callback URL are configured.
- `FACEBOOK_OAUTH_CLIENT_ID`, `FACEBOOK_OAUTH_CLIENT_SECRET`: Facebook OAuth credentials for authorization URL, callback code exchange, and verified-email profile fetch.

## Bootstrap

- `SUPER_ADMIN_EMAIL`: first super admin email.
- `SUPER_ADMIN_PASSWORD`: first super admin password.
