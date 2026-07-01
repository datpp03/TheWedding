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
  'language.label',
  'language.vi',
  'language.en',
  'language.ja',
  'admin.empty.audit',
  'media.processing.pending',
  'media.processing.processing',
  'media.processing.ready',
  'media.processing.failed',
  'media.actions.retry',
];

const authKeys = [
  'auth.login.title',
  'auth.login.submit',
  'auth.mfa.title',
  'auth.mfa.verify',
  'auth.oauth.google',
  'auth.oauth.facebook',
  'auth.security.title',
  'auth.security.startMfa',
  'auth.security.linkProvider',
  'dashboard.settings.title',
];

const publicKeys = [
  'public.home.metaTitle',
  'public.home.title',
  'public.home.todayTitle',
  'public.home.weekTitle',
  'public.card.openAlbum',
  'public.site.notFoundTitle',
  'public.album.notFoundTitle',
  'public.album.gallery',
  'social.title',
  'social.sendWish',
  'social.emptyWishes',
];

describe('admin i18n smoke', () => {
  it('has admin terminology in every supported locale', () => {
    for (const locale of locales) {
      for (const key of [...adminKeys, ...authKeys, ...publicKeys]) {
        expect(dictionaries[locale][key]).toBeTruthy();
        expect(t(key, locale)).not.toBe(key);
      }
    }
  });

  it('keeps Vietnamese dashboard strings accented', () => {
    const accentedVietnamese =
      /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i;
    for (const key of [
      'nav.dashboard',
      'admin.loading',
      'media.processing.pending',
      'themes.page.title',
    ]) {
      expect(dictionaries.vi[key]).toMatch(accentedVietnamese);
    }
  });
});
