'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { resetPassword } from './auth-api';

export function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const initialToken = searchParams.get('token') ?? '';
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(false);
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);

    try {
      await resetPassword({
        token: getString(formData, 'token'),
        password: getString(formData, 'password'),
      });
      setSuccess(true);
      event.currentTarget.reset();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Password reset failed');
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
      <h1 className="text-xl font-semibold text-ink">Create new password</h1>
      <div className="mt-6 grid gap-4">
        <label className="grid gap-2 text-sm font-medium text-neutral-700">
          Reset token
          <input
            className="rounded-md border-neutral-300"
            name="token"
            defaultValue={initialToken}
            required
          />
        </label>
        <label className="grid gap-2 text-sm font-medium text-neutral-700">
          New password
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
        {success ? (
          <p className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
            Password updated. You can sign in with the new password.
          </p>
        ) : null}
        <button
          className="h-10 rounded-md bg-ink px-4 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : 'Save new password'}
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
