# Prompt 08: Phase 9 Scale & Future Features

PLEASE IMPLEMENT THIS PROMPT.

IMPORTANT PROMPT LIFECYCLE: Chi xoa file prompt nay sau khi hoan thanh tat ca muc trong prompt, pass verification, cap nhat docs, commit va push thanh cong. Neu con bat ky hang muc nao chua xong, giu nguyen file prompt va ghi ro phan con lai.

Ban dang lam trong repo `D:\AJT\TheWedding`. Hay bat dau Phase 9.

Truoc khi lam, doc `docs/PRODUCT_PLAN.md`, `docs/PROJECT_OVERVIEW.md`, `docs/ROADMAP.md`, `docs/UI_UX_DESIGN.md`, `docs/STORAGE_STRATEGY.md`, va cac docs module lien quan. [NEW]

## Muc Tieu

Them nen tang cho scale/future: SaaS business model, payment/plans, B2B studio subscription foundation, value-added services, Cloudflare R2 production storage, CDN, custom domain, watermark, AI tagging, analytics, user public handles, theme automation, va greeting automation. Co the chia nho neu qua lon. [NEW]

## Tasks

- Product/business alignment [NEW]:
  - Map every implemented feature to `docs/PRODUCT_PLAN.md`.
  - Distinguish B2C couple package, B2B studio subscription, add-on/value-added service, admin-only control, and future placeholder.
  - Use feature flags, plan gates, entitlement gates, or system parameters for incomplete/risky/premium features.
  - Keep docs clear when a feature is implemented, placeholder-only, or intentionally deferred.
- Plans/subscriptions foundation:
  - plan table/model neu can.
  - usage limits.
  - feature gates.
  - storage quota upgrades for photo/video uploads.
  - [NEW] B2C package tiers by storage, photo/video count, max file size, video support, premium themes, custom domain, privacy/security, analytics, and support level.
  - [NEW] B2B studio subscription tiers for multiple clients, multiple albums, studio branding, higher quotas, review/delivery links, and future team access.
  - [NEW] add-on/value-added services: extra storage, custom domain, premium themes, advanced security, watermark, online editing, AI classification/search/quality optimization.
  - advanced utility unlocks for premium users.
  - admin-granted entitlements so admin can manually unlock/revoke premium rights, storage boosts, or features for any user/tenant.
  - payment provider adapter with MoMo as the first provider and placeholders/interfaces for later providers.
  - MoMo checkout/webhook flow with idempotent payment event handling if implementing the real provider in this phase.
- CDN/storage production readiness:
  - Do not require the owner to enable or subscribe to Cloudflare R2 before the adapter is implemented and verified.
  - Keep production on `STORAGE_PROVIDER=local` until this phase delivers the R2 path end to end.
  - Cloudflare R2 as the first production provider through S3-compatible config.
  - Vietnamese setup guide for Cloudflare account registration, R2 bucket creation, access key generation, env configuration, CORS if direct uploads are exposed, and smoke testing.
  - signed URLs.
  - cache/CDN docs.
  - direct-to-object-storage upload sessions for web and future React Native clients.
  - multipart upload sessions for large mobile videos.
  - migration path from local storage to object storage if local media already exists.
  - keep provider implementation behind `StorageService`, following `docs/STORAGE_STRATEGY.md`.
  - preserve target flow: original upload -> backend resize/compress -> store original and optimized versions in R2 -> frontend displays optimized media.
- User public handle and album URL foundation:
  - unique user public handle, similar to TikTok ID.
  - handle availability check and profile/settings update.
  - canonical public album URLs include the user handle, e.g. `/@{userHandle}/{siteSlug}/albums/{albumSlugOrShortId}`.
  - old public routes redirect or continue during migration.
  - duplicate album display names are allowed across users and resolved by handle plus stable album slug/id.
- Public album/social continuation [NEW]:
  - If `07a_public_album_social_expansion.md` has not been completed, do not silently implement partial wishes/reactions/search inside this broad phase; update docs and ask/split the work first.
  - If it has been completed, keep scale features compatible with public/unlisted/private privacy rules, login-required interactions, and audit redaction.
  - Analytics and premium discovery features must not reveal private or unlisted albums.
- B2B studio foundation [NEW]:
  - studio profile model/API placeholder or implementation.
  - studio client list model/API placeholder or implementation.
  - link studio clients to tenant/site/album delivery workflows without breaking tenant isolation.
  - studio branding settings, safely validated through theme constraints.
  - delivery/review link placeholder if full workflow is too large.
  - admin visibility for studio accounts/subscriptions if B2B is implemented.
- Custom domain foundation:
  - domain model.
  - verification status.
  - deployment docs.
