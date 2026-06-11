# GitHub Flow

## Branching

- `main` must stay stable.
- Do not commit directly to `main`.
- Use task branches:
  - `feature/auth-login`
  - `feature/media-bulk-upload`
  - `fix/auth-refresh-token`
  - `docs/update-architecture`
  - `chore/setup-eslint`

## Pull Requests

Every PR must include:

- Goal and user impact.
- Changed files or areas.
- Test evidence.
- Screenshots for UI changes.
- Risk and rollback notes.
- Checklist completion.

## Required Checks

- install
- lint
- typecheck
- unit tests
- backend build
- frontend build
- security audit
- migration check

## Commit Style

Use Conventional Commits:

- `feat: add media bulk upload`
- `fix: handle refresh token rotation`
- `docs: update api design`
- `chore: setup docker`
- `refactor: extract media use cases`

## Current Environment Note

Git CLI is not available in the current Codex terminal, so branch and commit commands cannot be verified here.
