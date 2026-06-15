# Environment Variables

Use `.env.example` as the template. Do not commit `.env` files.

## Application

- `NODE_ENV`: `local`, `development`, `staging`, `production`, or `test`.
- `APP_URL`: frontend base URL.
- `API_URL`: backend base URL.
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
- `COOKIE_SECRET`: cookie signing/encryption secret.

## Storage

- `STORAGE_PROVIDER`: `local`, `s3`, `azure`, or `r2`.
- `LOCAL_STORAGE_PATH`: local development storage path. With the default `./storage`, files are stored relative to the API process working directory; when running API from `apps/api`, this resolves to `apps/api/storage`.
- `S3_ENDPOINT`, `S3_REGION`, `S3_BUCKET`, `S3_ACCESS_KEY`, `S3_SECRET_KEY`: S3-compatible storage. For Cloudflare R2, use the R2 S3 API endpoint and R2 access credentials.
- `STORAGE_PUBLIC_BASE_URL`: optional public/CDN base URL for optimized media derivatives.
- `STORAGE_SIGNED_URL_TTL_SECONDS`: signed URL lifetime for protected media.
- `MAX_UPLOAD_BYTES`, `MAX_VIDEO_UPLOAD_BYTES`: global upload limits before plan-specific limits are applied.

Future production storage variables are planned in `docs/STORAGE_STRATEGY.md` and should be added to env validation only when the S3-compatible adapter is implemented.

## Payments

Future MoMo variables should be added only when the MoMo provider adapter is implemented:

- `PAYMENT_PROVIDER`: first production value planned as `momo`.
- `MOMO_PARTNER_CODE`, `MOMO_ACCESS_KEY`, `MOMO_SECRET_KEY`: MoMo merchant credentials.
- `MOMO_ENDPOINT`: MoMo checkout API endpoint.
- `MOMO_RETURN_URL`, `MOMO_NOTIFY_URL`: browser return and webhook URLs.
- `PAYMENT_WEBHOOK_SECRET`: app-side webhook verification secret if needed.

Do not commit real payment credentials.

## Queue and Mail

- `REDIS_URL`: BullMQ/Redis connection.
- `MAIL_PROVIDER`: mail provider key.
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`: SMTP settings.

## Bootstrap

- `SUPER_ADMIN_EMAIL`: first super admin email.
- `SUPER_ADMIN_PASSWORD`: first super admin password.
