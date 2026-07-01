'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getCurrentUser } from '@/features/auth/auth-api';
import { useLocale } from '@/lib/i18n/locale-provider';
import { t } from '@/lib/i18n/locales';
import { createReaction, createWish, type ReactionSummary, type Wish } from './public-album-api';

export function AlbumSocialPanel({
  albumId,
  albumPath,
  initialReactions,
  initialWishes,
  symbols,
}: {
  albumId: string;
  albumPath: string;
  initialReactions: ReactionSummary[];
  initialWishes: Wish[];
  symbols: Array<Pick<ReactionSummary, 'glyph' | 'symbolKey'>>;
}) {
  const { locale } = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [message, setMessage] = useState('');
  const [wishes, setWishes] = useState(initialWishes);
  const [reactions, setReactions] = useState(initialReactions);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    getCurrentUser()
      .then(() => setIsLoggedIn(true))
      .catch(() => setIsLoggedIn(false));
  }, []);

  useEffect(() => {
    const intent = searchParams.get('intent');
    if (intent === 'wish') {
      document.getElementById('album-wish-form')?.scrollIntoView({ block: 'center' });
    }
  }, [searchParams]);

  function requireLogin(intent: 'wish' | 'reaction') {
    const returnTo = `${albumPath}?intent=${intent}`;
    router.push(`/login?redirect=${encodeURIComponent(returnTo)}`);
  }

  async function submitWish(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isLoggedIn) {
      requireLogin('wish');
      return;
    }
    setStatus(t('social.sendingWish', locale));
    try {
      const wish = await createWish(albumId, message);
      setWishes([wish, ...wishes]);
      setMessage('');
      setStatus(t('social.wishSent', locale));
    } catch (caught) {
      setStatus(caught instanceof Error ? caught.message : t('social.wishError', locale));
    }
  }

  async function react(symbolKey: string) {
    if (!isLoggedIn) {
      requireLogin('reaction');
      return;
    }
    setStatus(t('social.addingReaction', locale));
    try {
      setReactions(await createReaction(albumId, symbolKey));
      setStatus(t('social.reactionAdded', locale));
    } catch (caught) {
      setStatus(caught instanceof Error ? caught.message : t('social.reactionError', locale));
    }
  }

  return (
    <section className="grid gap-6 rounded-md border border-teal-100 bg-white p-4 shadow-sm sm:p-5">
      <div>
        <p className="text-sm font-semibold uppercase text-teal-700">
          {t('social.guestLove', locale)}
        </p>
        <h2 className="mt-1 text-2xl font-semibold text-ink">{t('social.title', locale)}</h2>
        <p className="mt-2 text-sm leading-6 text-neutral-600">{t('social.description', locale)}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {symbols.map((symbol) => {
          const count =
            reactions.find((reaction) => reaction.symbolKey === symbol.symbolKey)?.count ?? 0;
          return (
            <button
              key={symbol.symbolKey}
              className="min-h-11 rounded-full border border-rose-200 bg-rose-50 px-4 text-sm font-semibold text-rose-800 transition hover:border-rose-400 hover:bg-rose-100 disabled:opacity-60"
              type="button"
              onClick={() => {
                void react(symbol.symbolKey);
              }}
            >
              {renderGlyph(symbol.glyph)} {count}
            </button>
          );
        })}
      </div>

      <form
        id="album-wish-form"
        className="grid gap-3"
        onSubmit={(event) => void submitWish(event)}
      >
        <label className="grid gap-2 text-sm font-semibold text-neutral-700">
          {t('social.leaveWish', locale)}
          <textarea
            className="min-h-28 rounded-md border border-neutral-300 p-3 text-sm font-normal focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-100"
            maxLength={500}
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder={t('social.placeholder', locale)}
            required
          />
        </label>
        <button
          className="h-11 rounded-md bg-teal-700 px-4 text-sm font-semibold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-60"
          type="submit"
          disabled={isLoggedIn === null}
        >
          {isLoggedIn ? t('social.sendWish', locale) : t('social.signInToSend', locale)}
        </button>
        {status ? (
          <p className="rounded-md bg-amber-50 px-3 py-2 text-sm font-medium text-amber-800">
            {status}
          </p>
        ) : null}
      </form>

      <div className="grid gap-3">
        {wishes.length ? (
          wishes.map((wish) => (
            <article key={wish.id} className="rounded-md bg-pearl p-3">
              <p className="text-sm font-semibold text-ink">{wish.displayName}</p>
              <p className="mt-1 text-sm leading-6 text-neutral-700">{wish.message}</p>
            </article>
          ))
        ) : (
          <div className="rounded-md border border-dashed border-neutral-300 p-4 text-sm text-neutral-600">
            {t('social.emptyWishes', locale)}
          </div>
        )}
      </div>
    </section>
  );
}

function renderGlyph(value: string) {
  const symbols: Record<string, string> = {
    cherry_blossom: '*',
    fish: '><>',
    flower: '*',
    heart: '<3',
    leaf: 'leaf',
    star: '*',
  };

  return symbols[value] ?? value;
}
