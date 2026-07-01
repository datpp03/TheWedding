# Prompt 08: Phase 9 Scale & Future Features

PLEASE IMPLEMENT THIS PROMPT.

IMPORTANT PROMPT LIFECYCLE: Chi xoa file prompt nay sau khi hoan thanh tat ca muc trong prompt, pass verification, cap nhat docs, commit va push thanh cong. Neu con bat ky hang muc nao chua xong, giu nguyen file prompt va ghi ro phan con lai.

TRUOC KHI BAT DAU: Doc `AGENTS.md` va `docs/SYSTEM_MAP.md` de biet cau truc thu muc, file lien quan, va quy tac ban giao (tiet kiem token, khong quet lai toan repo). Neu muc `## Carryover Khan Cap Tu Prompt Truoc` ben duoi co noi dung, xu ly cac muc do TRUOC.

Taste Skill Frontend Rule: Khi task cham frontend/UI/layout/component/form/dashboard/admin/public page/redesign/accessibility/responsive QA, doc `docs/ai/taste-skill-integration.md` va `.cursor/rules/taste-skill-frontend.mdc` truoc khi code; audit man hinh hien tai va giu nguyen API/props/state/permission/routing/business logic neu task chi la UI.

## Carryover Khan Cap Tu Prompt Truoc

(Trong. Prompt truoc se chen loi chua sua / viec phai lam ngay vao day.)

Ban dang lam trong repo `D:\AJT\TheWedding`. Hay bat dau Phase 9.

Truoc khi lam, doc `docs/PRODUCT_PLAN.md`, `docs/PROJECT_OVERVIEW.md`, `docs/ROADMAP.md`, `docs/UI_UX_DESIGN.md`, `docs/STORAGE_STRATEGY.md`, `docs/SEO_GEO_GUIDELINES.md`, `docs/REALTIME_WEBHOOK_PLAN.md`, va cac docs module lien quan. [NEW]

## Muc Tieu

Them nen tang cho scale/future: SaaS business model, payment/plans, B2B studio subscription foundation, value-added services, realtime webhook/event platform, Cloudflare R2 production storage, CDN, custom domain, watermark, AI tagging, analytics, user public handles, theme automation, va greeting automation. Co the chia nho neu qua lon. [NEW]

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
  - MoMo checkout/webhook flow with signed verification, replay protection, and idempotent payment event handling if implementing the real provider in this phase.
- Realtime webhook/event platform [NEW]:
  - If `08g_realtime_webhook_event_platform.md` is not completed, either run/split that prompt first or implement only safe gated placeholders documented in `docs/REALTIME_WEBHOOK_PLAN.md`.
  - Add event envelope and transactional outbox for critical domain events if included in this phase.
  - Add authorized browser realtime via SSE first for user/tenant/admin/public-safe album channels if included.
  - Add signed inbound provider webhook foundation for MoMo/payment events; public payment webhook must stay disabled until signature/replay/idempotency tests pass.
  - Add signed outbound webhook foundation for studio/automation integrations behind plan/feature gates if included.
  - Event payloads must be redacted and must not expose private/unlisted/admin/payment/signed-media/raw-storage data.
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
- SEO/GEO scale foundation [NEW]:
  - custom domain canonical policy, duplicate-domain canonical handling, and old-route redirect/noindex strategy.
  - sitemap generation/filtering for public/indexable sites and albums only.
  - robots.txt policy for public pages, app routes, API, signed media, AI crawlers, and future custom domains.
  - structured data foundations for public home/site/album/studio pages when owner/studio opt-in exists.
  - Open Graph/social preview image policy using safe public optimized derivatives.
  - AI/GEO content summaries must use public, owner-approved facts only and never expose private/unlisted albums, payment/admin data, storage keys, or AI-inferred sensitive fields.
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
  - publish analytics/realtime-safe events only when privacy rules allow.

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
- Unit tests for entitlement overrides, storage quota checks, MoMo webhook signature/replay/idempotency if implemented, and handle uniqueness.
- Unit tests for event outbox, realtime channel authorization, webhook signing/retry/redaction if realtime/webhook platform is implemented.
- [NEW] Unit tests for plan/add-on classification, B2B studio access boundaries if implemented, premium theme gates, contextual theme resolver fallback, and greeting schedule windows.
- Smoke tests for analytics events and admin visibility.
- [NEW] Responsive smoke checks for plan/subscription, studio, theme/admin-control, contextual theme, and greeting UI surfaces that are implemented.
- SEO/GEO tests for handle/custom-domain canonical URLs, sitemap eligibility, robots/noindex rules, structured data builders, and private/unlisted exclusion.
- Run full verification.

