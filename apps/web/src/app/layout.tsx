import type { Metadata } from 'next';
import { LocaleProvider } from '@/lib/i18n/locale-provider';
import { getAppBaseUrl } from '@/lib/seo';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(getAppBaseUrl()),
  title: {
    default: 'The Wedding',
    template: '%s | The Wedding',
  },
  description: 'Public and private wedding photo and video galleries for modern couples.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'The Wedding',
    description: 'Public and private wedding photo and video galleries for modern couples.',
    siteName: 'The Wedding',
    type: 'website',
    url: '/',
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi">
      <body>
        <LocaleProvider>{children}</LocaleProvider>
      </body>
    </html>
  );
}
