import { apiClient, getApiBaseUrl } from '@/lib/api-client';

export type AuthUser = {
  id: string;
  email: string;
  displayName: string;
  avatarUrl: string | null;
  status: string;
  emailVerifiedAt: string | null;
  mfaEnabled: boolean;
  roles: string[];
  permissions: string[];
};

export type AuthResult = {
  challengeExpiresInSeconds?: number;
  devEmailVerificationToken?: string;
  mfaRequired?: boolean;
  user?: AuthUser;
};

export type AuthCapabilities = {
  oauthProviders: {
    facebook: boolean;
    google: boolean;
  };
};

export type MfaEnrollmentStart = {
  enrollmentToken: string;
  method: 'totp';
  otpauthUri: string;
  secret: string;
};

export type OAuthLinkedAccount = {
  connectedAt: string;
  provider: 'facebook' | 'google';
  verifiedEmail: string | null;
};

export function login(input: { email: string; password: string }) {
  return apiClient<AuthResult>('/auth/login', {
    body: JSON.stringify(input),
    method: 'POST',
  });
}

export function register(input: { displayName: string; email: string; password: string }) {
  return apiClient<AuthResult>('/auth/register', {
    body: JSON.stringify(input),
    method: 'POST',
  });
}

export function getCurrentUser() {
  return apiClient<AuthUser>('/auth/me');
}

export function getAuthCapabilities() {
  return apiClient<AuthCapabilities>('/auth/capabilities');
}

export function forgotPassword(input: { email: string }) {
  return apiClient<{ message: string; devResetToken?: string }>('/auth/forgot-password', {
    body: JSON.stringify(input),
    method: 'POST',
  });
}

export function resetPassword(input: { token: string; password: string }) {
  return apiClient<{ reset: boolean }>('/auth/reset-password', {
    body: JSON.stringify(input),
    method: 'POST',
  });
}

export function verifyEmail(input: { token: string }) {
  return apiClient<AuthUser>('/auth/verify-email', {
    body: JSON.stringify(input),
    method: 'POST',
  });
}

export function resendVerification(input: { email: string }) {
  return apiClient<{ devEmailVerificationToken?: string; message: string }>(
    '/auth/resend-verification',
    {
      body: JSON.stringify(input),
      method: 'POST',
    },
  );
}

export function startMfaEnrollment() {
  return apiClient<MfaEnrollmentStart>('/auth/mfa/enrollment/start', {
    method: 'POST',
  });
}

export function verifyMfaEnrollment(input: { code: string; enrollmentToken: string }) {
  return apiClient<AuthUser>('/auth/mfa/enrollment/verify', {
    body: JSON.stringify(input),
    method: 'POST',
  });
}

export function completeMfaChallenge(input: { code: string }) {
  return apiClient<{ user: AuthUser }>('/auth/mfa/challenge', {
    body: JSON.stringify(input),
    method: 'POST',
  });
}

export function disableMfa(input: { code: string }) {
  return apiClient<AuthUser>('/auth/mfa', {
    body: JSON.stringify(input),
    method: 'DELETE',
  });
}

export function listOAuthAccounts() {
  return apiClient<OAuthLinkedAccount[]>('/auth/oauth/linked/accounts');
}

export function unlinkOAuthProvider(provider: OAuthLinkedAccount['provider']) {
  return apiClient<{ provider: OAuthLinkedAccount['provider']; unlinked: true }>(
    `/auth/oauth/linked/${provider}`,
    {
      method: 'DELETE',
    },
  );
}

export function buildOAuthStartUrl(provider: OAuthLinkedAccount['provider'], returnTo: string) {
  const url = new URL(`${getApiBaseUrl()}/api/v1/auth/oauth/${provider}`);
  url.searchParams.set('returnTo', returnTo);
  return url.toString();
}

export function buildOAuthLinkUrl(provider: OAuthLinkedAccount['provider']) {
  const url = new URL(`${getApiBaseUrl()}/api/v1/auth/oauth/link/${provider}`);
  url.searchParams.set('returnTo', '/dashboard/settings');
  return url.toString();
}

export function refreshSession() {
  return apiClient<{ user: AuthUser }>('/auth/refresh', {
    method: 'POST',
  });
}

export function logout() {
  return apiClient<{ loggedOut: boolean }>('/auth/logout', {
    method: 'POST',
  });
}
