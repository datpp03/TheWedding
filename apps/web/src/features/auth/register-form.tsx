'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { register } from './auth-api';

export function RegisterForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);

    try {
      await register({
        displayName: getString(formData, 'displayName'),
        email: getString(formData, 'email'),
        password: getString(formData, 'password'),
      });
      router.push('/dashboard');
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Registration failed');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      className="w-full max-w-md rounded-md border border-neutral-200 bg-white p-6 shadow-sm"
      onSubmit={(event) => {
        void handleSubmit(event);
      }}
    >
      <h1 className="text-xl font-semibold text-ink">Create account</h1>
      <div className="mt-6 grid gap-4">
        <label className="grid gap-2 text-sm font-medium text-neutral-700">
          Display name
          <input
            className="rounded-md border-neutral-300"
            name="displayName"
            autoComplete="name"
            required
          />
        </label>
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
            autoComplete="new-password"
            minLength={12}
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
          {isSubmitting ? 'Creating...' : 'Register'}
        </button>
      </div>
      <p className="mt-4 text-sm text-neutral-600">
        <Link href="/login">Back to sign in</Link>
      </p>
    </form>
  );
}

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === 'string' ? value : '';
}
