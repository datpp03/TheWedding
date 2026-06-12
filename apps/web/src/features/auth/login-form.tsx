'use client';

import Link from 'next/link';
import type { Route } from 'next';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { login } from './auth-api';

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);

    try {
      await login({
        email: getString(formData, 'email'),
        password: getString(formData, 'password'),
      });
      router.push(getRedirectPath(searchParams.get('redirect')) as Route);
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Sign in failed');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      className="w-full max-w-sm rounded-md border border-neutral-200 bg-white p-6 shadow-sm"
      onSubmit={(event) => {
        void handleSubmit(event);
      }}
    >
      <h1 className="text-xl font-semibold text-ink">Sign in</h1>
      <div className="mt-6 grid gap-4">
        <label className="grid gap-2 text-sm font-medium text-neutral-700">
          Email
          <input
            className="rounded-md border-neutral-300"
            type="email"
            name="email"
            autoComplete="email"
            required
          />
        </label>
        <label className="grid gap-2 text-sm font-medium text-neutral-700">
          Password
          <input
            className="rounded-md border-neutral-300"
            type="password"
            name="password"
            autoComplete="current-password"
            required
          />
        </label>
        {error ? (
          <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        ) : null}
        <button
          className="h-10 rounded-md bg-ink px-4 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Signing in...' : 'Sign in'}
        </button>
      </div>
      <div className="mt-4 flex items-center justify-between text-sm text-neutral-600">
        <Link href="/forgot-password">Forgot password</Link>
        <Link href="/register">Create account</Link>
      </div>
    </form>
  );
}

function getRedirectPath(value: string | null) {
  if (!value?.startsWith('/') || value.startsWith('//')) {
    return '/dashboard';
  }

  return value;
}

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === 'string' ? value : '';
}
