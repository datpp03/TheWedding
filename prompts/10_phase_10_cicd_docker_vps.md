# Prompt 10: Priority CI/CD Docker VPS

PLEASE IMPLEMENT THIS PROMPT.

IMPORTANT PROMPT LIFECYCLE: Chi xoa file prompt nay sau khi hoan thanh tat ca muc trong prompt, pass verification, cap nhat docs, commit va push thanh cong. Neu con bat ky hang muc nao chua xong, giu nguyen file prompt va ghi ro phan con lai.

TRUOC KHI BAT DAU: Doc `AGENTS.md` va `docs/SYSTEM_MAP.md` de biet cau truc thu muc, file lien quan, va quy tac ban giao (tiet kiem token, khong quet lai toan repo). Neu muc `## Carryover Khan Cap Tu Prompt Truoc` ben duoi co noi dung, xu ly cac muc do TRUOC.

Taste Skill Frontend Rule: Khi task cham frontend/UI/layout/component/form/dashboard/admin/public page/redesign/accessibility/responsive QA, doc `docs/ai/taste-skill-integration.md` va `.cursor/rules/taste-skill-frontend.mdc` truoc khi code; audit man hinh hien tai va giu nguyen API/props/state/permission/routing/business logic neu task chi la UI.

## Carryover Khan Cap Tu Prompt Truoc

(Trong. Prompt truoc se chen loi chua sua / viec phai lam ngay vao day.)

Ban dang lam trong repo `D:\AJT\TheWedding`. Hay lam CI/CD Docker VPS truoc cac phase con lai de co the xem tien do du an tu xa tren host/VPS.

Truoc khi lam, doc `docs/PRODUCT_PLAN.md`, `docs/DEPLOYMENT.md`, `docs/SEO_GEO_GUIDELINES.md`, va `docs/guides/CI_CD_DOCKER_VPS.md` de dam bao deployment docs khong mau thuan voi product/roadmap hien tai. [NEW]

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
- SEO/GEO deployment readiness:
  - Document cach verify production `robots.txt`, `sitemap.xml`, canonical base URL, custom domain canonical, HTTPS redirects, cache headers, Open Graph image reachability, va noindex cho admin/auth/dashboard.
  - Dam bao reverse proxy/CDN khong cache private/auth/admin/API/signed-media responses cong khai.
  - Neu dung custom domain, document redirect/canonical strategy giua apex, www, Vercel/Render/default domains.

## Tests

- Verify YAML syntax.
- Verify Docker build locally or in CI where possible.
- Verify workflow khong deploy tren PR.
- Verify deploy chi chay tren `main` hoac manual dispatch neu duoc cau hinh.
- Verify SEO/GEO deployment smoke: robots.txt/sitemap.xml reachable, HTTPS canonical domain dung, admin/auth/dashboard noindex, public Open Graph image reachable.
- Run full verification neu thay doi code/runtime.

## Docs

- Update `docs/DEPLOYMENT.md`.
- Update `docs/SEO_GEO_GUIDELINES.md` neu deployment/crawler/cache/canonical policy thay doi.
- Update `docs/guides/CI_CD_DOCKER_VPS.md` neu workflow thuc te khac guide.
- Update `docs/TROUBLESHOOTING.md` voi loi thuong gap khi registry login, SSH, pull image, restart container.
- Update `docs/ROADMAP.md`, `docs/CHANGELOG.md`, `docs/DEVELOPMENT_LOG.md`.

## Ban Giao Sau Prompt (Bat Buoc)

Theo `AGENTS.md` muc 3, sau khi hoan tat (hoac dung do con viec):

- Tao/cap nhat task file trong `viec-can-lam/` cho viec nguoi dung can lam (credentials/config/QA thu cong/quyet dinh san pham), acceptance chua xong va ly do. Dung `viec-can-lam/_TEMPLATE.md`, dat vao dung muc do, roi cap nhat `viec-can-lam/README.md` nhu muc luc link/trang thai. Moi task file phai co huong dan chi tiet de nguoi dung tu lam duoc: can chuan bi gi, cac buoc thuc hien, file/env/dashboard/URL lien quan, cach smoke test/xac nhan pass, va docs lien quan.
- Neu con loi chua sua hoac viec phai lam ngay, tao/cap nhat file trong `viec-can-lam/00_khan_cap/`, roi chen tom tat + link vao muc `## Carryover Khan Cap Tu Prompt Truoc` o DAU prompt ke tiep (theo thu tu `prompts/README.md`); neu day la prompt cuoi, ghi link vao muc "Khan Cap" cua `viec-can-lam/README.md`.
- Tao/cap nhat file y tuong trong `y-tuong-nang-cap/` bang `y-tuong-nang-cap/_TEMPLATE.md`, roi cap nhat `y-tuong-nang-cap/README.md`.
- Cap nhat `docs/SYSTEM_MAP.md` neu cau truc thu muc/module/route/doc thay doi.

## Acceptance Criteria

- GitHub Actions co workflow build/push image ro rang.
- Docker Hub/GHCR registry path va secrets duoc document.
- VPS deploy job pull image moi va restart container.
- Rollback theo image tag commit SHA duoc document.
- Production SEO/GEO smoke checklist cho robots/sitemap/canonical/custom-domain/cache/noindex duoc document.
- Khong co production secret nao bi commit vao repo.
- `viec-can-lam/`, `viec-can-lam/README.md` va `y-tuong-nang-cap/README.md` da duoc cap nhat; moi task file trong `viec-can-lam/` co huong dan thuc hien chi tiet; viec khan cap (neu co) da chuyen sang prompt ke tiep hoac `viec-can-lam/00_khan_cap/`.
- Commit va push len `origin/main`.
