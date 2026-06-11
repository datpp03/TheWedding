# Testing Strategy

## Backend

- Unit test domain rules and application use cases.
- Unit test guards, decorators, and security helpers.
- Integration test repositories with SQL Server-compatible test database.
- E2E test auth, tenant access, media upload, and admin permissions.

## Frontend

- Smoke test public gallery, auth forms, dashboard pages, and admin pages.
- Test form validation with Zod schemas.
- Test gallery/lightbox interactions once media UI is implemented.

## Security

- Login brute-force and lockout behavior.
- Unauthorized and cross-tenant access denial.
- Invalid file upload denial.
- Expired token and refresh token reuse.
- Download permission checks.

## Phase 1 Status

Test scripts are configured. They were not executed in this environment because Node.js and pnpm are not available in PATH.
