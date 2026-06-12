'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { verifyEmail, type AuthUser } from './auth-api';

export function VerifyEmailPanel() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [user, setUser] = useState<AuthUser | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(Boolean(token));

  useEffect(() => {
    if (!token) {
      setError('Verification token is missing.');
      setIsLoading(false);
      return;
    }

    let mounted = true;

    verifyEmail({ token })
      .then((verifiedUser) => {
        if (mounted) {
          setUser(verifiedUser);
        }
      })
      .catch((caught) => {
        if (mounted) {
          setError(caught instanceof Error ? caught.message : 'Email verification failed');
        }
      })
      .finally(() => {
        if (mounted) {
          setIsLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, [token]);

  return (
    <section className="w-full max-w-md rounded-md border border-neutral-200 bg-white p-6 shadow-sm">
      <h1 className="text-xl font-semibold text-ink">Verify email</h1>
      {isLoading ? <p className="mt-4 text-sm text-neutral-600">Checking your link...</p> : null}
      {user ? (
        <div className="mt-4 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
          <p>{user.email} is verified.</p>
          <Link className="mt-2 block font-medium underline" href="/dashboard">
            Continue to dashboard
          </Link>
        </div>
      ) : null}
      {error ? (
        <div className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          <p>{error}</p>
          <Link className="mt-2 block font-medium underline" href="/login">
            Back to sign in
          </Link>
        </div>
      ) : null}
    </section>
  );
}
