# Auth Module

Owns registration, login, logout, refresh token rotation, password reset, email verification, session management, brute-force controls, optional MFA, and auth-related audit events.

Business rules belong in `application` use cases and `domain` services. Controllers only map HTTP DTOs to use cases.
