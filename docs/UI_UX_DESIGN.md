# UI/UX Design Direction

## Product Feel

The Wedding frontend should feel youthful, energetic, polished, and emotionally warm for Gen Z and modern young couples. The visual system should be expressive enough for wedding memories, but still clear and efficient for repeated dashboard work.

## Visual Direction

- Use a fresh, dynamic color palette with bright accent colors, soft neutrals, and strong contrast for important actions.
- Avoid a flat one-color theme. Combine a clean base with lively accent colors for status, actions, highlights, and theme previews.
- Keep typography modern, readable, and confident on mobile and desktop.
- Use photography/media-first layouts for public wedding sites and galleries.
- Dashboard and admin screens should stay focused and scannable, with energetic accents used carefully.
- Interactive states should feel alive: hover, focus, active, loading, disabled, success, and error states must be designed, not left as browser defaults.

## UX Principles

- Prioritize smooth, low-friction flows for register, login, tenant setup, upload, gallery browsing, theme customization, and sharing.
- Keep primary actions obvious and reachable on mobile.
- Provide immediate feedback for every mutation: loading state, progress, success, error, and retry path.
- Use skeletons or lightweight placeholders for slow data instead of blank screens.
- Preserve user work during errors where possible, especially form inputs and upload queues.
- Use optimistic UI only where rollback is safe and understandable.
- Keep navigation predictable across public site, owner dashboard, and admin dashboard.
- Respect accessibility basics: keyboard focus, readable contrast, semantic controls, and reduced-motion compatibility.

## Responsive Requirements

- Support mobile-first layouts from small phones through large desktop screens.
- Avoid horizontal overflow at common small widths such as 320px, 360px, 375px, 390px, and 414px.
- Use stable layout constraints for fixed-format UI such as galleries, album grids, toolbars, upload panels, sidebars, and cards.
- Public gallery and lightbox must work comfortably with touch gestures and one-handed phone usage.
- Dashboard forms and tables must adapt to mobile with stacked layouts, compact filters, and usable action menus.
- Admin data-heavy screens must remain readable on tablets and desktops, with mobile fallbacks for core actions.

## Performance And Smoothness

- Target fast route transitions and responsive interactions.
- Avoid layout shift when images, counters, buttons, loading labels, or validation messages appear.
- Optimize media-heavy views with responsive images, lazy loading, pagination or infinite loading, and thumbnail-first rendering.
- Animations should support the task and stay lightweight enough for mid-range phones.
- Upload, reorder, gallery, and lightbox interactions should feel close to 60fps where possible.

## Acceptance Checklist

- Key pages are visually coherent with the youthful wedding brand direction.
- Login, register, dashboard, tenant settings, album, media, theme, public gallery, and admin pages are responsive.
- No text overlaps or escapes its parent container on mobile or desktop.
- Buttons, forms, menus, tabs, uploads, and galleries have complete interaction states.
- Main flows have loading, empty, error, and success states.
- Mobile QA covers at least 320px, 360px, 390px, 414px, 768px, 1024px, and desktop widths.

## i18n/l10n Foundation

- New theme UI strings use stable keys in `apps/web/src/lib/i18n/locales.ts`.
- Initial dictionaries are `vi`, `en`, and `ja`.
- `t(key, locale)` falls back to English and then to the raw key when a translation is missing.
- Future frontend work should add visible text through locale keys, then check mobile layouts in all three initial locales.
