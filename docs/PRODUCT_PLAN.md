# Product Plan

This is the living product plan for The Wedding. It connects business direction, user workflows, UI/UX standards, feature planning, and the execution method future agents must follow before writing code.

## 1. Product Vision

The Wedding is a multi-tenant SaaS platform for wedding photo and video websites. Couples can create a dedicated public or private wedding site, manage albums, customize visual themes, control access, and share polished memories with guests.

[NEW] The platform uses one shared technical foundation while giving each customer an independent website space, interface, settings, media library, and public sharing experience.

[NEW] The first website screen should be a public home page, not a login wall. It should highlight public albums featured today and this week, while respecting album privacy and only showing content explicitly marked public.

## 2. Users And Segments

- Couples/site owners: create wedding sites, upload albums, customize themes, manage privacy, and share links.
- Guests: view albums, watch videos, download when allowed, and send wishes or reactions where enabled.
- Admin/support users: manage users, tenants, plans, storage, media moderation, audit logs, settings, feature gates, and entitlements.
- [NEW] Studios and photographers: manage multiple clients, create client albums, share review links, deliver online albums, and present professional studio branding.

## 3. Business Model

### B2C SaaS Plans [NEW]

Primary revenue comes from paid wedding website packages for couples.

Plan tiers should be designed around:

- Storage quota.
- Number of photos and videos.
- Maximum file size and video duration.
- Available themes and premium layouts.
- Privacy and security controls.
- Custom domain support.
- Advanced sharing and analytics.

Phase 9 foundation status: implemented as a shared plan catalog and admin-visible scale dashboard. Purchase/self-service upgrade UX remains gated until real MoMo checkout is verified.

### B2B Studio Subscriptions [NEW]

Secondary revenue comes from monthly or yearly subscriptions for studios and photographers.

B2B plans should support:

- Client management.
- Multiple client wedding sites/albums.
- Studio branding.
- Review and delivery links.
- Higher storage quotas.
- Team/member access in later phases.
- Professional dashboard analytics.

Phase 9 foundation status: implemented as studio plan tiers plus `studio_profiles` and `studio_clients` tables/API overview counts. Full studio delivery workflow and team access remain future work.

### Value-Added Services [NEW]

Future add-ons can increase average revenue per account:

- Extra storage.
- Custom domain.
- Premium theme packs.
- Advanced album privacy/security.
- Watermarking.
- Online photo/video editing tools.
- AI classification, search, highlight selection, and image quality optimization.

Phase 9 foundation status: implemented as a gated add-on catalog and admin entitlement unlocks for storage, custom domain, premium themes, security, watermark, AI tools, and online editing placeholders.

## 4. Product Workflows

### Couple Workflow

1. Register or sign in.
2. Create a wedding site.
3. Choose a plan or continue with the available free/basic option.
4. Select a theme preset.
5. Upload photos and videos.
6. Customize colors, typography, album layout, copy, and privacy.
7. Publish the site.
8. Share the link with guests.
9. Review views, downloads, wishes, and upgrade prompts when relevant.
10. Choose the album reaction symbol set when reactions are enabled, such as heart, star, cherry blossom, leaf, fish, or a theme-specific icon.

### Guest Workflow

1. Land on the public home page or open a shared album link.
2. Browse public featured albums from today or this week.
3. Pass privacy/password gates when required for link-only or protected content.
4. Browse albums, gallery, and lightbox.
5. Watch videos and download when allowed.
6. Sign in before sending wishes or reactions.
7. Return to the same album after successful login when the action started from an unauthenticated state.

### Studio/Photographer Workflow [NEW]

1. Subscribe to a B2B plan.
2. Create or import a client profile.
3. Create a wedding site or album for that client.
4. Upload edited deliverables or preview selections.
5. Apply a studio-approved theme/branding preset.
6. Share a review or delivery link.
7. Track client status, quota usage, and delivery progress.

### Admin Workflow [NEW]

1. Manage users, tenants, plans, subscriptions, and entitlements.
2. Set system-wide feature flags and runtime parameters.
3. Configure global theme defaults and primary brand colors.
4. Moderate media and inspect audit logs.
5. Monitor storage, usage, payments, and operational health.
6. Configure seasonal/contextual experiences and automated greetings when those modules exist.

