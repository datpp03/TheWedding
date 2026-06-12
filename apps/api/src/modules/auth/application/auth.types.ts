import type { PermissionCode, RoleCode } from '@the-wedding/shared';

export type SafeUser = {
  id: string;
  email: string;
  displayName: string;
  avatarUrl: string | null;
  status: string;
  emailVerifiedAt: Date | null;
  roles: RoleCode[];
  permissions: PermissionCode[];
};

export type RequestContext = {
  ipAddress?: string;
  userAgent?: string;
};

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

export type AuthResult = {
  user: SafeUser;
  tokens: AuthTokens;
  devEmailVerificationToken?: string;
};

export type ForgotPasswordResult = {
  message: string;
  devResetToken?: string;
};

export type AccessTokenPayload = {
  sub: string;
  email: string;
  sessionId: string;
  roles: RoleCode[];
  permissions: PermissionCode[];
  tenantIds: string[];
};
