# Taste Skill Frontend Design Integration

> Purpose: bring the useful parts of `Leonxlnx/taste-skill` into The Wedding as an internal design guidance layer. This is not an installed dependency, not a runtime package, and not permission to change business logic.

## Taste Skill In This Project

Taste Skill is treated as an anti-generic frontend design rule set for AI agents. In this project it helps agents make UI decisions with better taste, stronger hierarchy, clearer spacing, better responsive behavior, and fewer common AI-generated design defaults.

For The Wedding, Taste Skill complements:

- `docs/UI_UX_DESIGN.md`
- `docs/PRODUCT_PLAN.md`
- `docs/SEO_GEO_GUIDELINES.md`
- `AGENTS.md`
- `.cursor/rules/taste-skill-frontend.mdc`

Taste Skill does not replace Clean Architecture, DDD boundaries, permissions, i18n rules, SEO/GEO privacy policy, or the existing design direction of the product.

## When Agents Must Apply Taste Skill

Apply this guidance whenever a task touches:

- Frontend UI, page design, layout, spacing, typography, color, motion, or visual hierarchy.
- Public home, wedding site, public album, gallery, social panel, auth pages, dashboard, admin, settings, forms, tables, cards, upload surfaces, or theme UI.
- Redesign, visual QA, responsive QA, accessibility QA, or UI polish.
- Prompt or docs that define future frontend behavior.

Before coding UI, the agent must read the current component/page, understand data flow, props, state, API calls, permissions, loading/error/empty states, and i18n keys.

## When Agents Must Not Apply Taste Skill

Do not apply Taste Skill as a reason to:

- Change backend logic, database schema, API contracts, authentication, authorization, tenant isolation, routing, or feature gates.
- Rename functions, routes, DTOs, props, components, or state just for aesthetics.
- Remove validation, permission checks, loading states, error states, empty states, CSRF/session behavior, audit behavior, or SEO/GEO privacy guards.
- Add UI libraries, animation libraries, icon libraries, fonts, or image services without checking existing dependencies and getting approval when needed.
- Turn operational SaaS screens into marketing pages.
- Use experimental visuals where clarity, speed of action, or trust is more important.

## Project Design Read

Default read for The Wedding:

- Public wedding pages: emotional, media-first, warm, polished, romantic, modern, and shareable.
- Owner dashboard: friendly, efficient, scannable, and action-oriented for repeated album/media/theme work.
- Admin dashboard: quiet, dense enough for operations, clear hierarchy, strong table/form ergonomics, and restrained brand accents.
- Studio/B2B future screens: professional, repeatable, status-driven, and workflow-oriented.

For public pages, allow higher visual expression. For dashboards/admin, use Taste Skill mainly to prevent generic UI and improve hierarchy, spacing, states, and readability.

## Core UI/UX Rules

- Start with a one-line design read: page kind, audience, vibe, and design foundation.
- Audit the existing screen before redesigning it.
- Keep one clear primary action per view or workflow step.
- Use the existing app patterns first: Next.js App Router, current components, shared UI primitives, Tailwind/CSS conventions already present, and `apps/web/src/lib/i18n/locales.ts`.
- Use visible text through i18n keys for `vi`, `en`, and `ja`.
- Design loading, empty, error, success, disabled, hover, focus, and active states.
- Do not ship white/gray-only screens. Use a purposeful accent color, but keep it consistent.
- Avoid generic AI defaults: random purple gradients, centered hero over dark mesh, three equal cards everywhere, decorative glassmorphism, fake screenshots, and animation for its own sake.
- Public pages should use real public-safe media or clearly documented placeholders. Do not expose private/unlisted/signed media.
- Dashboard and admin pages should prioritize clarity, scan speed, and data/form ergonomics over spectacle.

## Layout, Spacing, Typography, Hierarchy, Motion

### Layout

- Prefer grids with explicit responsive behavior over fragile flex percentage math.
- Every multi-column section must define the mobile fallback.
- Public pages may use asymmetry, editorial rhythm, and media-forward sections.
- Dashboards/admin should use predictable navigation, stable panels, compact filters, and responsive table/card fallbacks.
- Do not repeat the same section pattern across a full page unless there is a product reason.

### Spacing

