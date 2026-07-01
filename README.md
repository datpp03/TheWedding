# The Wedding

The Wedding is a planned multi-tenant wedding photo and video platform. Each couple can manage a private or public wedding site with albums, media, themes, sharing controls, and enterprise-grade security foundations.

## Workspace

```txt
apps/api        NestJS API, Clean Architecture + DDD
apps/web        Next.js App Router frontend
packages/shared Shared types, constants, and utilities
packages/ui     Shared UI components
packages/config Shared TypeScript, ESLint, and formatting config
docs            Product, architecture, security, API, and delivery docs
docker          Runtime Dockerfiles and production env templates
scripts         Local setup and operational helpers
RUN_LOCAL_CONTROL.cmd  Double-click local control panel for API/Web/logs
```

## Prerequisites

- Node.js 22 LTS or newer
- pnpm 10 or newer
- Docker Desktop with Linux containers
- PostgreSQL 16 through Docker Compose for local development

## First Run

```bash
pnpm install
docker compose up -d postgres redis
pnpm --filter @the-wedding/api migration:run
pnpm --filter @the-wedding/api seed:roles
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm local:control
```

On Windows PowerShell, use `pnpm.cmd` if script execution policy blocks `pnpm.ps1`.

For production SEO metadata, set `NEXT_PUBLIC_APP_URL` to the deployed web origin and
`NEXT_PUBLIC_API_URL` to the deployed API origin before building the web app.

## Documentation

Start with:

- [Product Plan](docs/PRODUCT_PLAN.md)
- [Project Overview](docs/PROJECT_OVERVIEW.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Database Design](docs/DATABASE_DESIGN.md)
- [API Design](docs/API_DESIGN.md)
- [Auth & Security](docs/AUTH_SECURITY.md)
- [AI Frontend Taste Skill Rule](docs/ai/taste-skill-integration.md)
- [Roadmap](docs/ROADMAP.md)
- [Guides](docs/guides/README.md)
- [CI/CD Docker VPS Guide](docs/guides/CI_CD_DOCKER_VPS.md)
- [Free Hosting Vercel + Render + Neon Guide](docs/guides/FREE_HOSTING_VERCEL_RENDER_NEON.md)
