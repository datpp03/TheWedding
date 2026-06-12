# Changelog

All notable changes to this project will be documented in this file.

## 0.1.0 - 2026-06-12

### Added

- Phase 0 documentation foundation.
- Phase 1 monorepo scaffold.
- API and web app skeletons.
- Shared package skeletons.
- SQL Server initial schema migration draft.
- Docker Compose for SQL Server and Redis.
- GitHub Flow templates and CI workflow.

### Changed

- Added local SQL Server configuration for database `TheWedding`.
- Added TypeORM support for SQL auth and optional Windows Auth config.
- Updated migration scripts to run reliably on Windows through Node.
- Added flat ESLint configs for workspace packages.
- Updated package exports and TypeScript config so lint, typecheck, and build pass.

### Verified

- Installed dependencies with pnpm.
- Ran initial migration and seed against local SQL Server.
- Verified API and Web with HTTP smoke tests.
- Added Phase 2 auth unit coverage for register, login failure, refresh rotation, and refresh token reuse detection.

### Added

- Database-backed auth and user foundation.
- JWT access tokens in HttpOnly cookies.
- Refresh token rotation with hashed refresh secrets in `user_sessions`.
- Session listing and revocation endpoints.
- Frontend login/register forms connected to the API.
- Dashboard auth status and sign out action.
