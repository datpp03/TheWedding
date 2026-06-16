import { dictionaries, locales, t } from '@/lib/i18n/locales';

const adminKeys = [
  'admin.page.title',
  'admin.nav.users',
  'admin.nav.tenants',
  'admin.nav.media',
  'admin.nav.audit',
  'admin.nav.settings',
  'admin.systemParameters.disableRegistration',
  'admin.systemParameters.disableLogin',
  'admin.systemParameters.disableUploads',
  'admin.systemParameters.disableDownloads',
  'admin.systemParameters.disablePublicGallery',
  'admin.systemParameters.disablePayment',
  'admin.empty.audit',
  'media.processing.pending',
  'media.processing.processing',
  'media.processing.ready',
  'media.processing.failed',
  'media.actions.retry',
];

describe('admin i18n smoke', () => {
  it('has admin terminology in every supported locale', () => {
    for (const locale of locales) {
      for (const key of adminKeys) {
        expect(dictionaries[locale][key]).toBeTruthy();
        expect(t(key, locale)).not.toBe(key);
      }
    }
  });
});
