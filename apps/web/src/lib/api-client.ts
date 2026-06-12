import type { ApiResponse } from '@the-wedding/shared';

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';
const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

let csrfToken: string | null = null;

export async function apiClient<TData>(path: string, init?: RequestInit): Promise<TData> {
  const method = init?.method?.toUpperCase() ?? 'GET';
  const headers = new Headers(init?.headers);

  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  if (!SAFE_METHODS.has(method) && !headers.has('X-CSRF-Token')) {
    headers.set('X-CSRF-Token', await getCsrfToken());
  }

  const response = await fetch(`${apiUrl}/api/v1${path}`, {
    credentials: 'include',
    ...init,
    headers,
  });
  const payload = (await response.json()) as ApiResponse<TData>;

  if (payload.success === false) {
    throw new Error(payload.error.message);
  }

  return payload.data;
}

async function getCsrfToken() {
  if (csrfToken) {
    return csrfToken;
  }

  const response = await fetch(`${apiUrl}/api/v1/auth/csrf`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const payload = (await response.json()) as ApiResponse<{ token: string }>;

  if (payload.success === false) {
    throw new Error(payload.error.message);
  }

  csrfToken = payload.data.token;
  return csrfToken;
}
