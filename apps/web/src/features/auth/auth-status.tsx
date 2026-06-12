'use client';

import { useEffect, useState } from 'react';
import { getCurrentUser, logout, type AuthUser } from './auth-api';

export function AuthStatus() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    getCurrentUser()
      .then((currentUser) => {
        if (mounted) {
          setUser(currentUser);
        }
      })
      .catch(() => {
        if (mounted) {
          setUser(null);
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
  }, []);

  async function handleLogout() {
    await logout();
    window.location.href = '/login';
  }

  if (isLoading) {
    return <div className="mt-6 h-16 rounded-md bg-neutral-100" />;
  }

  if (!user) {
    return (
      <a
        className="mt-6 block rounded-md bg-ink px-3 py-2 text-center text-sm font-medium text-white"
        href="/login"
      >
        Sign in
      </a>
    );
  }

  return (
    <div className="mt-6 rounded-md border border-neutral-200 bg-neutral-50 p-3">
      <p className="text-sm font-medium text-ink">{user.displayName}</p>
      <p className="truncate text-xs text-neutral-600">{user.email}</p>
      <button
        className="mt-3 h-8 w-full rounded-md border border-neutral-300 bg-white px-3 text-sm font-medium text-neutral-700"
        type="button"
        onClick={() => {
          void handleLogout();
        }}
      >
        Sign out
      </button>
    </div>
  );
}