- Use section rhythm deliberately. Avoid cramped unrelated blocks.
- Controls must not jump when labels, counters, loading text, or validation errors appear.
- Fixed-format UI such as galleries, cards, toolbars, upload panels, and admin controls needs stable dimensions.

### Typography

- Keep headings sized to their container. Hero-scale type belongs only in true hero surfaces.
- Use readable line length and avoid dense paragraphs in UI panels.
- Account for Vietnamese, English, and Japanese text length before shipping.
- Do not rely on placeholder text as labels.

### Hierarchy

- Make the first visual thing intentional.
- Separate primary, secondary, and destructive actions.
- Cards need clear hierarchy: visual/thumbnail, title, subtitle/metadata, and action.
- Tables/forms need labels, helper/error placement, and keyboard/focus clarity.

### Motion

- Use motion to clarify state changes, not to decorate.
- Keep dashboard/admin motion restrained.
- Respect `prefers-reduced-motion`.
- Do not add animation dependencies unless the existing stack already supports the need or the user approves.

## Anti Generic UI / AI Slop Rules

- Do not default to centered hero, generic gradient blobs, equal feature-card grids, or fake product previews.
- Do not use decorative cards for every section.
- Do not create cards inside cards.
- Do not use arbitrary color palettes per section. Pick a page-level accent logic and keep it consistent.
- Do not add decorative labels, badges, micro-eyebrows, or counters unless they carry real information.
- Do not use hand-rolled SVG illustrations when an existing icon/component/media asset is the right tool.
- Do not add placeholder production data or fake operational metrics.
- Do not make dashboards look like landing pages.
- Do not hide complexity by removing states, validation, or permission feedback.

## Preserve Business Logic

For UI-only tasks, keep these unchanged unless explicitly requested:

- API routes and response shapes.
- Auth/session/CSRF behavior.
- Permissions and tenant isolation.
- Form validation and server validation.
- State management contracts and props.
- Feature flags, plan gates, admin settings, and entitlement behavior.
- SEO/GEO privacy boundaries.
- Audit logging and redaction behavior.

## Checklist Before Editing Frontend

- Read the current page/component and related feature API client.
- Identify user segment: couple, guest, studio, admin, or support.
- Identify surface type: public marketing/discovery, auth, dashboard, admin, or embedded component.
- Write the design read.
- Audit current layout, spacing, hierarchy, states, responsive behavior, and i18n risk.
- Confirm what must not change: API contract, props, state, permissions, route, SEO/GEO policy.
- Check existing component/design patterns before adding new ones.
- Check `package.json` before importing any dependency.
- Decide whether this is a public expressive screen or an operational workflow screen.

## Checklist After Editing Frontend

- Loading, empty, error, success, disabled, hover, focus, and active states are preserved or improved.
- No text overlap or horizontal overflow at 320, 360, 390, 414, 768, 1024, and desktop widths.
- i18n keys exist for `vi`, `en`, and `ja`.
- The screen has a clear hierarchy and one obvious primary path.
- Public pages do not leak private/unlisted/admin/auth/signed-media data.
- Dashboard/admin pages remain efficient for repeated work.
- No new dependency was added without a clear need and approval.
- Existing tests/checks still pass or skipped checks are documented with reasons.
- Development log or final summary includes a short design signoff for changed screens.

## Links To Rules, Prompts, And Plans

- `AGENTS.md`: agent-level requirement for frontend work.
- `.cursor/rules/taste-skill-frontend.mdc`: Cursor-compatible rule.
- `docs/UI_UX_DESIGN.md`: product-specific UI/UX design direction.
- `docs/PRODUCT_PLAN.md`: business/workflow/design gate.
- `docs/ROADMAP.md`: active product and UI execution gate.
- `prompts/README.md`: prompt workflow instruction.
- Active prompt files in `prompts/`: each prompt should reference this doc when frontend work is in scope.

## Source References

- Taste Skill repository: `Leonxlnx/taste-skill`.
- Default skill reviewed: `skills/taste-skill/SKILL.md`, install name `design-taste-frontend`.
- Integration note: the upstream skill says its rules are contextual and should be pulled only when they fit the brief. This project narrows that guidance for The Wedding's public, dashboard, admin, and studio surfaces.
