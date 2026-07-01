'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { t } from '@/lib/i18n/locales';
import { useLocale } from '@/lib/i18n/locale-provider';
import {
  buildOAuthStartUrl,
  completeMfaChallenge,
  getAuthCapabilities,
  login,
  type AuthCapabilities,
  type OAuthLinkedAccount,
} from './auth-api';

export function LoginForm() {
  const searchParams = useSearchParams();
  const { locale } = useLocale();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mfaRequired, setMfaRequired] = useState(searchParams.get('mfa') === 'required');
  const [capabilities, setCapabilities] = useState<AuthCapabilities | null>(null);

  useEffect(() => {
    let mounted = true;
    getAuthCapabilities()
      .then((loadedCapabilities) => {
        if (mounted) {
          setCapabilities(loadedCapabilities);
        }
      })
      .catch(() => {
        if (mounted) {
          setCapabilities({ oauthProviders: { facebook: false, google: false } });
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);

    try {
      const result = await login({
        email: getString(formData, 'email'),
        password: getString(formData, 'password'),
      });
      if (result.mfaRequired) {
        setMfaRequired(true);
        return;
      }
      window.location.assign(getRedirectPath(searchParams.get('redirect')));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : t('auth.login.error', locale));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleMfaSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);

    try {
      await completeMfaChallenge({ code: getString(formData, 'code') });
      window.location.assign(getRedirectPath(searchParams.get('redirect')));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : t('auth.mfa.challengeError', locale));
    } finally {
      setIsSubmitting(false);
    }
  }

  if (mfaRequired) {
    return (
      <form
        className="w-full max-w-sm rounded-md border border-rose-100 bg-white p-6 shadow-sm"
        onSubmit={(event) => {
          void handleMfaSubmit(event);
        }}
      >
        <p className="text-sm font-semibold uppercase text-rose-700">
          {t('auth.mfa.kicker', locale)}
        </p>
        <h1 className="mt-2 text-xl font-semibold text-ink">{t('auth.mfa.title', locale)}</h1>
        <p className="mt-2 text-sm leading-6 text-neutral-600">
          {t('auth.mfa.description', locale)}
        </p>
        <label className="mt-6 grid gap-2 text-sm font-medium text-neutral-700">
          {t('auth.mfa.code', locale)}
          <input
            className="h-11 rounded-md border-neutral-300"
            type="text"
            name="code"
            inputMode="numeric"
            autoComplete="one-time-code"
            required
          />
        </label>
        {error ? (
          <p className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        ) : null}
        <button
          className="mt-4 h-11 w-full rounded-md bg-rose-600 px-4 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? t('auth.mfa.verifying', locale) : t('auth.mfa.verify', locale)}
        </button>
        <button
          className="mt-3 h-10 w-full rounded-md border border-neutral-300 bg-white px-4 text-sm font-medium text-neutral-700"
          type="button"
          onClick={() => setMfaRequired(false)}
        >
          {t('auth.mfa.backToPassword', locale)}
        </button>
      </form>
    );
  }

  return (
    <form
      className="w-full max-w-sm rounded-md border border-rose-100 bg-white p-6 shadow-sm"
      onSubmit={(event) => {
        void handleSubmit(event);
      }}
    >
      <p className="text-sm font-semibold uppercase text-rose-700">
        {t('auth.login.kicker', locale)}
      </p>
      <h1 className="mt-2 text-xl font-semibold text-ink">{t('auth.login.title', locale)}</h1>
      <div className="mt-6 grid gap-4">
        <label className="grid gap-2 text-sm font-medium text-neutral-700">
          {t('auth.fields.email', locale)}
          <input
            className="h-11 rounded-md border-neutral-300"
            type="email"
            name="email"
            autoComplete="email"
            required
          />
        </label>
        <label className="grid gap-2 text-sm font-medium text-neutral-700">
          {t('auth.fields.password', locale)}
          <input
            className="h-11 rounded-md border-neutral-300"
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
          className="h-11 rounded-md bg-rose-600 px-4 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? t('auth.login.signingIn', locale) : t('auth.login.submit', locale)}
        </button>
      </div>
      <OAuthButtons
        capabilities={capabilities}
        returnTo={getRedirectPath(searchParams.get('redirect'))}
      />
      <div className="mt-4 flex items-center justify-between text-sm text-neutral-600">
        <Link href="/forgot-password">{t('auth.login.forgotPassword', locale)}</Link>
        <Link href="/register">{t('auth.login.createAccount', locale)}</Link>
      </div>
    </form>
  );
}

function OAuthButtons({
  capabilities,
  returnTo,
}: {
  capabilities: AuthCapabilities | null;
  returnTo: string;
}) {
  const { locale } = useLocale();
  const providers: OAuthLinkedAccount['provider'][] = ['google', 'facebook'];
  const enabledProviders = providers.filter((provider) => capabilities?.oauthProviders[provider]);

  if (!enabledProviders.length) {
    return null;
  }

  return (
    <div className="mt-5 grid gap-2 border-t border-neutral-100 pt-5">
      {enabledProviders.map((provider) => (
        <a
          key={provider}
          className="flex h-11 items-center justify-center rounded-md border border-teal-200 bg-teal-50 px-4 text-sm font-semibold text-teal-900"
          href={buildOAuthStartUrl(provider, returnTo)}
        >
          {t(`auth.oauth.${provider}`, locale)}
        </a>
      ))}
    </div>
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
