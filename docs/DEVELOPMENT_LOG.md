# Development Log

## 2026-06-12 - Phase 0 and Phase 1 Foundation

### Completed

- Created documentation-first project foundation.
- Created monorepo structure for API, web, shared packages, config, docs, docker, and scripts.
- Added NestJS API skeleton with Clean Architecture module folders.
- Added Next.js App Router skeleton with public, auth, dashboard, and admin route groups.
- Added SQL Server initial migration draft covering required core tables.
- Added Docker Compose with SQL Server and Redis.
- Added GitHub PR, issue, and CI templates.

### Files Created or Updated

- `README.md`, `.env.example`, `.gitignore`, `.editorconfig`, `.prettierrc.json`
- `package.json`, `pnpm-workspace.yaml`, `turbo.json`, `tsconfig.base.json`
- `docs/*.md`
- `apps/api/**`
- `apps/web/**`
- `packages/**`
- `docker/**`, `docker-compose.yml`
- `.github/**`

### Current Capability

- The repository now has a complete foundation for installing dependencies and beginning backend/frontend implementation.
- API and web apps are scaffolds, not completed runtime features.

### Missing

- Node.js, npm, pnpm, and Git are not available in the current terminal PATH.
- Dependency install, lint, typecheck, build, migration execution, and tests have not been run.
- Business use cases are placeholders for future phases.

### Related Config and Env

- Main env file: `.env.example`
- API env validation: `apps/api/src/config/env.validation.ts`
- Database config: `apps/api/src/database/typeorm.config.ts`

### Related Permissions

- `SUPER_ADMIN`, `ADMIN`, `SUPPORT`, `USER`, `GUEST`
- Permission constants are defined in `packages/shared/src/permissions.ts`

### Related APIs

- API route contract is documented in `docs/API_DESIGN.md`.
- Controller implementations are intentionally minimal in Phase 1.

### Related Tables

- See `docs/DATABASE_DESIGN.md` and the initial migration file.

### Tests

- Test scripts are declared but not executed because Node/pnpm are unavailable.

### Technical Risks

- Dependency versions may need adjustment during `pnpm install`.
- SQL Server migration SQL must be tested against an actual SQL Server container.

## 2026-06-12 - Local Repo, SQL Server, Install, and Run Verification

### Completed

- Initialized the workspace as a Git repository on branch `main`.
- Connected Git remote `origin` to `https://github.com/datpp03/TheWedding.git`.
- Installed Node dependencies with pnpm.
- Connected the API to local SQL Server database `TheWedding`.
- Enabled SQL Server Mixed Mode and TCP/IP for local TypeORM/Tedious connectivity.
- Created SQL login/database user `TheWeddingApp` for the `TheWedding` database.
- Ran the initial TypeORM migration successfully.
- Seeded default roles, permissions, role-permission mappings, and `admin@example.com`.
- Started API on `http://localhost:4000` and Web on `http://localhost:3000`.

### Files Created or Updated

- `pnpm-lock.yaml`
- `.env.example`
- `package.json`
- `apps/api/package.json`
- `apps/api/src/app.module.ts`
- `apps/api/src/config/env.validation.ts`
- `apps/api/src/database/data-source.ts`
- `apps/api/src/database/typeorm.config.ts`
- `apps/api/src/common/guards/tenant-access.guard.ts`
- `apps/api/src/types/mssql-msnodesqlv8.d.ts`
- `apps/web/tsconfig.json`
- `apps/web/next.config.mjs`
- `apps/web/eslint.config.mjs`
- `packages/shared/src/index.ts`
- `packages/shared/eslint.config.mjs`
- `packages/ui/src/index.ts`
- `packages/ui/eslint.config.mjs`
- `docs/DEVELOPMENT_LOG.md`
- `docs/CHANGELOG.md`
- `docs/ENVIRONMENT_VARIABLES.md`
- `docs/ROADMAP.md`

### Current Capability

- `pnpm install`, `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm build` pass locally.
- API health endpoint returns HTTP 200 at `/api/v1/health`.
- Auth capabilities endpoint returns HTTP 200 at `/api/v1/auth/capabilities`.
- Web dashboard returns HTTP 200 at `/dashboard`.
- Database contains 20 tables, 5 roles, 18 permissions, and one active super admin user.

### Missing

- No real auth/user/tenant/media use cases yet; these begin in Phase 2 and beyond.
- Jest has no API test files yet and is configured with `--passWithNoTests` for the scaffold phase.
- Next-specific ESLint flat-config integration is not added yet; shared ESLint base is used for now.

### Config/Env

- Local `.env` uses SQL login `TheWeddingApp` and is intentionally gitignored.
- SQL Server local instance was changed to Mixed Mode and TCP/IP port 1433.
- The app database is `TheWedding`.

### Related API

- `GET /api/v1/health`
- `GET /api/v1/auth/capabilities`

### Related Tables

- All initial migration tables listed in `docs/DATABASE_DESIGN.md`.

### Tests and Checks

- `pnpm lint`: pass
- `pnpm typecheck`: pass
- `pnpm test`: pass
- `pnpm build`: pass
- SQL migration: pass
- Seed script: pass
- HTTP smoke tests: pass

### Technical Risks

- Local SQL Server was modified from Windows-only auth to Mixed Mode. This is appropriate for the current TypeORM/Tedious setup but should be reviewed before production.
- `msnodesqlv8` support remains available in config, but TypeORM was verified against SQL auth because Windows Auth through TypeORM hangs with the current driver option shape.
