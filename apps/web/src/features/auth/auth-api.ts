import { apiClient } from '@/lib/api-client';

export type AuthUser = {
  id: string;
  email: string;
  displayName: string;
  avatarUrl: string | null;
  status: string;
  emailVerifiedAt: string | null;
  roles: string[];
  permissions: string[];
};

export type AuthResult = {
  user: AuthUser;
  devEmailVerificationToken?: string;
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
