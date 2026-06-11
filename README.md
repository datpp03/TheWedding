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
docker          Runtime Dockerfiles and SQL Server setup
scripts         Local setup and operational helpers
```

## Prerequisites

- Node.js 22 LTS or newer
- pnpm 10 or newer
- Docker Desktop with Linux containers
- Microsoft SQL Server container image access

## First Run

```bash
pnpm install
pnpm lint
pnpm typecheck
pnpm build
docker compose up -d sqlserver redis
```

Runtime tools are not currently available in this Codex environment, so dependency installation and builds have not been executed here.

## Documentation

Start with:

- [Project Overview](docs/PROJECT_OVERVIEW.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Database Design](docs/DATABASE_DESIGN.md)
- [API Design](docs/API_DESIGN.md)
- [Auth & Security](docs/AUTH_SECURITY.md)
- [Roadmap](docs/ROADMAP.md)
