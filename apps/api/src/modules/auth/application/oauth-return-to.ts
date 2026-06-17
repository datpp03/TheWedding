import { BadRequestException } from '@nestjs/common';

const DEFAULT_RETURN_TO = '/dashboard';

export function validateReturnTo(value: string | undefined, appUrl: string): string {
  if (!value) {
    return DEFAULT_RETURN_TO;
  }

  if (value.startsWith('/') && !value.startsWith('//')) {
    return value;
  }

  try {
    const parsed = new URL(value);
    const app = new URL(appUrl);
    if (parsed.origin === app.origin) {
      return `${parsed.pathname}${parsed.search}${parsed.hash}`;
    }
  } catch {
    throw new BadRequestException('Invalid returnTo path');
  }

  throw new BadRequestException('Invalid returnTo path');
}

export function encodeOAuthState(input: { provider: string; returnTo: string }) {
  return Buffer.from(JSON.stringify(input)).toString('base64url');
}

export function decodeOAuthState(value: string | undefined, appUrl: string) {
  if (!value) {
    throw new BadRequestException('Missing OAuth state');
  }

  try {
    const parsed = JSON.parse(Buffer.from(value, 'base64url').toString('utf8')) as {
      provider?: unknown;
      returnTo?: unknown;
    };
    if (typeof parsed.provider !== 'string' || typeof parsed.returnTo !== 'string') {
      throw new Error('Invalid shape');
    }
    return {
      provider: parsed.provider,
      returnTo: validateReturnTo(parsed.returnTo, appUrl),
    };
  } catch {
    throw new BadRequestException('Invalid OAuth state');
  }
}
