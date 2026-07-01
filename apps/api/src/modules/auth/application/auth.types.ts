import type { PermissionCode, RoleCode } from '@the-wedding/shared';

export type SafeUser = {
  id: string;
  email: string;
  displayName: string;
  avatarUrl: string | null;
  status: string;
  emailVerifiedAt: Date | null;
  mfaEnabled: boolean;
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

export type AuthenticatedResult = {
  mfaRequired?: false;
  user: SafeUser;
  tokens: AuthTokens;
  devEmailVerificationToken?: string;
};

export type MfaRequiredResult = {
  challengeExpiresInSeconds: number;
  challengeToken: string;
  mfaRequired: true;
};

export type AuthResult = AuthenticatedResult | MfaRequiredResult;

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

export type MfaChallengeTokenPayload = {
  purpose: 'mfa_challenge';
  sub: string;
};

export type MfaEnrollmentTokenPayload = {
  purpose: 'mfa_enrollment';
  secret: string;
  sub: string;
};
