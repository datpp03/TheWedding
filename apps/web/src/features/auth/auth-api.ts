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

export function logout() {
  return apiClient<{ loggedOut: boolean }>('/auth/logout', {
    method: 'POST',
  });
}
