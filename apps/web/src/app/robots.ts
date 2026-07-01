import type { MetadataRoute } from 'next';
import { getAppBaseUrl } from '@/lib/seo';

const privatePaths = [
  '/api/',
  '/admin',
  '/dashboard',
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/verify-email',
  '/oauth',
  '/payment',
  '/realtime',
  '/webhooks',
  '/storage',
  '/media/raw',
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: privatePaths,
      },
      {
        userAgent: ['GPTBot', 'OAI-SearchBot'],
        allow: '/',
        disallow: privatePaths,
      },
    ],
    sitemap: `${getAppBaseUrl()}/sitemap.xml`,
    host: getAppBaseUrl(),
  };
}
