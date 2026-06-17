import { BadRequestException } from '@nestjs/common';
import { decodeOAuthState, encodeOAuthState, validateReturnTo } from './oauth-return-to';

describe('OAuth returnTo validation', () => {
  const appUrl = 'https://thewedding.d-ajt.app';

  it('allows relative same-origin paths', () => {
    expect(validateReturnTo('/albums/album-1?intent=wish', appUrl)).toBe(
      '/albums/album-1?intent=wish',
    );
  });

  it('normalizes same-origin absolute URLs', () => {
    expect(validateReturnTo('https://thewedding.d-ajt.app/albums/album-1', appUrl)).toBe(
      '/albums/album-1',
    );
  });

  it('rejects open redirects', () => {
    expect(() => validateReturnTo('https://evil.example/phish', appUrl)).toThrow(
      BadRequestException,
    );
    expect(() => validateReturnTo('//evil.example/phish', appUrl)).toThrow(BadRequestException);
  });

  it('round-trips safe OAuth state', () => {
    const state = encodeOAuthState({ provider: 'google', returnTo: '/albums/album-1' });

    expect(decodeOAuthState(state, appUrl)).toEqual({
      provider: 'google',
      returnTo: '/albums/album-1',
    });
  });
});
