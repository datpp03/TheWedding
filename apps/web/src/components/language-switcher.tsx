'use client';

import { t } from '@/lib/i18n/locales';
import { useLocale } from '@/lib/i18n/locale-provider';

const languageOptions = [
  { labelKey: 'language.vi', value: 'vi' },
  { labelKey: 'language.en', value: 'en' },
  { labelKey: 'language.ja', value: 'ja' },
] as const;

export function LanguageSwitcher() {
  const { locale, setLocale } = useLocale();

  return (
    <section className="mt-6 rounded-md border border-rose-100 bg-rose-50/70 p-3">
      <label className="grid gap-2 text-xs font-semibold uppercase text-rose-700">
        {t('language.label', locale)}
        <select
          className="h-10 rounded-md border-rose-200 bg-white px-2 text-sm font-medium normal-case text-ink focus:border-rose-400 focus:ring-rose-200"
          value={locale}
          onChange={(event) => setLocale(event.target.value as typeof locale)}
        >
          {languageOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {t(option.labelKey, locale)}
            </option>
          ))}
        </select>
      </label>
    </section>
  );
}
