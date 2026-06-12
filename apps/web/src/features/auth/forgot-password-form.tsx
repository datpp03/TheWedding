'use client';

import Link from 'next/link';
import { useState } from 'react';
import { forgotPassword } from './auth-api';

export function ForgotPasswordForm() {
  const [message, setMessage] = useState<string | null>(null);
  const [devResetToken, setDevResetToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setMessage(null);
    setDevResetToken(null);
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);

    try {
      const result = await forgotPassword({ email: getString(formData, 'email') });
      setMessage(result.message);
      setDevResetToken(result.devResetToken ?? null);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Reset request failed');
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
      <h1 className="text-xl font-semibold text-ink">Reset password</h1>
      <p className="mt-2 text-sm text-neutral-600">
        Enter your email and we will prepare a reset link if the account exists.
      </p>
      <label className="mt-6 grid gap-2 text-sm font-medium text-neutral-700">
        Email
        <input
          className="rounded-md border-neutral-300"
          type="email"
          name="email"
          autoComplete="email"
          required
        />
      </label>
      {error ? (
        <p className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      ) : null}
      {message ? (
        <div className="mt-4 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
          <p>{message}</p>
          {devResetToken ? (
            <Link
              className="mt-2 block break-words font-medium underline"
              href={`/reset-password?token=${encodeURIComponent(devResetToken)}`}
            >
              Open local reset link
            </Link>
          ) : null}
        </div>
      ) : null}
      <button
        className="mt-4 h-10 w-full rounded-md bg-ink px-4 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Sending...' : 'Send reset link'}
      </button>
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
