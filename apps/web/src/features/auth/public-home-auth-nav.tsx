'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { t } from '@/lib/i18n/locales';
import { useLocale } from '@/lib/i18n/locale-provider';
import { getCurrentUser, type AuthUser } from './auth-api';

export function PublicHomeAuthNav() {
  const { locale } = useLocale();
  const [user, setUser] = useState<AuthUser | null>(null);

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
      });

    return () => {
      mounted = false;
    };
  }, []);

  if (user) {
    return (
      <div className="flex flex-wrap items-center justify-end gap-2">
        <span className="max-w-40 truncate text-sm font-semibold text-neutral-700">
          {user.displayName}
        </span>
        <Link
          className="rounded-md bg-rose-600 px-3 py-2 text-sm font-semibold text-white"
          href="/dashboard"
        >
          {t('auth.nav.dashboard', locale)}
        </Link>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <Link className="rounded-md px-3 py-2 text-sm font-semibold text-neutral-700" href="/login">
        {t('auth.nav.signIn', locale)}
      </Link>
      <Link
        className="rounded-md bg-ink px-3 py-2 text-sm font-semibold text-white"
        href="/register"
      >
        {t('auth.nav.createSite', locale)}
      </Link>
    </div>
  );
}