## 5. UI/UX Execution Workflow

Every future UI task must pass this design gate before implementation.

### Step 1: Emotional Screen Analysis [NEW]

For each screen, define:

- The primary emotion: romantic, premium, warm, playful, calm, editorial, or operational.
- The first thing the user must notice.
- The primary action and secondary action.
- The audience context: couple, guest, studio, admin, or support.
- The risk if the screen feels confusing, cold, too busy, or too plain.

### Step 2: Design Proposal [NEW]

Before coding UI, write a concise proposal covering:

- Layout structure.
- Color palette and accent color.
- Typography direction.
- Section spacing.
- Component hierarchy.
- Animation/transition behavior.
- Hover, focus, active, disabled, loading, empty, error, and success states.
- Responsive behavior for mobile, tablet, and desktop.

### Step 3: Design Signoff Before Code [NEW]

Only implement after the screen direction is clear. For future agents, "signoff" can be a documented checklist in the task summary if the user is not actively reviewing a mockup.

The signoff checklist must confirm:

- Primary visual hierarchy is clear.
- Text fits at target widths.
- The design has a real accent color and does not rely only on white/gray.
- Mobile and desktop layouts are explicitly planned.
- Interactive states are defined.
- i18n/l10n text length risk is considered for Vietnamese, English, and Japanese.

## 6. UI Requirements

### Color [NEW]

- Do not ship a flat white/gray-only experience.
- Every major page needs an intentional accent color for actions, active states, links, or meaningful highlights.
- Theme surfaces must support different color/font moods based on album style and customer context.
- Admin surfaces should stay efficient and scannable, but still include controlled brand accents.

### Layout And Spacing [NEW]

- Every section needs breathing room.
- Media-first public pages should let photos and videos lead.
- Dashboard/admin pages should prioritize scanning, repeated work, and clear action placement.
- Avoid cramped controls, accidental horizontal scroll, and unstable layout shift.

### Card Components [NEW]

Cards must show clear visual hierarchy:

- Image or thumbnail.
- Title.
- Subtitle or short description.
- Metadata where useful.
- Primary action.

Cards should not be flat blocks with equal-weight content. Album cards, plan cards, client cards, and media cards must be easy to scan quickly.

### Responsiveness [NEW]

- Support mobile, tablet, and desktop.
- Verify common widths: 320px, 360px, 390px, 414px, 768px, 1024px, and desktop.
- Keep tap targets usable on touch devices.
- Prevent text overflow, overlap, or image controls covering important content.

## 7. Feature Plan

### Core Platform

- Auth, session, CSRF, password reset, and email verification.
- Tenant/site management.
- Album and media management.
- Public gallery and lightbox.
- Theme customization.
- Admin dashboard.
- Runtime system parameters and feature flags.

### SEO/GEO Discoverability [NEW]

Every public-facing feature must follow `docs/SEO_GEO_GUIDELINES.md`.

Implementation notes:

- Public home, public site, public album, custom-domain pages, studio public profiles, and future guide/marketing pages need explicit index policy, canonical URL, Open Graph metadata, sitemap eligibility, and structured data where useful.
- Private, unlisted/link-only, auth, dashboard, admin, payment callback, OAuth callback, signed media, and raw storage routes must be excluded from sitemap and use `noindex`/robots controls where applicable.
- GEO means Generative Engine Optimization: public content should be understandable, citable, and consistent for AI search/answer engines without exposing private data.
- Local/geographic SEO fields such as region, venue, or studio service area require owner/studio opt-in and must not be inferred from EXIF or image content.
- AI crawler policy must be intentional in robots.txt and documented before launch.

### Public Album Discovery And Privacy [NEW]

The public website entry should prioritize album discovery before authentication. Public albums can appear on the home page, search results, and public timeline views. Link-only albums are viewable only with the direct link and must not appear in public discovery. Private albums are visible only to the owner or authorized admins/support users.

Implementation notes:

