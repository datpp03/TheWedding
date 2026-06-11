# Troubleshooting

## Node or pnpm Not Found

Install Node.js 22 LTS, then enable pnpm:

```bash
corepack enable
corepack prepare pnpm@10.12.1 --activate
```

## SQL Server Container Fails to Start

- Ensure Docker Desktop is running.
- Ensure `SQLSERVER_SA_PASSWORD` meets SQL Server complexity requirements.
- Check port `1433` is free.

## API Cannot Connect to Database

- Confirm `DATABASE_URL`.
- Confirm SQL Server container health.
- Run migrations after dependencies are installed.

## CORS Errors

- Add the frontend origin to `CORS_ORIGINS`.
- Keep production origins explicit; do not use `*` with credentials.

## Auth Cookie Issues

- In local HTTP development, secure cookies may need environment-specific config.
- In production, cookies must be Secure and SameSite-protected.
