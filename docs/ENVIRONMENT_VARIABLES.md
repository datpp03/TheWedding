# Environment Variables

Use `.env.example` as the template. Do not commit `.env` files.

## Application

- `NODE_ENV`: `local`, `development`, `staging`, `production`, or `test`.
- `APP_URL`: frontend base URL.
- `API_URL`: backend base URL.
- `CORS_ORIGINS`: comma-separated allowed origins.

## Database

- `DATABASE_URL`: SQL Server connection string.
- `SQLSERVER_SA_PASSWORD`: local Docker SQL Server SA password.
- `SQLSERVER_AUTH_MODE`: `sql` for username/password connection strings or `windows` for local Windows Authentication.
- `SQLSERVER_HOST`: SQL Server host for Windows Authentication mode.
- `SQLSERVER_PORT`: SQL Server port for Windows Authentication mode.
- `SQLSERVER_DATABASE`: SQL Server database name for Windows Authentication mode.
- `SQLSERVER_ODBC_DRIVER`: installed ODBC driver name, usually `ODBC Driver 18 for SQL Server`.

### Local SQL Server Notes

The verified local setup uses SQL Server database `TheWedding`, TCP port `1433`, SQL login `TheWeddingApp`, and a gitignored `.env` file. The local SQL Server instance must allow Mixed Mode authentication and TCP/IP for the default Tedious driver.

## Auth

- `JWT_ACCESS_SECRET`: access token signing secret.
- `JWT_REFRESH_SECRET`: refresh token signing secret.
- `ACCESS_TOKEN_EXPIRES_IN`: access token TTL.
- `REFRESH_TOKEN_EXPIRES_IN`: refresh token TTL.
- `COOKIE_SECRET`: cookie signing/encryption secret.

## Storage

- `STORAGE_PROVIDER`: `local`, `s3`, `azure`, or `r2`.
- `LOCAL_STORAGE_PATH`: local development storage path.
- `S3_ENDPOINT`, `S3_REGION`, `S3_BUCKET`, `S3_ACCESS_KEY`, `S3_SECRET_KEY`: S3-compatible storage.

## Queue and Mail

- `REDIS_URL`: BullMQ/Redis connection.
- `MAIL_PROVIDER`: mail provider key.
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`: SMTP settings.

## Bootstrap

- `SUPER_ADMIN_EMAIL`: first super admin email.
- `SUPER_ADMIN_PASSWORD`: first super admin password.