## Docs

- Update `docs/PRODUCT_PLAN.md`, `docs/REALTIME_WEBHOOK_PLAN.md`, architecture, API design, database design, testing strategy, `docs/SEO_GEO_GUIDELINES.md` neu policy thay doi, environment variables, deployment, roadmap, changelog, development log.
- Update `docs/HUONG_DAN_SU_DUNG.md` bang tieng Viet de huong dan cac feature moi nhu plan/subscription, MoMo payment, admin entitlement unlocks, user handle/album URLs, custom domain, analytics, watermark, AI tagging, Cloudflare R2/CDN/storage production va upload sessions neu duoc expose ra UI/API.
- [NEW] If B2B studio, contextual themes, automated greetings, premium themes, extra storage, custom domains, or add-ons are implemented or exposed, update the Vietnamese user guide with step-by-step usage and limitations.
- Update i18n/l10n locale files and docs for plan names, feature gates, analytics labels, domain statuses, storage messages, and future-feature copy.

## Ban Giao Sau Prompt (Bat Buoc)

Theo `AGENTS.md` muc 3, sau khi hoan tat (hoac dung do con viec):

- Tao/cap nhat task file trong `viec-can-lam/` cho viec nguoi dung can lam (credentials/config/QA thu cong/quyet dinh san pham), acceptance chua xong va ly do. Dung `viec-can-lam/_TEMPLATE.md`, dat vao dung muc do, roi cap nhat `viec-can-lam/README.md` nhu muc luc link/trang thai. Moi task file phai co huong dan chi tiet de nguoi dung tu lam duoc: can chuan bi gi, cac buoc thuc hien, file/env/dashboard/URL lien quan, cach smoke test/xac nhan pass, va docs lien quan.
- Neu con loi chua sua hoac viec phai lam ngay, tao/cap nhat file trong `viec-can-lam/00_khan_cap/`, roi chen tom tat + link vao muc `## Carryover Khan Cap Tu Prompt Truoc` o DAU prompt ke tiep (theo thu tu `prompts/README.md`); neu day la prompt cuoi, ghi link vao muc "Khan Cap" cua `viec-can-lam/README.md`.
- Tao/cap nhat file y tuong trong `y-tuong-nang-cap/` bang `y-tuong-nang-cap/_TEMPLATE.md`, roi cap nhat `y-tuong-nang-cap/README.md`.
- Cap nhat `docs/SYSTEM_MAP.md` neu cau truc thu muc/module/route/doc thay doi.

## Acceptance Criteria

- Future-scale features have clean interfaces and safe placeholders.
- No half-wired provider secrets are required for local dev.
- Cloudflare R2 setup and MoMo setup are documented before requiring real credentials.
- R2 is only enabled in Render after adapter code, env validation, upload/download smoke tests, and rollback docs are complete.
- Admin can unlock premium/storage entitlements manually if this phase implements entitlement UI/API.
- Public album URL planning/implementation includes user handle to avoid cross-user duplicate-name ambiguity.
- Future-feature UI copy is managed through locale keys for Vietnamese, English, and Japanese.
- Realtime/webhook features are implemented through the shared event contract/outbox/SSE/webhook plan or are clearly gated/deferred with no public unsafe endpoint enabled.
- [NEW] B2C SaaS packages, B2B studio subscription direction, and value-added services are represented in the plan/docs and implemented behind gates where code exists.
- [NEW] Custom theme expansion, admin theme control, dynamic contextual theme, and automated greetings are either implemented safely or documented as gated placeholders with clear next steps.
- [NEW] New UI surfaces pass the design gate from `docs/PRODUCT_PLAN.md` and responsive requirements from `docs/UI_UX_DESIGN.md`.
- [NEW] Public/custom-domain/handle routes have SEO/GEO policy for canonical, robots/noindex, sitemap, structured data, Open Graph, AI crawler behavior, and privacy boundaries.
- `viec-can-lam/`, `viec-can-lam/README.md` va `y-tuong-nang-cap/README.md` da duoc cap nhat; moi task file trong `viec-can-lam/` co huong dan thuc hien chi tiet; viec khan cap (neu co) da chuyen sang prompt ke tiep hoac `viec-can-lam/00_khan_cap/`.
- Commit va push len `origin/main`.
