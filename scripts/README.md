# Scripts

This folder contains local setup and operational helpers. Scripts should be small, repeatable, and documented here before use in CI or deployment.

## Local Control Panel

Use `scripts/local-control.ps1` to start/stop local API and Web services, open local URLs, run checks, and inspect logs/errors from one terminal menu. Starting Web from the menu clears stale `apps/web/.next` first and opens `http://localhost:3000` in the default browser.

If Next dev reports a missing chunk such as `Cannot find module './913.js'`, stop Web and choose menu item `18` to clear the Web cache before starting Web again.

If API requests fail because the database is missing a new column or table, choose menu item `19` to run API migrations.

Run it in either way:

```powershell
pnpm local:control
```

or double-click `RUN_LOCAL_CONTROL.cmd` from the repository root.

Runtime state and logs are written to `.local-control/` and ignored by git.
