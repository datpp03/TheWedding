'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { t } from '@/lib/i18n/locales';
import { useLocale } from '@/lib/i18n/locale-provider';
import {
  buildOAuthLinkUrl,
  disableMfa,
  getAuthCapabilities,
  getCurrentUser,
  listOAuthAccounts,
  startMfaEnrollment,
  unlinkOAuthProvider,
  verifyMfaEnrollment,
  type AuthCapabilities,
  type AuthUser,
  type MfaEnrollmentStart,
  type OAuthLinkedAccount,
} from './auth-api';

type Message = {
  tone: 'error' | 'success';
  text: string;
};

const PROVIDERS: OAuthLinkedAccount['provider'][] = ['google', 'facebook'];

export function AccountSecurityPanel() {
  const { locale } = useLocale();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [capabilities, setCapabilities] = useState<AuthCapabilities | null>(null);
  const [accounts, setAccounts] = useState<OAuthLinkedAccount[]>([]);
  const [enrollment, setEnrollment] = useState<MfaEnrollmentStart | null>(null);
  const [message, setMessage] = useState<Message | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let mounted = true;
    Promise.all([getCurrentUser(), getAuthCapabilities(), listOAuthAccounts()])
      .then(([currentUser, loadedCapabilities, linkedAccounts]) => {
        if (mounted) {
          setUser(currentUser);
          setCapabilities(loadedCapabilities);
          setAccounts(linkedAccounts);
        }
      })
      .catch((caught) => {
        if (mounted) {
          setMessage({
            tone: 'error',
            text: caught instanceof Error ? caught.message : t('auth.security.loadError', locale),
          });
        }
      })
      .finally(() => {
        if (mounted) {
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, [locale]);

  async function beginEnrollment() {
    setBusy(true);
    setMessage(null);

    try {
      setEnrollment(await startMfaEnrollment());
    } catch (caught) {
      setMessage({
        tone: 'error',
        text: caught instanceof Error ? caught.message : t('auth.security.mfaStartError', locale),
      });
    } finally {
      setBusy(false);
    }
  }

  async function submitEnrollment(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!enrollment) {
      return;
    }

    setBusy(true);
    setMessage(null);

    const formData = new FormData(event.currentTarget);

    try {
      const updatedUser = await verifyMfaEnrollment({
        code: getString(formData, 'code'),
        enrollmentToken: enrollment.enrollmentToken,
      });
      setUser(updatedUser);
      setEnrollment(null);
      setMessage({ tone: 'success', text: t('auth.security.mfaEnabled', locale) });
      event.currentTarget.reset();
    } catch (caught) {
      setMessage({
        tone: 'error',
        text: caught instanceof Error ? caught.message : t('auth.security.mfaVerifyError', locale),
      });
    } finally {
      setBusy(false);
    }
  }

  async function submitDisable(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage(null);

    const formData = new FormData(event.currentTarget);

    try {
      const updatedUser = await disableMfa({ code: getString(formData, 'code') });
      setUser(updatedUser);
      setMessage({ tone: 'success', text: t('auth.security.mfaDisabled', locale) });
      event.currentTarget.reset();
    } catch (caught) {
      setMessage({
        tone: 'error',
        text: caught instanceof Error ? caught.message : t('auth.security.mfaDisableError', locale),
      });
    } finally {
      setBusy(false);
    }
  }

  async function unlink(provider: OAuthLinkedAccount['provider']) {
    setBusy(true);
    setMessage(null);

    try {
      await unlinkOAuthProvider(provider);
      setAccounts((current) => current.filter((account) => account.provider !== provider));
      setMessage({ tone: 'success', text: t('auth.security.oauthUnlinked', locale) });
    } catch (caught) {
      setMessage({
        tone: 'error',
        text:
          caught instanceof Error ? caught.message : t('auth.security.oauthUnlinkError', locale),
      });
    } finally {
      setBusy(false);
    }
  }

  if (loading) {
    return <PanelShell>{t('auth.security.loading', locale)}</PanelShell>;
  }

  return (
    <PanelShell>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase text-teal-700">
            {t('auth.security.kicker', locale)}
          </p>
          <h2 className="mt-1 text-lg font-semibold text-ink">
            {t('auth.security.title', locale)}
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-600">
            {t('auth.security.description', locale)}
          </p>
        </div>
        <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700">
          {user?.mfaEnabled ? t('auth.security.mfaOn', locale) : t('auth.security.mfaOff', locale)}
        </span>
      </div>

      <section className="mt-5 grid gap-4 rounded-md border border-neutral-200 bg-neutral-50 p-4">
        <h3 className="text-sm font-semibold text-ink">{t('auth.security.mfaTitle', locale)}</h3>
        {user?.mfaEnabled ? (
          <form className="grid gap-3 md:max-w-sm" onSubmit={(event) => void submitDisable(event)}>
            <label className="grid gap-2 text-sm font-medium text-neutral-700">
              {t('auth.mfa.code', locale)}
              <input
                className="h-11 rounded-md border-neutral-300"
                name="code"
                inputMode="numeric"
                autoComplete="one-time-code"
                required
              />
            </label>
            <button
              className="h-11 w-fit rounded-md border border-red-200 bg-white px-4 text-sm font-semibold text-red-700 disabled:opacity-60"
              disabled={busy}
              type="submit"
            >
              {t('auth.security.disableMfa', locale)}
            </button>
          </form>
        ) : enrollment ? (
          <form className="grid gap-3" onSubmit={(event) => void submitEnrollment(event)}>
            <div className="rounded-md border border-teal-200 bg-white p-3 text-sm text-neutral-700">
              <p className="font-semibold text-teal-900">
                {t('auth.security.manualSecret', locale)}
              </p>
              <p className="mt-2 break-all font-mono text-xs">{enrollment.secret}</p>
              <p className="mt-3 break-all text-xs text-neutral-500">{enrollment.otpauthUri}</p>
            </div>
            <label className="grid gap-2 text-sm font-medium text-neutral-700 md:max-w-sm">
              {t('auth.mfa.code', locale)}
              <input
                className="h-11 rounded-md border-neutral-300"
                name="code"
                inputMode="numeric"
                autoComplete="one-time-code"
                required
              />
            </label>
            <button
              className="h-11 w-fit rounded-md bg-rose-600 px-4 text-sm font-semibold text-white disabled:opacity-60"
              disabled={busy}
              type="submit"
            >
              {t('auth.security.verifyEnrollment', locale)}
            </button>
          </form>
        ) : (
          <button
            className="h-11 w-fit rounded-md bg-rose-600 px-4 text-sm font-semibold text-white disabled:opacity-60"
            disabled={busy}
            type="button"
            onClick={() => void beginEnrollment()}
          >
            {t('auth.security.startMfa', locale)}
          </button>
        )}
      </section>

      <section className="mt-5 grid gap-3 rounded-md border border-neutral-200 bg-neutral-50 p-4">
        <h3 className="text-sm font-semibold text-ink">{t('auth.security.oauthTitle', locale)}</h3>
        <div className="grid gap-2 md:grid-cols-2">
          {PROVIDERS.map((provider) => {
            const account = accounts.find((item) => item.provider === provider);
            const enabled = capabilities?.oauthProviders[provider];

            return (
              <div
                key={provider}
                className="rounded-md border border-neutral-200 bg-white p-3 text-sm"
              >
                <p className="font-semibold text-ink">
                  {t(`auth.oauth.provider.${provider}`, locale)}
                </p>
                <p className="mt-1 min-h-5 text-neutral-600">
                  {account?.verifiedEmail ?? t('auth.security.oauthNotLinked', locale)}
                </p>
                {account ? (
                  <button
                    className="mt-3 h-10 rounded-md border border-neutral-300 px-3 font-semibold text-neutral-700 disabled:opacity-60"
                    disabled={busy}
                    type="button"
                    onClick={() => void unlink(provider)}
                  >
                    {t('auth.security.unlinkProvider', locale)}
                  </button>
                ) : enabled ? (
                  <a
                    className="mt-3 inline-flex h-10 items-center rounded-md bg-teal-600 px-3 font-semibold text-white"
                    href={buildOAuthLinkUrl(provider)}
                  >
                    {t('auth.security.linkProvider', locale)}
                  </a>
                ) : (
                  <span className="mt-3 inline-flex h-10 items-center rounded-md bg-neutral-100 px-3 font-semibold text-neutral-500">
                    {t('auth.security.providerDisabled', locale)}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {message ? <Status tone={message.tone} text={message.text} /> : null}
    </PanelShell>
  );
}

function PanelShell({ children }: { children: ReactNode }) {
  return (
    <section className="rounded-md border border-teal-100 bg-white p-5 shadow-sm">
      {children}
    </section>
  );
}

function Status({ text, tone }: { text: string; tone: 'error' | 'success' }) {
  const className =
    tone === 'error'
      ? 'border-red-200 bg-red-50 text-red-700'
      : 'border-emerald-200 bg-emerald-50 text-emerald-800';
  return <p className={`mt-5 rounded-md border px-3 py-2 text-sm ${className}`}>{text}</p>;
}

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === 'string' ? value : '';
}
