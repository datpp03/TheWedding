# Project Overview

## Product Summary

The Wedding is a multi-tenant wedding media platform. Couples can create a dedicated public or private wedding site, upload photo/video albums, customize the visual theme, control downloads, and share protected links with guests.

[NEW] Product direction: The Wedding is a SaaS platform for wedding photo/video websites. It uses one shared platform while each customer gets an independent website space, interface, media library, settings, and public sharing experience. The detailed living product plan is maintained in `docs/PRODUCT_PLAN.md`.

[NEW] Public entry direction: the first website screen should be a public home page with featured public albums for today and this week, not a forced login page.

## Primary Users

- Couples and site owners: manage sites, albums, media, themes, sharing, storage quota, and premium feature unlocks.
- Guests: view public or invited albums, watch videos, download media when allowed, and sign in before sending wishes or reactions.
- Support/admin users: manage users, tenants, storage, audit logs, security events, system settings, feature gates, plans, subscriptions, payments, and manual entitlement unlocks.
- [NEW] Studios and photographers: subscribe to B2B plans, manage multiple clients, create professional online albums, share review/delivery links, and apply studio branding.

## Business Model [NEW]

- B2C SaaS plans for couples, tiered by storage, number of photos/videos, premium themes, privacy/security controls, custom domains, and advanced sharing/analytics.
- B2B studio subscriptions for studios and photographers, focused on client management, multiple albums, studio branding, review/delivery workflows, and higher storage quotas.
- Value-added services such as extra storage, custom domains, premium themes, advanced privacy, watermarking, online editing, and AI classification/search/quality optimization.

## MVP Outcomes

- Enterprise-ready project foundation with documentation-first workflow.
- NestJS API scaffolded around Clean Architecture and DDD.
- Next.js App Router frontend scaffolded around public, auth, dashboard, and admin areas.
- Youthful, energetic, Gen Z-friendly UI direction with smooth UX and fully responsive layouts across phones, tablets, and desktop screens.
- PostgreSQL schema migration covering users, auth, tenants, albums, media, themes, permissions, audit, settings, storage, and feature flags.
- Docker and CI foundations for local development and future deployment.
- CI/CD deployment plan for Docker image build, registry push, VPS pull, and container restart.

## Experience Direction

- Public wedding sites should feel emotional, modern, media-rich, and shareable.
- Owner dashboard flows should be fast, smooth, and friendly for young couples managing albums, uploads, themes, and links.
- Admin screens should stay clear and efficient while still matching the modern product visual language.
- [NEW] Studio workflows should feel professional, repeatable, and status-driven for client delivery work.
- [NEW] Every future UI task must follow the design gate in `docs/PRODUCT_PLAN.md`: emotional screen analysis, layout/color/state proposal, and design signoff before coding.
- All frontend work must follow `docs/UI_UX_DESIGN.md`.

## Non-MVP Future Capabilities

- Payments and subscription plans, starting with MoMo and keeping a provider-adapter path for more payment methods later.
- Cloudflare R2-backed production media storage with backend image resize/compression, optimized derivatives, private originals, and CDN-friendly delivery.
- Admin-managed runtime system parameters, including toggles for registration, login, read-only guest mode, feature availability, upload limits, and maintenance behavior.
- User-chosen public handles similar to TikTok IDs, used in public album paths so duplicate album names across users remain personal and unambiguous.
- Public album discovery with featured albums by day/week, authenticated advanced search by age range, region, time, venue/location, and theme, and strict privacy rules for public, unlisted, and private albums.
- Album wishes and theme-defined reactions that require login, redirect anonymous users to auth, and return them to the same album after successful login.
- Google and Facebook OAuth login integrated with the existing secure session model.
- CDN integration, custom domains, watermarking, AI tagging/search.
- Guest comments, guest uploads, analytics, notifications, and media marketplace features.
- [NEW] Album/site-level custom theme expansion, admin global theme controls, contextual day/night/weather/season/holiday theme rules, and automated greetings for birthdays, wedding anniversaries, Valentine, Tet, and custom dates.
- [NEW] Studio/B2B workspaces with client management, delivery status, branding controls, team access later, and professional reporting.
