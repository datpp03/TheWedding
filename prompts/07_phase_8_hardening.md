# Prompt 07: Phase 8 Enterprise Hardening

PLEASE IMPLEMENT THIS PROMPT.

Ban dang lam trong repo `D:\AJT\TheWedding`. Hay bat dau Phase 8.

## Muc Tieu

Hardening security, reliability, monitoring, backup, QA va frontend polish truoc khi release.

## Backend/Security Tasks

- MFA foundation or at least MFA-ready model/interfaces.
- Advanced rate limit for auth/upload/admin.
- Request correlation ID.
- Structured safe logging without secrets.
- Security headers review.
- CSRF review and tests.
- Refresh token reuse e2e tests.
- Backup/restore documentation for SQL Server.
- Feature flag hardening.

## Frontend UX Tasks

- Cross-device QA for major flows.
- Fix layout shift, overflow, text overlap, broken touch targets.
- Add reduced-motion compatibility where animations exist.
- Add polished empty/loading/error/success states across key pages.
- Review Gen Z visual direction consistency.

## Testing Tasks

- Add security tests:
  - brute-force lock/rate limit.
  - invalid CSRF.
  - expired token.
  - refresh reuse.
  - unauthorized download.
  - cross-tenant denial.
- Add responsive screenshot/browser checks where available.
- Run full verification.

## Docs

- Update security, deployment, testing, troubleshooting, roadmap, changelog, development log.

## Acceptance Criteria

- Security-critical flows have automated tests.
- UI is stable across target screen sizes.
- Release risk list is documented.
- Commit va push len `origin/main`.
