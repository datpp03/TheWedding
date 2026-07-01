# Prompt 08F: Public Wedding Site Visual Redesign & UI QA

PLEASE IMPLEMENT THIS PROMPT.

You are Codex working in the `D:\AJT\TheWedding` monorepo. Follow `AGENTS.md` strictly. This prompt is a focused UI/UX redesign and QA pass for the public wedding site, especially the page shown at `http://localhost:3000/dat-quan-wedding`.

Taste Skill Frontend Rule: Khi task cham frontend/UI/layout/component/form/dashboard/admin/public page/redesign/accessibility/responsive QA, doc `docs/ai/taste-skill-integration.md` va `.cursor/rules/taste-skill-frontend.mdc` truoc khi code; audit man hinh hien tai va giu nguyen API/props/state/permission/routing/business logic neu task chi la UI.

## Carryover Khan Cap Tu Prompt Truoc

- None.

## Muc Tieu

Redesign the public wedding site experience so it feels like a polished wedding gallery instead of a broken/debug layout.

The current page has serious UI/UX problems:

- Too much empty space with content floating in the middle of the page.
- Harsh over-saturated red text and weak color hierarchy.
- Hero area does not feel like a wedding site and does not use media with enough intent.
- Album count badge floats far away from the album content.
- Repeated media appears without a clear story or visual structure.
- Typography, spacing, alignment, and responsive behavior feel unfinished.
- No clear public navigation, CTA, gallery hierarchy, empty state, or error state polish.
- The page must remain SEO/GEO safe and must not expose private/unlisted/admin data.

## Docs Phai Doc Truoc Khi Sua

Read these files first, in this order:

1. `AGENTS.md`
2. `docs/SYSTEM_MAP.md`
3. `docs/PRODUCT_PLAN.md`
4. `docs/PROJECT_OVERVIEW.md`
5. `docs/ROADMAP.md`
6. `docs/UI_UX_DESIGN.md`
7. `docs/SEO_GEO_GUIDELINES.md`
8. `docs/HUONG_DAN_SU_DUNG.md`
9. `docs/DEVELOPMENT_LOG.md`

Use `docs/SYSTEM_MAP.md` to decide where code belongs. If you add a new component folder or route, update `docs/SYSTEM_MAP.md` in the same change.

## Scope

Primary route:

- `apps/web/src/app/(public)/[siteSlug]/page.tsx`

Likely related files:

- `apps/web/src/app/(public)/albums/[albumId]/page.tsx`
- `apps/web/src/features/public-albums/public-album-card.tsx`
- `apps/web/src/features/media/`
- `apps/web/src/lib/i18n/locales.ts`
- `apps/web/src/app/globals.css`
- Any existing public site/theme utilities found through `docs/SYSTEM_MAP.md`

Only touch backend/API if the frontend cannot render a correct public site with the existing data. Do not add new database schema unless it is truly required.

## Product And Design Direction

The public wedding site should be media-first, romantic, calm, and editorial, but still simple enough for real couples to use.

Required design behavior:

- First viewport must immediately signal the couple/site identity, not just tiny metadata.
- Use real uploaded media as the main visual signal when available.
- The first viewport must hint that more gallery/album content exists below.
- Avoid one-note red/pink styling. Use the site/theme accent carefully, but clamp or soften unsafe colors when needed.
- Avoid giant decorative cards and empty marketing layout. This is the actual public experience.
- Keep cards only for repeated album/media items or true framed tools. Do not place page sections inside floating cards.
- Use stable image containers with `aspect-ratio`, `object-fit`, responsive constraints, and skeleton/broken-image fallbacks.
- Text must never overlap, overflow, or become unreadable at mobile widths.
- All new visible UI text must use i18n keys in `apps/web/src/lib/i18n/locales.ts` for `vi`, `en`, and `ja`.

## Detailed Implementation Plan

### 1. Audit Current Public Site

- Inspect the current public site route implementation and data fetching path.
- Identify the exact source of:
  - couple/site title;
  - wedding date;
  - site slug;
  - theme/accent settings;
  - cover image or first available media;
  - albums and media counts;
  - visibility/privacy status.
- Record in `docs/DEVELOPMENT_LOG.md` what route/files were changed and any data limitations discovered.

### 2. Define Layout Architecture

Create a responsive layout plan before editing:

- Hero:
  - site/couple name;
  - wedding date;
  - short intro or welcome message when available;
  - primary CTA to albums/gallery;
  - secondary share/open album action if safe and already supported;
  - large media visual using uploaded media or a graceful fallback.
- Album section:
  - clear section heading;
  - responsive grid/list;
  - album cards with cover, title, date/metadata, media count, and open action;
  - no floating count badge detached from its album.
- Media preview:
  - show a few selected images when available;
  - avoid repeating the same image awkwardly unless there is only one media item;
  - use empty/processing/broken-image states.
- Footer or closing strip:
  - subtle site identity, privacy-safe sharing affordance, or return/home link if already part of the app patterns.

### 3. Implement Visual Redesign

- Rework the public site page into clear sections with constrained content width and balanced whitespace.
- Use a refined palette derived from theme settings plus neutral text/background colors.
- Use typography scale appropriate for public wedding content:
  - hero heading large but not cartoonish;
  - body text readable;
  - metadata and badges subtle.
- Replace harsh colors and default-looking chips with polished UI states.
- Use CSS/responsive utilities already used in the app before inventing a new styling system.
- If a new component folder such as `apps/web/src/features/public-site/` is useful, keep it small and update `docs/SYSTEM_MAP.md`.