- Add explicit album privacy levels: `public`, `unlisted`, and `private`.
- Public home page shows featured albums for today and this week, based only on public albums.
- Featured ranking should be deterministic and auditable, using safe aggregate signals such as recent public activity, owner opt-in, admin curation, or allowed analytics events.
- Advanced album search is available after login and supports criteria such as age range, region, time, venue/location, and theme when those fields exist and are safe to expose.
- Search must never reveal private albums or link-only albums without the correct direct link/access path.

Phase 7A implementation status:

- Public web root shows public album discovery instead of a login wall.
- Featured today/week sections use public albums only and a deterministic algorithmic fallback by recency.
- `unlisted` albums are direct-link only and excluded from featured/search.
- `private` albums are excluded from public detail/discovery.
- Authenticated search exists for approved optional metadata fields, with source/consent questions still tracked below.

### Album Wishes And Reactions [NEW]

Logged-in users can send wishes and react to albums. Anonymous users who press a wish or reaction action should be redirected to login and then returned to the exact album/action context after successful authentication.

Implementation notes:

- Wishes are tied to an album and authenticated user identity.
- Reactions are tied to an album, user, and a theme-defined symbol key.
- Reaction symbols are not fixed globally; each album/theme can choose from heart, star, cherry blossom, leaf, fish, or another validated icon/symbol set.
- Prevent duplicate/spam interactions with rate limits and clear per-user uniqueness rules.
- Store and expose only safe public display data for wishes and reactions.
- Write audit/security events for suspicious interaction attempts, moderation actions, and admin changes, without logging passwords, tokens, cookies, OTP codes, or raw provider secrets.

Phase 7A implementation status:

- Authenticated users can send one active wish per album.
- Authenticated users can react once per allowed symbol per album.
- Anonymous users who press social actions are redirected to login and returned to the album/action context.
- Reaction symbols are album-configurable with safe defaults.
- Owner/admin moderation UI remains a later slice.

### OAuth Login And Return Flow [NEW]

Google and Facebook login should extend the existing auth model without bypassing session security, CSRF protections, audit logging, or tenant isolation.

Implementation notes:

- OAuth provider identities should link to existing users by verified email only through a safe account-linking flow.
- Login redirects may preserve a validated `returnTo` path so users return to the album where they started a wish or reaction.
- `returnTo` must be same-origin or an allowlisted relative path to prevent open redirect vulnerabilities.
- Tokens, provider secrets, authorization codes, cookies, and OTP-like values must never be logged or stored in audit metadata.

Phase 7A implementation status:

- OAuth routes validate and preserve safe `returnTo` state and reject open redirects.
- Provider start redirects are available when client IDs are configured.
- Provider callback token exchange and verified-email account linking remain disabled until product rules are confirmed.

### Personal Custom Theme [NEW]

Each album/site should support custom colors or theme presets. Future expansion can support album-level overrides in addition to tenant-level active themes.

Implementation notes:

- Keep theme validation in shared code.
- Store user customizations as structured theme config.
- Provide preview before activation.
- Gate premium themes by plan/entitlement.

### Admin Theme Control [NEW]

Admin should have controls for global brand colors, default theme presets, premium theme availability, and system-wide theme rules.

Implementation notes:

- Use admin-only settings with audit logs.
- Keep tenant/user themes independent from global defaults.
- Expose safe fallback behavior if global settings are missing or invalid.

### Dynamic Contextual Theme [NEW]

The system may adjust tone and effects based on:

- Day/night.
- Weather.
- Season.
- Holidays such as Tet, Mid-Autumn Festival, Christmas, or Valentine.
- Special events such as World Cup.
- User location when permission is granted.

Implementation notes:

- Start as an opt-in feature flag.
- Provide a user-level disable switch.
- Never require location permission for core gallery viewing.
- Use deterministic fallback based on date/time if weather/location is unavailable.
- Keep effects subtle and reduced-motion compatible.

### Automated Greetings [NEW]

The system can trigger greetings for birthdays, wedding anniversaries, Valentine, Tet, proposal anniversaries, or custom dates.

Implementation notes:

- Store greeting rules separately from static album content.
- Allow preview, enable/disable, and schedule validation.
- Use locale keys for greeting templates.
- Audit admin-created global greeting rules.

### Studio/B2B Workspaces [NEW]

Future B2B expansion should support studio profiles, client management, multi-album delivery, branding, team access, and usage reporting.

