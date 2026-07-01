export function getAppBaseUrl() {
  const configuredUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '') ||
    'http://localhost:3000';

  return configuredUrl.replace(/\/+$/, '');
}

export function getApiBaseUrl() {
  return (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000').replace(/\/+$/, '');
}

export function absoluteAppUrl(pathname = '/') {
  const normalizedPath = pathname.startsWith('/') ? pathname : `/${pathname}`;
  return `${getAppBaseUrl()}${normalizedPath}`;
}

export function absoluteApiUrl(pathname: string) {
  const normalizedPath = pathname.startsWith('/') ? pathname : `/${pathname}`;
  return `${getApiBaseUrl()}${normalizedPath}`;
}

export function absoluteMediaUrl(url: string | null | undefined) {
  if (!url) return undefined;
  if (/^https?:\/\//.test(url)) return url;
  return absoluteApiUrl(url);
}
