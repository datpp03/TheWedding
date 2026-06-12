import type { ApiResponse } from '@the-wedding/shared';

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

export async function apiClient<TData>(path: string, init?: RequestInit): Promise<TData> {
  const response = await fetch(`${apiUrl}/api/v1${path}`, {
    credentials: 'include',
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  });
  const payload = (await response.json()) as ApiResponse<TData>;

  if (payload.success === false) {
    throw new Error(payload.error.message);
  }

  return payload.data;
}
