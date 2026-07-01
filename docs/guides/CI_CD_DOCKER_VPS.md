# Huong Dan CI/CD Docker Len VPS

## Muc Tieu

Flow trien khai mong muon:

```txt
GitHub Actions build Docker image
        ->
Push image len Docker Hub/GHCR
        ->
VPS pull image moi
        ->
Restart container
```

Pipeline nay phu hop cho giai doan dau: don gian, de rollback, chua can Kubernetes.

## Trang Thai Trong Repo

CI/CD duoc uu tien lam truoc cac phase con lai de ban co the deploy len host/VPS va xem tien do tu xa.

Repo da co cac file nen tang:

- `.github/workflows/deploy-docker-vps.yml`: workflow build, push image va deploy VPS.
- `docker-compose.prod.yml`: compose production tren VPS.
- `docker/production.env.example`: mau `.env.production` cho VPS.
- `docker/api.Dockerfile` va `docker/web.Dockerfile`: Docker image cho API/Web.

## Kien Truc De Xuat

- GitHub Actions chay khi merge/push vao `main`.
- Co the chay thu cong bang `workflow_dispatch`.
- Workflow build rieng image cho API va Web tu:
  - `docker/api.Dockerfile`
  - `docker/web.Dockerfile`
- Image duoc tag theo:
  - commit SHA de rollback chinh xac.
  - `latest` hoac `main` cho deploy nhanh.
- Registry co the dung mot trong hai:
  - Docker Hub: de dung, phu hop VPS bat ky.
  - GHCR: gan voi GitHub repo, de quan ly permission hon neu repo nam tren GitHub.
- VPS chi can Docker/Compose, file `.env.production`, va `docker-compose.prod.yml`.

## Chon Registry

### Option A: Docker Hub

Neu muon dung Docker Hub, tao Docker Hub access token va them GitHub Secrets:

```txt
DOCKERHUB_USERNAME
DOCKERHUB_TOKEN
```

Them GitHub Actions variable:

```txt
CONTAINER_REGISTRY=dockerhub
```

Image name de xuat:

```txt
docker.io/<dockerhub-username>/the-wedding-api
docker.io/<dockerhub-username>/the-wedding-web
```

### Option B: GHCR

Dung GitHub Container Registry:

```txt
ghcr.io/<github-owner>/the-wedding-api
ghcr.io/<github-owner>/the-wedding-web
```

Neu package private, VPS can login GHCR bang token co quyen `read:packages`.

GitHub Actions dang mac dinh dung GHCR neu khong cau hinh `CONTAINER_REGISTRY`. Workflow co the dung `GITHUB_TOKEN` de push GHCR trong cung repo neu package permission duoc cau hinh dung.

## GitHub Secrets Can Tao

Vao GitHub repo -> Settings -> Secrets and variables -> Actions -> New repository secret.

### Secrets cho registry build/push

Dung Docker Hub:

```txt
DOCKERHUB_USERNAME=<ten-dockerhub>
DOCKERHUB_TOKEN=<access-token>
```

Dung GHCR:

```txt
Khong can secret rieng de push neu dung GITHUB_TOKEN mac dinh cua workflow.
```

Neu GHCR package private, VPS can pull bang secrets optional ben duoi.

### Secrets cho deploy vao VPS

```txt
VPS_HOST=<ip-hoac-domain-cua-vps>
VPS_USER=<user-ssh>
VPS_SSH_KEY=<private-key-ssh>
VPS_APP_DIR=/opt/the-wedding
```

Khi VPS da san sang va muon auto deploy moi lan push vao `main`, them GitHub Actions variable:

```txt
DEPLOY_ENABLED=true
```

Neu chua them bien nay, workflow van co the build/push image, nhung deploy job tren push se duoc skip de tranh fail khi chua cau hinh VPS. Chay thu cong bang `workflow_dispatch` van se deploy neu secrets da du.

Neu image private hoac muon VPS login registry truoc khi pull:

```txt
VPS_REGISTRY_USERNAME=<dockerhub-hoac-github-username>
VPS_REGISTRY_TOKEN=<token-co-quyen-pull-image>
```

Khuyen nghi tao user deploy rieng tren VPS, khong dung root neu khong can.

## Chuan Bi VPS

1. Cai Docker va Docker Compose plugin.
2. Tao thu muc app:

```bash
sudo mkdir -p /opt/the-wedding
sudo chown -R $USER:$USER /opt/the-wedding
cd /opt/the-wedding
```

3. Copy `docker/production.env.example` thanh `/opt/the-wedding/.env.production` tren VPS va sua gia tri that. File nay khong commit:

```env
IMAGE_REGISTRY=ghcr.io
IMAGE_NAMESPACE=your-github-owner-or-dockerhub-username
IMAGE_TAG=latest

NODE_ENV=production
APP_URL=https://your-domain.com
API_URL=https://api.your-domain.com
NEXT_PUBLIC_API_URL=https://api.your-domain.com
CORS_ORIGINS=https://your-domain.com

DATABASE_URL=postgresql://user:password@host:5432/the_wedding
DATABASE_SSL=false
REDIS_URL=redis://redis:6379

JWT_ACCESS_SECRET=...
JWT_REFRESH_SECRET=...
COOKIE_SECRET=...

STORAGE_PROVIDER=local
LOCAL_STORAGE_PATH=/app/storage
```

4. Workflow se copy `docker-compose.prod.yml` len `VPS_APP_DIR` moi lan deploy. Lan dau co the copy thu cong file nay len VPS neu muon test bang tay.

## Workflow GitHub Actions

Workflow that da co tai `.github/workflows/deploy-docker-vps.yml`.

Workflow nay:

1. Chay format/lint/typecheck/test/build.
2. Build API image tu `docker/api.Dockerfile`.
3. Build Web image tu `docker/web.Dockerfile`.
4. Push image voi tag `latest` va commit SHA.
5. Copy `docker-compose.prod.yml` len VPS.
6. SSH vao VPS va chay:

```bash
IMAGE_REGISTRY="$IMAGE_REGISTRY" IMAGE_NAMESPACE="$IMAGE_NAMESPACE" IMAGE_TAG="$IMAGE_TAG" docker compose --env-file .env.production -f docker-compose.prod.yml pull
IMAGE_REGISTRY="$IMAGE_REGISTRY" IMAGE_NAMESPACE="$IMAGE_NAMESPACE" IMAGE_TAG="$IMAGE_TAG" docker compose --env-file .env.production -f docker-compose.prod.yml up -d
```

## GHCR Workflow Khac Docker Hub O Dau

Mac dinh workflow dung GHCR. Neu muon Docker Hub:

```txt
GitHub repo -> Settings -> Secrets and variables -> Actions -> Variables
CONTAINER_REGISTRY=dockerhub
```

Va tao `DOCKERHUB_USERNAME`, `DOCKERHUB_TOKEN`.

Tren VPS, neu package private:

```bash
echo "<VPS_REGISTRY_TOKEN>" | docker login ghcr.io -u "<VPS_REGISTRY_USERNAME>" --password-stdin
```

## Verify Sau Khi Deploy

Tren VPS:

```bash
cd /opt/the-wedding
docker compose --env-file .env.production -f docker-compose.prod.yml ps
docker compose --env-file .env.production -f docker-compose.prod.yml logs --tail=100 api
docker compose --env-file .env.production -f docker-compose.prod.yml logs --tail=100 web
```

Kiem tra HTTP:

```bash
curl -I http://localhost:3000
curl -I http://localhost:4000/api/v1/auth/capabilities
```

Neu co reverse proxy/domain, kiem tra:

```bash
curl -I https://your-domain.com
curl -I https://api.your-domain.com/api/v1/auth/capabilities
```

## Rollback Nhanh

Vi workflow push ca tag commit SHA, co the rollback bang cach sua `IMAGE_TAG` trong `/opt/the-wedding/.env.production` ve SHA cu:

```env
IMAGE_TAG=<old-sha>
```

Sau do:

```bash
docker compose --env-file .env.production -f docker-compose.prod.yml pull
docker compose --env-file .env.production -f docker-compose.prod.yml up -d
```

## Checklist Khi Implement

- Tao workflow deploy rieng, khong tron voi CI check hien co.
- Push ca API va Web image.
- Dung tag `latest` va `${{ github.sha }}`.
- Tao GitHub Secrets cho registry va VPS.
- Tao `.env.production` tren VPS, khong commit secret.
- Dung `docker-compose.prod.yml` da commit trong repo.
- VPS pull image moi va restart container bang `docker compose up -d`.
- Ghi ro rollback theo commit SHA.