### 4. States And Errors

Implement or improve these states:

- Loading/skeleton state for public site content.
- Site not found/unavailable state.
- Private/non-public site guard state if the current route can reach it.
- No album state.
- Album has no media state.
- Media still processing state.
- Broken image fallback.

States must be calm and useful. They should not expose internal IDs, storage keys, stack traces, tenant IDs, admin data, or signed/private media URLs.

### 5. Responsive QA Matrix

Verify the redesigned route at least at:

- `320x640`
- `360x740`
- `390x844`
- `414x896`
- `768x1024`
- `1024x768`
- `1366x768`
- `1440x900`
- `1920x1080`

Pass criteria for each viewport:

- No horizontal scroll.
- No text overlap.
- No button/chip text overflow.
- No image layout shift that breaks the page.
- Hero fits the viewport and hints next content below.
- Album/media cards remain readable and tappable.
- Touch targets are at least 44px where practical.

Use Playwright/browser screenshots if available. If automated browser tooling is unavailable, do manual local browser smoke QA and document what was not verified in a task file under `viec-can-lam/`, then link it from `viec-can-lam/README.md`.

### 6. Accessibility

- Use semantic headings in a logical order.
- Ensure images have meaningful alt text or safe empty alt for decorative fallback.
- Keep contrast readable for theme-derived colors.
- Preserve keyboard focus states.
- Respect reduced motion if adding transitions.
- Do not rely on color alone to communicate visibility/status/counts.

### 7. SEO/GEO And Privacy Gate

Because this is a public route, apply `docs/SEO_GEO_GUIDELINES.md`:

- Add or improve metadata for public site pages when feasible:
  - title;
  - description;
  - Open Graph title/description/image when privacy-safe;
  - canonical URL;
  - robots/index policy based on visibility.
- Do not index private, password-protected, unlisted, admin, auth, signed-media, or unavailable content.
- Do not expose private albums/media or raw storage object keys.
- Structured data is allowed only if it matches the policy and does not reveal private details.
- Keep legacy slug/album URL behavior working.

### 8. Tests And Verification

Run the strongest practical verification:

```powershell
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

If time or environment blocks full checks, run the targeted web checks at minimum and record the skipped commands with reasons:

```powershell
pnpm --filter @the-wedding/web lint
pnpm --filter @the-wedding/web typecheck
pnpm --filter @the-wedding/web test
pnpm --filter @the-wedding/web build
```

Smoke test locally:

- `http://localhost:3000/dat-quan-wedding`
- `http://localhost:3000/albums/{albumSlug}` using a real public album slug from the local API.
- A private/unavailable site or album path if fixture data exists.

If the public page depends on local database migrations, run migrations through the local control panel or:

```powershell
pnpm --filter @the-wedding/api migration:run
```

## Acceptance Criteria

- `http://localhost:3000/dat-quan-wedding` looks intentionally designed and no longer resembles the current screenshot.
- Hero uses real public-safe media when available and has clear couple/site hierarchy.
- Album cards are aligned with their own counts/actions; no detached floating badge.
- Red/pink theme usage is refined and readable, not harsh or one-note.
- Mobile and desktop responsive matrix passes without overlap, overflow, or horizontal scroll.
- Loading, empty, error, unavailable, processing, and broken-media states are present and polished enough for release.
- All new visible strings are localized in `vi`, `en`, and `ja`.
- Public route metadata/canonical/robots behavior follows `docs/SEO_GEO_GUIDELINES.md`.
- Privacy rules remain intact: no private/unlisted/admin/signed-media data leaks.
- Slug URLs continue to work for public site and public album links.
- Verification commands pass, or every blocked command is documented with the exact reason.

## Docs Phai Cap Nhat

Update docs in the same change:

- `docs/DEVELOPMENT_LOG.md`: design gate, files changed, QA screenshots/manual checks, risks.
- `docs/CHANGELOG.md`: public site visual redesign and responsive/SEO fixes.
- `docs/HUONG_DAN_SU_DUNG.md`: how to smoke test the redesigned public site.
- `docs/UI_UX_DESIGN.md`: any new public site layout/state rule that should remain policy.
- `docs/SEO_GEO_GUIDELINES.md`: only if metadata/indexing policy changes.
- `docs/SYSTEM_MAP.md`: only if new folders/routes/modules are added.

## Ban Giao Sau Prompt (Bat Buoc)

After implementation, update:

1. `viec-can-lam/` and `viec-can-lam/README.md`
   - Create/update a task file for any manual QA, production credential/domain, browser screenshot, or product decision that only the user can finish.
   - Use `viec-can-lam/_TEMPLATE.md`, place the file in the right priority folder, and link it from `viec-can-lam/README.md`.
   - Each task file must include prerequisites, exact steps, where to check, expected result, and related docs.
2. Next prompt carryover
   - If urgent UI/SEO/privacy issues remain, create/update a file in `viec-can-lam/00_khan_cap/` and add a short summary plus task link to the top of the next prompt under `## Carryover Khan Cap Tu Prompt Truoc`.
3. `y-tuong-nang-cap/README.md`
   - Add non-blocking future improvements such as guest story sections, timeline modules, music controls, RSVP, map sections, AI cover selection, or theme packs only if they are not already listed.

Do not delete this prompt unless implementation is 100% complete, acceptance passes, docs and handoff files are updated, and commit/push has been completed when requested.
