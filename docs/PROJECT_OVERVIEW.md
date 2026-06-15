# Project Overview

## Product Summary

The Wedding is a multi-tenant wedding media platform. Couples can create a dedicated public or private wedding site, upload photo/video albums, customize the visual theme, control downloads, and share protected links with guests.

## Primary Users

- Couples and site owners: manage sites, albums, media, themes, sharing, storage quota, and premium feature unlocks.
- Guests: view public or invited albums, watch videos, and download media when allowed.
- Support/admin users: manage users, tenants, storage, audit logs, security events, system settings, feature gates, plans, subscriptions, payments, and manual entitlement unlocks.

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
- All frontend work must follow `docs/UI_UX_DESIGN.md`.

## Non-MVP Future Capabilities

- Payments and subscription plans, starting with MoMo and keeping a provider-adapter path for more payment methods later.
- Cloudflare R2-backed production media storage with backend image resize/compression, optimized derivatives, private originals, and CDN-friendly delivery.
- Admin-managed runtime system parameters, including toggles for registration, login, read-only guest mode, feature availability, upload limits, and maintenance behavior.
- User-chosen public handles similar to TikTok IDs, used in public album paths so duplicate album names across users remain personal and unambiguous.
- CDN integration, custom domains, watermarking, AI tagging/search.
- Guest comments, guest uploads, analytics, notifications, and media marketplace features.
