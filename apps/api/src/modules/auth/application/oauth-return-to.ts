import { BadRequestException } from '@nestjs/common';
import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';

const DEFAULT_RETURN_TO = '/dashboard';
const MAX_STATE_AGE_MS = 10 * 60 * 1000;

export type OAuthStateMode = 'link' | 'login';

export type OAuthState = {
  issuedAt: number;
  mode: OAuthStateMode;
  nonce: string;
  provider: string;
  returnTo: string;
  userId?: string;
};

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

export function encodeOAuthState(
  input: {
    mode?: OAuthStateMode;
    provider: string;
    returnTo: string;
    userId?: string;
  },
  secret: string,
) {
  const payload: OAuthState = {
    issuedAt: Date.now(),
    mode: input.mode ?? 'login',
    nonce: randomBytes(16).toString('base64url'),
    provider: input.provider,
    returnTo: input.returnTo,
    userId: input.userId,
  };
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = signState(encodedPayload, secret);

  return `${encodedPayload}.${signature}`;
}

export function decodeOAuthState(value: string | undefined, appUrl: string, secret: string) {
  if (!value) {
    throw new BadRequestException('Missing OAuth state');
  }

  try {
    const [encodedPayload, signature] = value.split('.');
    if (!encodedPayload || !signature || !verifyStateSignature(encodedPayload, signature, secret)) {
      throw new Error('Invalid signature');
    }

    const parsed = JSON.parse(Buffer.from(encodedPayload, 'base64url').toString('utf8')) as {
      issuedAt?: unknown;
      mode?: unknown;
      nonce?: unknown;
      provider?: unknown;
      returnTo?: unknown;
      userId?: unknown;
    };
    if (
      typeof parsed.issuedAt !== 'number' ||
      typeof parsed.mode !== 'string' ||
      typeof parsed.nonce !== 'string' ||
      typeof parsed.provider !== 'string' ||
      typeof parsed.returnTo !== 'string'
    ) {
      throw new Error('Invalid shape');
    }

    if (Date.now() - parsed.issuedAt > MAX_STATE_AGE_MS) {
      throw new Error('Expired state');
    }

    if (parsed.mode !== 'login' && parsed.mode !== 'link') {
      throw new Error('Invalid mode');
    }

    if (parsed.userId !== undefined && typeof parsed.userId !== 'string') {
      throw new Error('Invalid user id');
    }

    return {
      issuedAt: parsed.issuedAt,
      mode: parsed.mode,
      nonce: parsed.nonce,
      provider: parsed.provider,
      returnTo: validateReturnTo(parsed.returnTo, appUrl),
      userId: parsed.userId,
    };
  } catch {
    throw new BadRequestException('Invalid OAuth state');
  }
}

function signState(encodedPayload: string, secret: string) {
  return createHmac('sha256', secret).update(encodedPayload).digest('base64url');
}

function verifyStateSignature(encodedPayload: string, signature: string, secret: string) {
  const expected = Buffer.from(signState(encodedPayload, secret));
  const actual = Buffer.from(signature);

  return expected.length === actual.length && timingSafeEqual(expected, actual);
}
