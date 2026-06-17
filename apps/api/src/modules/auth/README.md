# Auth Module

Owns registration, login, logout, refresh token rotation, password reset, email verification, session management, brute-force controls, optional MFA, and auth-related audit events.

Business rules belong in `application` use cases and `domain` services. Controllers only map HTTP DTOs to use cases.

## Phase 7A OAuth Foundation

Google/Facebook OAuth start and callback routes validate safe `returnTo` state and reject open redirects. Provider callback exchange and account linking are intentionally disabled until verified-email linking rules are confirmed.