Implementation notes:

- Model studio accounts without breaking the couple-first tenant model.
- Keep client albums tenant-scoped.
- Make branding configurable but bounded by safe theme validation.

## 8. Detailed Execution Playbook

Future implementation should follow this sequence for efficient delivery.

### 1. Intake And Scope [NEW]

- Read `docs/PRODUCT_PLAN.md`, `docs/ROADMAP.md`, `docs/UI_UX_DESIGN.md`, and the relevant module README.
- Read `docs/SEO_GEO_GUIDELINES.md` when the task changes public routes, metadata, sitemap, robots, custom domains, public discovery, media delivery, marketing/help content, or release QA.
- Identify the target segment: couple, guest, studio, admin, or platform operations.
- Decide whether the feature is MVP, premium, B2B, add-on, or future placeholder.
- Define feature flag, plan gate, entitlement gate, or admin setting if applicable.
- Define SEO/GEO classification if applicable: indexable public page, noindex/private app page, sitemap entry, structured data source, AI crawler policy, and privacy guard.
- Write 3-5 user stories and acceptance criteria before implementation.

### 2. UX Gate [NEW]

- Run the emotional screen analysis.
- Draft the layout/color/spacing/state proposal.
- Confirm responsive behavior and i18n text risk.
- Only then create or modify UI components.

### 3. Technical Design [NEW]

- Define domain boundaries and ownership.
- Decide database tables/columns/migrations.
- Define API endpoints and DTO validation.
- Define permissions, tenant isolation, audit logs, and privacy/security constraints.
- Define i18n keys for every visible string.
- Define analytics/usage events where meaningful.
- Define canonical URL, robots policy, sitemap behavior, Open Graph/Twitter metadata, structured data, `hreflang`/locale metadata, and noindex/privacy rules for public-facing routes.

### 4. Implementation Slices [NEW]

Build in small vertical slices:

1. Shared types/constants/validation.
2. Database migration and repository methods.
3. Application service/use case.
4. Controller/API contract.
5. Frontend API client.
6. UI state and responsive layout.
7. Tests.
8. Docs and user guide updates.

### 5. Verification [NEW]

Each feature must check:

- Format/lint/typecheck.
- Unit tests for domain/use case logic.
- Permission and tenant-isolation tests when data is scoped.
- UI smoke test for loading/empty/error/success states.
- Responsive QA for target widths.
- i18n/l10n coverage for `vi`, `en`, and `ja`.
- SEO/GEO smoke checks for public routes: canonical URL, no private/unlisted leakage, robots/noindex, sitemap filtering, structured data validity, Open Graph preview metadata, and AI crawler policy if touched.
- Docs updated: roadmap, changelog, development log, user guide if behavior changes.

### 6. Rollout [NEW]

- Ship behind feature flags for risky or premium modules.
- Prefer admin-controlled enablement for contextual theme, automated greetings, payments, and AI features.
- Document safe defaults and rollback steps.
- Record known limitations if the feature is a placeholder or partially rolled out.

## 9. Roadmap Mapping

- Phase 7: media processing, optimized images, media versions, and editor foundations.
- [NEW] Public Album Expansion Track: security/scalability foundations, public home and featured albums, wishes/reactions, OAuth login with return-to-album, advanced album search, and audit/admin activity tracing.
- Phase 8: security, reliability, responsive QA, i18n/l10n hardening, and UI polish.
- Phase 9: SaaS plans, payments, entitlements, storage/CDN, custom domain, analytics, user handles, AI foundations, and premium feature gates.
- [NEW] Post-MVP Growth: B2B studio workspaces, contextual themes, automated greetings, advanced online editing, premium theme marketplace, and deeper AI utilities.

## 10. Needs Confirmation [NEW]

- Which source fields should power age, region, venue/location, and time-based album search, and which of those fields require owner opt-in before public or authenticated discovery.
- Whether featured albums are selected by algorithm, admin curation, owner opt-in, or a hybrid ranking.
- Whether each user may send one reaction per album, one reaction per symbol, or multiple reactions over time.
- Whether album wishes need owner moderation before public display.
- Whether Google/Facebook OAuth should support account linking for existing email/password users in the first implementation slice.
