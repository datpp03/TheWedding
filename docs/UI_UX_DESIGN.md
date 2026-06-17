# UI/UX Design Direction

## Product Feel

The Wedding frontend should feel youthful, energetic, polished, and emotionally warm for Gen Z and modern young couples. The visual system should be expressive enough for wedding memories, but still clear and efficient for repeated dashboard work.

## Design Execution Workflow [NEW]

Every UI task must complete this workflow before code:

1. Emotional screen analysis: define the intended feeling, target user, first-look hierarchy, primary action, secondary action, and the risk if the screen feels confusing or too plain.
2. Design proposal: describe layout, palette, accent color, typography, spacing, animation, and hover/focus/active/disabled/loading/empty/error/success states.
3. Design signoff: confirm the screen direction is clear before implementation. If no separate mockup exists, record the signoff checklist in the task summary or development log.

Required signoff checks:

- The first visual element the user should notice is intentional.
- The page has a clear accent color and does not rely only on white/gray.
- Spacing and section rhythm are planned for mobile, tablet, and desktop.
- Text length is considered for Vietnamese, English, and Japanese.
- All interactive and async states are defined.

## Visual Direction

- Use a fresh, dynamic color palette with bright accent colors, soft neutrals, and strong contrast for important actions.
- Avoid a flat one-color theme. Combine a clean base with lively accent colors for status, actions, highlights, and theme previews.
- [NEW] Do not ship white/gray-only pages. Every major screen needs a purposeful accent color for actions, active states, highlights, or emotional emphasis.
- [NEW] Theme surfaces may use different colors and fonts by context so wedding sites, studio albums, admin tools, and seasonal experiences do not feel visually identical.
- Keep typography modern, readable, and confident on mobile and desktop.
- Use photography/media-first layouts for public wedding sites and galleries.
- Dashboard and admin screens should stay focused and scannable, with energetic accents used carefully.
- Interactive states should feel alive: hover, focus, active, loading, disabled, success, and error states must be designed, not left as browser defaults.

## Component Requirements [NEW]

- Section spacing must create breathing room and avoid dense blocks of unrelated content.
- Card hierarchy must be obvious: image/thumbnail, title, subtitle, metadata if useful, and primary action.
- Album, media, plan, client, and admin cards must be scannable at a glance.
- Buttons and controls must remain stable when labels, counters, loading states, or validation messages change.
- Public pages should prioritize media and emotional storytelling; dashboard/admin pages should prioritize repeated work and decision speed.
- [NEW] The public home page should be the first website screen and should make featured public albums from today and this week immediately visible before asking users to log in.
- [NEW] Album wish/reaction controls must communicate login-required state clearly, redirect smoothly, and restore the same album context after successful login.
- [NEW] Reaction icons should fit the album/theme mood and may vary by album, such as heart, star, cherry blossom, leaf, fish, or another validated symbol.

## UX Principles

- Prioritize smooth, low-friction flows for register, login, tenant setup, upload, gallery browsing, theme customization, and sharing.
- Keep primary actions obvious and reachable on mobile.
- Provide immediate feedback for every mutation: loading state, progress, success, error, and retry path.
- Use skeletons or lightweight placeholders for slow data instead of blank screens.
- Preserve user work during errors where possible, especially form inputs and upload queues.
- Use optimistic UI only where rollback is safe and understandable.
- Keep navigation predictable across public site, owner dashboard, and admin dashboard.
- Respect accessibility basics: keyboard focus, readable contrast, semantic controls, and reduced-motion compatibility.
- [NEW] Contextual effects such as day/night, weather, holiday, or greeting animations must be subtle, optional, and reduced-motion compatible.

## Responsive Requirements

- Support mobile-first layouts from small phones through large desktop screens.
- Avoid horizontal overflow at common small widths such as 320px, 360px, 375px, 390px, and 414px.
- Use stable layout constraints for fixed-format UI such as galleries, album grids, toolbars, upload panels, sidebars, and cards.
- Public gallery and lightbox must work comfortably with touch gestures and one-handed phone usage.
- Public home featured-album cards must remain stable across daily/weekly data changes, long album titles, and variable reaction/wish counts.
- Dashboard forms and tables must adapt to mobile with stacked layouts, compact filters, and usable action menus.
- Admin data-heavy screens must remain readable on tablets and desktops, with mobile fallbacks for core actions.
- [NEW] Text must never overlap images, controls, previous content, or next content. If a label is long, wrap or resize the container before shrinking the entire viewport layout.

## Performance And Smoothness

- Target fast route transitions and responsive interactions.
- Avoid layout shift when images, counters, buttons, loading labels, or validation messages appear.
- Optimize media-heavy views with responsive images, lazy loading, pagination or infinite loading, and thumbnail-first rendering.
- Animations should support the task and stay lightweight enough for mid-range phones.
- Upload, reorder, gallery, and lightbox interactions should feel close to 60fps where possible.
- [NEW] Dynamic contextual themes and automated greetings must not block first render; use safe fallbacks and load optional effects progressively.

## Acceptance Checklist

- Key pages are visually coherent with the youthful wedding brand direction.
- Login, register, dashboard, tenant settings, album, media, theme, public gallery, and admin pages are responsive.
- No text overlaps or escapes its parent container on mobile or desktop.
- Buttons, forms, menus, tabs, uploads, and galleries have complete interaction states.
- Main flows have loading, empty, error, and success states.
- Mobile QA covers at least 320px, 360px, 390px, 414px, 768px, 1024px, and desktop widths.
- [NEW] UI work includes a short design signoff note covering emotion, first-look hierarchy, accent color, spacing, states, and responsive behavior.

## Phase 7A Public Album Signoff

- Public home emotion: warm, editorial, and guest-friendly.
- First-look hierarchy: public featured album sections appear before any login requirement.
- Accent color: rose for primary discovery actions, teal for safe/privacy cues, amber for social metadata.
- Card hierarchy: featured cards include thumbnail, title, tenant slug subtitle, description fallback, media/wish/reaction metadata, and primary open action.
- Interaction states: public home includes empty state; album detail includes login-required social state, pending/success/error social feedback, and empty wishes/media states.
- Responsive plan: cards use one column on small phones, two on tablet, and three on desktop; text wraps instead of shrinking below readable sizes.
- Reduced-motion: hover lift is small and non-essential; no blocking contextual animation is introduced.

## i18n/l10n Foundation

- New theme UI strings use stable keys in `apps/web/src/lib/i18n/locales.ts`.
- Initial dictionaries are `vi`, `en`, and `ja`.
- `t(key, locale)` falls back to English and then to the raw key when a translation is missing.
- Future frontend work should add visible text through locale keys, then check mobile layouts in all three initial locales.
- During development, missing keys must remain visibly diagnosable by falling back to English and then the raw key, never to an empty string.
- QA for changed screens must smoke test Vietnamese, English, and Japanese at 320px, 360px, 390px, 414px, 768px, 1024px, and desktop widths, with special attention to long labels in buttons, cards, form errors, table cells, and status badges.
- Reduced-motion QA must verify existing animations and future contextual theme/greeting effects remain optional, subtle, and compatible with `prefers-reduced-motion`.
