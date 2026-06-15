# Huong Dan Deploy Free: Vercel + Render + Neon PostgreSQL

Tai lieu nay la duong deploy chi phi thap nhat hien tai cho The Wedding sau khi chuyen database tu SQL Server sang PostgreSQL.

Kien truc:

```txt
GitHub repository
  |-- Vercel Free: apps/web Next.js
  |-- Render Free: apps/api NestJS Docker
  |-- Neon Free: PostgreSQL database
  |-- Redis: tam thoi tat bang REDIS_URL rong
  |-- Cloudflare R2 Free: de sau, khi adapter S3/R2 on dinh
```

## Nguyen Tac Khong Mat Phi

1. Vercel: dung Hobby/Personal, khong nang cap Pro.
2. Render: API service phai la `Free` plan.
3. Neon: chon Free plan, khong them paid compute/storage.
4. Khong tao database tren Render de luu du lieu that.
5. Redis de trong: `REDIS_URL=`.
6. Storage anh/video production chua bat, vi Render local disk khong phai noi luu tru lau dai.
7. Dat reminder hang thang de vao Neon/Render kiem tra usage.

Link pricing nen xem lai truoc khi tao resource:

- Vercel: https://vercel.com/docs/plans/hobby
- Render: https://render.com/docs/free
- Neon: https://neon.com/pricing
- Cloudflare R2: https://developers.cloudflare.com/r2/pricing/

## Bien Moi Truong Can Nam

Backend Render:

```env
NODE_ENV=production
PORT=4000
APP_URL=https://YOUR_VERCEL_APP.vercel.app
API_URL=https://YOUR_RENDER_API.onrender.com
CORS_ORIGINS=https://YOUR_VERCEL_APP.vercel.app

DATABASE_URL=postgresql://USER:PASSWORD@HOST.neon.tech/DB?sslmode=require
DATABASE_SSL=true

JWT_ACCESS_SECRET=<random-64-chars>
JWT_REFRESH_SECRET=<random-64-chars>
COOKIE_SECRET=<random-64-chars>
ACCESS_TOKEN_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=30d
PASSWORD_RESET_TOKEN_EXPIRES_IN=1h
EMAIL_VERIFICATION_TOKEN_EXPIRES_IN=7d

STORAGE_PROVIDER=local
LOCAL_STORAGE_PATH=/app/storage
REDIS_URL=

MAIL_PROVIDER=smtp
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASSWORD=

SUPER_ADMIN_EMAIL=admin@example.com
SUPER_ADMIN_PASSWORD=<strong-password-min-12-chars>
```

Frontend Vercel:

```env
NEXT_PUBLIC_API_URL=https://YOUR_RENDER_API.onrender.com
```

Tao secret random bang PowerShell:

```powershell
-join ((48..57 + 65..90 + 97..122) | Get-Random -Count 64 | ForEach-Object {[char]$_})
```

Chay 3 lan cho `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, va `COOKIE_SECRET`.

## Buoc 1: Tao Neon PostgreSQL Free

1. Vao https://neon.com
2. Dang ky bang GitHub hoac email.
3. Tao project moi:
   - Project name: `the-wedding`
   - Region: chon gan nguoi dung nhat. Neu co Singapore/Asia thi uu tien.
   - Postgres version: dung mac dinh Neon de xuat.
4. Trong project, vao `Connection Details`.
5. Chon database mac dinh hoac tao database:
   - Database: `the_wedding`
   - Role/user: giu role Neon tao san hoac tao role rieng.
6. Copy connection string dang `Postgres`.
7. Dam bao URL co `sslmode=require`.

Nen dung direct connection cho giai doan dau:

```env
DATABASE_URL=postgresql://USER:PASSWORD@ep-xxx.neon.tech/the_wedding?sslmode=require
DATABASE_SSL=true
```

Khi nao app co nhieu instance/qua nhieu connection, moi can can nhac pooled connection.

## Buoc 2: Chay Migration Va Seed Len Neon

Lam tu may local de de kiem soat.

PowerShell:

```powershell
$env:DATABASE_URL="postgresql://USER:PASSWORD@HOST.neon.tech/the_wedding?sslmode=require"
$env:DATABASE_SSL="true"
$env:NODE_ENV="production"
$env:APP_URL="https://YOUR_VERCEL_APP.vercel.app"
$env:API_URL="https://YOUR_RENDER_API.onrender.com"
$env:CORS_ORIGINS="https://YOUR_VERCEL_APP.vercel.app"
$env:JWT_ACCESS_SECRET="<random-64-chars>"
$env:JWT_REFRESH_SECRET="<random-64-chars>"
$env:COOKIE_SECRET="<random-64-chars>"
$env:SUPER_ADMIN_EMAIL="admin@example.com"
$env:SUPER_ADMIN_PASSWORD="<strong-password-min-12-chars>"

pnpm.cmd --filter @the-wedding/api migration:run
pnpm.cmd --filter @the-wedding/api seed:roles
```

Neu migration fail vi SSL:

```powershell
$env:DATABASE_SSL="true"
```

Neu password Neon co ky tu dac biet nhu `@`, `#`, `/`, `?`, hay URL-encode password truoc khi dat vao `DATABASE_URL`.