- Theme monetization and automation [NEW]:
  - album/site custom theme expansion if needed beyond current tenant active theme.
  - premium theme gates by plan/entitlement.
  - admin theme control for global default colors, default presets, premium theme availability, and safe fallback config.
  - dynamic contextual theme resolver behind feature flag/system parameter.
  - contextual inputs: day/night, season, holiday/festival, special event, optional weather, optional location.
  - user/admin opt-out controls and reduced-motion compatibility.
  - safe fallback when location/weather provider is unavailable or permission is denied.
- Automated greetings [NEW]:
  - greeting rule model/API placeholder or implementation.
  - supported triggers: birthday, wedding anniversary, Valentine, Tet, proposal anniversary, and custom dates.
  - preview, enable/disable, schedule validation, and i18n/l10n templates.
  - admin-managed global greeting rules must write audit logs.
- Watermark foundation:
  - tenant setting.
  - processing hook.
- AI tagging foundation:
  - interface/adapter.
  - tag storage.
  - opt-in setting.
- Analytics foundation:
  - gallery views/download events.
  - basic dashboard stats.

## UX

- Follow `docs/PRODUCT_PLAN.md` UI execution workflow before coding any new UI: emotional screen analysis, layout/color/spacing/state proposal, and design signoff note. [NEW]
- Keep all new feature surfaces clear, mobile responsive, and aligned with `docs/UI_UX_DESIGN.md`.
- [NEW] Do not ship white/gray-only new surfaces; add purposeful accent color, spacing, and visual hierarchy.
- [NEW] Plan cards, add-on cards, studio client cards, theme cards, and greeting/context cards must have clear hierarchy: image/icon/thumbnail, title, subtitle, metadata, and primary action.
- Gate unavailable premium/future features gracefully without frustrating users.
- Show storage quota and premium unlock states clearly in dashboard/admin surfaces.
- Handle payment pending/success/failure/cancel states cleanly for MoMo.
- [NEW] Contextual themes and greetings must feel subtle, optional, accessible, and reduced-motion compatible.
- [NEW] Studio workflows should feel professional and repeatable rather than marketing-heavy.
- All new visible copy must use existing i18n/l10n key patterns and include `vi`, `en`, `ja` translations.

## Tests

- Unit tests for feature gates and usage limits.
- Unit tests for entitlement overrides, storage quota checks, MoMo webhook idempotency if implemented, and handle uniqueness.
- [NEW] Unit tests for plan/add-on classification, B2B studio access boundaries if implemented, premium theme gates, contextual theme resolver fallback, and greeting schedule windows.
- Smoke tests for analytics events and admin visibility.
- [NEW] Responsive smoke checks for plan/subscription, studio, theme/admin-control, contextual theme, and greeting UI surfaces that are implemented.
- Run full verification.

## Docs

- Update `docs/PRODUCT_PLAN.md`, architecture, API design, database design, testing strategy, environment variables, deployment, roadmap, changelog, development log.
- Update `docs/HUONG_DAN_SU_DUNG.md` bang tieng Viet de huong dan cac feature moi nhu plan/subscription, MoMo payment, admin entitlement unlocks, user handle/album URLs, custom domain, analytics, watermark, AI tagging, Cloudflare R2/CDN/storage production va upload sessions neu duoc expose ra UI/API.
- [NEW] If B2B studio, contextual themes, automated greetings, premium themes, extra storage, custom domains, or add-ons are implemented or exposed, update the Vietnamese user guide with step-by-step usage and limitations.
- Update i18n/l10n locale files and docs for plan names, feature gates, analytics labels, domain statuses, storage messages, and future-feature copy.

## Acceptance Criteria

- Future-scale features have clean interfaces and safe placeholders.
- No half-wired provider secrets are required for local dev.
- Cloudflare R2 setup and MoMo setup are documented before requiring real credentials.
- R2 is only enabled in Render after adapter code, env validation, upload/download smoke tests, and rollback docs are complete.
- Admin can unlock premium/storage entitlements manually if this phase implements entitlement UI/API.
- Public album URL planning/implementation includes user handle to avoid cross-user duplicate-name ambiguity.
- Future-feature UI copy is managed through locale keys for Vietnamese, English, and Japanese.
- [NEW] B2C SaaS packages, B2B studio subscription direction, and value-added services are represented in the plan/docs and implemented behind gates where code exists.
- [NEW] Custom theme expansion, admin theme control, dynamic contextual theme, and automated greetings are either implemented safely or documented as gated placeholders with clear next steps.
- [NEW] New UI surfaces pass the design gate from `docs/PRODUCT_PLAN.md` and responsive requirements from `docs/UI_UX_DESIGN.md`.
- Commit va push len `origin/main`.
