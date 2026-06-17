# Prompt 10: Priority CI/CD Docker VPS

PLEASE IMPLEMENT THIS PROMPT.

IMPORTANT PROMPT LIFECYCLE: Chi xoa file prompt nay sau khi hoan thanh tat ca muc trong prompt, pass verification, cap nhat docs, commit va push thanh cong. Neu con bat ky hang muc nao chua xong, giu nguyen file prompt va ghi ro phan con lai.

Ban dang lam trong repo `D:\AJT\TheWedding`. Hay lam CI/CD Docker VPS truoc cac phase con lai de co the xem tien do du an tu xa tren host/VPS.

Truoc khi lam, doc `docs/PRODUCT_PLAN.md`, `docs/DEPLOYMENT.md`, va `docs/guides/CI_CD_DOCKER_VPS.md` de dam bao deployment docs khong mau thuan voi product/roadmap hien tai. [NEW]

## Muc Tieu

Them CI/CD production pipeline theo flow:

```txt
GitHub Actions build Docker image
        ->
Push image len Docker Hub/GHCR
        ->
VPS pull image moi
        ->
Restart container
```

Lam theo `docs/guides/CI_CD_DOCKER_VPS.md`.

## Tasks

- Giu workflow CI hien co cho format/lint/typecheck/test/build/audit.
- Them workflow deploy rieng `.github/workflows/deploy-docker-vps.yml`.
- Build va push Docker image cho:
  - API: `docker/api.Dockerfile`.
  - Web: `docker/web.Dockerfile`.
- Ho tro Docker Hub hoac GHCR theo env/secrets ro rang.
- Tag images bang:
  - `latest` hoac `main`.
  - `${{ github.sha }}` de rollback.
- Them deploy job SSH vao VPS:
  - `cd` vao app dir.
  - registry login neu can.
  - `docker compose --env-file .env.production -f docker-compose.prod.yml pull`.
  - `docker compose --env-file .env.production -f docker-compose.prod.yml up -d`.
  - prune image cu neu an toan.
- Them template production compose neu can, khong commit secret.
- Them `docker-compose.prod.yml` va env example cho VPS neu chua co.
- Tai lieu hoa GitHub Secrets:
  - registry secrets.
  - VPS host/user/key/app dir.
  - env production nam tren VPS.
- Them rollback steps theo commit SHA.

## Tests

- Verify YAML syntax.
- Verify Docker build locally or in CI where possible.
- Verify workflow khong deploy tren PR.
- Verify deploy chi chay tren `main` hoac manual dispatch neu duoc cau hinh.
- Run full verification neu thay doi code/runtime.

## Docs

- Update `docs/DEPLOYMENT.md`.
- Update `docs/guides/CI_CD_DOCKER_VPS.md` neu workflow thuc te khac guide.
- Update `docs/TROUBLESHOOTING.md` voi loi thuong gap khi registry login, SSH, pull image, restart container.
- Update `docs/ROADMAP.md`, `docs/CHANGELOG.md`, `docs/DEVELOPMENT_LOG.md`.

## Acceptance Criteria

- GitHub Actions co workflow build/push image ro rang.
- Docker Hub/GHCR registry path va secrets duoc document.
- VPS deploy job pull image moi va restart container.
- Rollback theo image tag commit SHA duoc document.
- Khong co production secret nao bi commit vao repo.
- Commit va push len `origin/main`.