## Buoc 3: Deploy API Len Render Free

Repo co `render.yaml`, Render se doc duoc cau hinh API Docker.

1. Vao https://render.com
2. Dang nhap bang GitHub.
3. `New` -> `Blueprint`.
4. Chon repo `TheWedding`.
5. Kiem tra service:
   - Name: `the-wedding-api`
   - Runtime: Docker
   - Dockerfile: `./docker/api.Dockerfile`
   - Plan: Free
   - Auto Deploy: On
6. Vao Environment cua service va nhap cac bien backend.

Quan trong:

```env
DATABASE_URL=postgresql://USER:PASSWORD@HOST.neon.tech/the_wedding?sslmode=require
DATABASE_SSL=true
REDIS_URL=
```

Sau khi deploy xong, test:

```bash
curl https://YOUR_RENDER_API.onrender.com/api/v1/health
```

Render Free se sleep khi it traffic. Lan truy cap dau sau khi sleep co the cham.

## Buoc 4: Deploy Web Len Vercel Free

1. Vao https://vercel.com
2. Import GitHub repo.
3. Cau hinh project:
   - Framework: Next.js
   - Root Directory: `apps/web`
   - Install Command: `cd ../.. && pnpm install --frozen-lockfile=false`
   - Build Command: `cd ../.. && pnpm --filter @the-wedding/shared build && pnpm --filter @the-wedding/ui build && pnpm --filter @the-wedding/web build`
4. Environment Variables:

```env
NEXT_PUBLIC_API_URL=https://YOUR_RENDER_API.onrender.com
```

Sau khi co URL Vercel that, quay lai Render cap nhat:

```env
APP_URL=https://YOUR_VERCEL_APP.vercel.app
CORS_ORIGINS=https://YOUR_VERCEL_APP.vercel.app
```

Redeploy API.

## Buoc 5: CI/CD

Flow:

```txt
Pull Request
  -> GitHub Actions CI: format/lint/typecheck/test/build
  -> Vercel Preview Deploy

Merge main
  -> GitHub Actions CI
  -> Vercel Production Deploy
  -> Render API Auto Deploy
```

Repo da co `.github/workflows/ci.yml`.

Nen bat branch protection:

1. GitHub repo -> Settings -> Branches.
2. Tao rule cho `main`.
3. Bat `Require status checks to pass before merging`.
4. Chon check `CI / checks`.
5. Lam viec qua Pull Request.

Migration khong nen auto-run moi lan deploy o giai doan dau. Khi co thay doi schema, chay thu cong:

```powershell
$env:DATABASE_URL="postgresql://USER:PASSWORD@HOST.neon.tech/the_wedding?sslmode=require"
$env:DATABASE_SSL="true"
pnpm.cmd --filter @the-wedding/api migration:run
```

## Buoc 6: Local Development Bang PostgreSQL

Local `.env` co the theo `.env.example`:

```env
DATABASE_URL=postgresql://the_wedding:ChangeMePostgres!123@localhost:5432/the_wedding
DATABASE_SSL=false
POSTGRES_DB=the_wedding
POSTGRES_USER=the_wedding
POSTGRES_PASSWORD=ChangeMePostgres!123
```

Chay:

```bash
docker compose up -d postgres redis
pnpm --filter @the-wedding/api migration:run
pnpm --filter @the-wedding/api seed:roles
pnpm dev
```

## Buoc 7: Smoke Test

API:

```bash
curl https://YOUR_RENDER_API.onrender.com/api/v1/health
```

Web:

1. Mo Vercel URL.
2. Register/login.
3. Tao tenant/site.
4. Tao album.
5. Upload file test nho.

Neu loi CORS:

- `CORS_ORIGINS` tren Render phai dung dung Vercel origin.
- Khong them dau `/` cuoi URL.

Neu loi database:

- Kiem tra `DATABASE_URL`.
- Kiem tra `sslmode=require`.
- Kiem tra `DATABASE_SSL=true`.
- Kiem tra migration da chay.

## Buoc 8: Bat Redis Sau Nay

Hien tai Redis tat:

```env
REDIS_URL=
```

Sau nay neu can queue/cache:

```env
REDIS_URL=rediss://default:password@host:port
```

Redeploy API sau khi cap nhat.

## Buoc 9: Bat Cloudflare R2 Sau Nay

Chi bat khi adapter S3/R2 da on dinh.

```env
STORAGE_PROVIDER=r2
S3_ENDPOINT=https://<account-id>.r2.cloudflarestorage.com
S3_REGION=auto
S3_BUCKET=the-wedding-media
S3_ACCESS_KEY=<r2-access-key>
S3_SECRET_KEY=<r2-secret-key>
STORAGE_SIGNED_URL_TTL_SECONDS=900
```

Upload anh/video that khong nen phu thuoc Render local disk.

## Checklist

- Neon project Free da tao.
- `DATABASE_URL` la PostgreSQL, co `sslmode=require`.
- `DATABASE_SSL=true` tren Render.
- Migration da chay tren Neon.
- Seed roles/admin da chay.
- Render API plan la Free.
- Vercel project la Hobby.
- `REDIS_URL` de rong.
- Web goi duoc API.
- Login/register hoat dong.
- Upload file chi dung de test cho den khi co R2.
