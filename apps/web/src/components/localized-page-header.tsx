'use client';

import { t } from '@/lib/i18n/locales';
import { useLocale } from '@/lib/i18n/locale-provider';
import { PageHeader } from './page-header';

export function LocalizedPageHeader({
  descriptionKey,
  titleKey,
}: {
  descriptionKey: string;
  titleKey: string;
}) {
  const { locale } = useLocale();

  return <PageHeader title={t(titleKey, locale)} description={t(descriptionKey, locale)} />;
}
