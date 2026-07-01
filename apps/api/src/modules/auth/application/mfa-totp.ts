import { createCipheriv, createDecipheriv, createHmac, createHash, randomBytes } from 'node:crypto';

const BASE32_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
const TOTP_STEP_SECONDS = 30;
const TOTP_DIGITS = 6;
const ENCRYPTION_VERSION = 'v1';

export function generateTotpSecret(): string {
  return encodeBase32(randomBytes(20));
}

export function buildTotpUri(input: { accountName: string; issuer: string; secret: string }) {
  const label = `${input.issuer}:${input.accountName}`;
  const url = new URL(`otpauth://totp/${encodeURIComponent(label)}`);
  url.searchParams.set('secret', input.secret);
  url.searchParams.set('issuer', input.issuer);
  url.searchParams.set('algorithm', 'SHA1');
  url.searchParams.set('digits', String(TOTP_DIGITS));
  url.searchParams.set('period', String(TOTP_STEP_SECONDS));
  return url.toString();
}

export function verifyTotpCode(input: { code: string; secret: string; window?: number }) {
  const normalizedCode = input.code.replace(/\s+/g, '');
  if (!/^\d{6}$/.test(normalizedCode)) {
    return false;
  }

  const now = Math.floor(Date.now() / 1000 / TOTP_STEP_SECONDS);
  const window = input.window ?? 1;

  for (let offset = -window; offset <= window; offset += 1) {
    if (generateTotpCode(input.secret, now + offset) === normalizedCode) {
      return true;
    }
  }

  return false;
}

export function createTotpCode(secret: string, timestampMs = Date.now()) {
  return generateTotpCode(secret, Math.floor(timestampMs / 1000 / TOTP_STEP_SECONDS));
}

export function encryptMfaSecret(secret: string, keyMaterial: string) {
  const key = deriveEncryptionKey(keyMaterial);
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', key, iv);
  const ciphertext = Buffer.concat([cipher.update(secret, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();

  return [
    ENCRYPTION_VERSION,
    iv.toString('base64url'),
    tag.toString('base64url'),
    ciphertext.toString('base64url'),
  ].join('.');
}

export function decryptMfaSecret(encrypted: string, keyMaterial: string) {
  const [version, iv, tag, ciphertext] = encrypted.split('.');

  if (version !== ENCRYPTION_VERSION || !iv || !tag || !ciphertext) {
    throw new Error('Invalid MFA secret format');
  }

  const decipher = createDecipheriv(
    'aes-256-gcm',
    deriveEncryptionKey(keyMaterial),
    Buffer.from(iv, 'base64url'),
  );
  decipher.setAuthTag(Buffer.from(tag, 'base64url'));

  return Buffer.concat([
    decipher.update(Buffer.from(ciphertext, 'base64url')),
    decipher.final(),
  ]).toString('utf8');
}

function generateTotpCode(secret: string, counter: number) {
  const key = decodeBase32(secret);
  const buffer = Buffer.alloc(8);
  buffer.writeBigUInt64BE(BigInt(counter));
  const hmac = createHmac('sha1', key).update(buffer).digest();
  const offset = (hmac[hmac.length - 1] ?? 0) & 0x0f;
  const binary =
    ((readHmacByte(hmac, offset) & 0x7f) << 24) |
    ((readHmacByte(hmac, offset + 1) & 0xff) << 16) |
    ((readHmacByte(hmac, offset + 2) & 0xff) << 8) |
    (readHmacByte(hmac, offset + 3) & 0xff);

  return String(binary % 10 ** TOTP_DIGITS).padStart(TOTP_DIGITS, '0');
}

function readHmacByte(hmac: Buffer, offset: number) {
  return hmac[offset] ?? 0;
}

function encodeBase32(value: Buffer) {
  let bits = '';
  let output = '';

  for (const byte of value) {
    bits += byte.toString(2).padStart(8, '0');
  }

  for (let index = 0; index < bits.length; index += 5) {
    const chunk = bits.slice(index, index + 5).padEnd(5, '0');
    output += BASE32_ALPHABET[Number.parseInt(chunk, 2)];
  }

  return output;
}

function decodeBase32(value: string) {
  const normalized = value.replace(/=+$/g, '').replace(/\s+/g, '').toUpperCase();
  let bits = '';

  for (const char of normalized) {
    const index = BASE32_ALPHABET.indexOf(char);
    if (index === -1) {
      throw new Error('Invalid base32 secret');
    }
    bits += index.toString(2).padStart(5, '0');
  }

  const bytes: number[] = [];
  for (let index = 0; index + 8 <= bits.length; index += 8) {
    bytes.push(Number.parseInt(bits.slice(index, index + 8), 2));
  }

  return Buffer.from(bytes);
}

function deriveEncryptionKey(keyMaterial: string) {
  return createHash('sha256').update(keyMaterial).digest();
}
