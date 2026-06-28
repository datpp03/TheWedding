import { randomBytes } from 'node:crypto';
import path from 'node:path';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import type {
  PutOptions,
  StorageService,
  UploadOptions,
  UploadedFile,
} from '../domain/storage.service';

@Injectable()
export class S3CompatibleStorageService implements StorageService {
  private readonly bucket: string;
  private readonly client: S3Client;
  private readonly publicBaseUrl: string;

  constructor(private readonly config: ConfigService) {
    this.bucket = this.config.get<string>('S3_BUCKET', '');
    this.publicBaseUrl = normalizeBaseUrl(this.config.get<string>('STORAGE_PUBLIC_BASE_URL', ''));
    this.client = new S3Client({
      credentials: {
        accessKeyId: this.config.get<string>('S3_ACCESS_KEY', ''),
        secretAccessKey: this.config.get<string>('S3_SECRET_KEY', ''),
      },
      endpoint: this.config.get<string>('S3_ENDPOINT', '') || undefined,
      forcePathStyle: true,
      region: this.config.get<string>('S3_REGION', '') || 'auto',
    });
  }

  assertConfigured() {
    const missing = ['S3_ENDPOINT', 'S3_BUCKET', 'S3_ACCESS_KEY', 'S3_SECRET_KEY'].filter(
      (key) => !this.config.get<string>(key, ''),
    );
    if (missing.length) {
      throw new Error(`Missing S3-compatible storage env vars: ${missing.join(', ')}`);
    }
  }

  async upload(file: Buffer, options: UploadOptions): Promise<UploadedFile> {
    const key = createStorageKey(options);
    return this.put(file, { ...options, key });
  }

  async put(file: Buffer, options: PutOptions): Promise<UploadedFile> {
    const key = normalizeWritableKey(options.key, options);
    await this.client.send(
      new PutObjectCommand({
        Body: file,
        Bucket: this.bucket,
        CacheControl:
          options.visibility === 'public' ? 'public, max-age=31536000, immutable' : undefined,
        ContentType: options.contentType,
        Key: key,
      }),
    );

    return {
      contentType: options.contentType,
      key,
      size: file.byteLength,
      url: options.visibility === 'public' ? this.getPublicUrl(key) : null,
    };
  }

  async read(key: string): Promise<Buffer> {
    const response = await this.client.send(
      new GetObjectCommand({
        Bucket: this.bucket,
        Key: normalizeReadableKey(key),
      }),
    );
    if (!response.Body) {
      throw new Error('Object body is empty');
    }
    const body = response.Body as {
      transformToByteArray?: () => Promise<Uint8Array>;
      [Symbol.asyncIterator]?: () => AsyncIterator<Uint8Array | Buffer | string>;
    };
    if (body.transformToByteArray) {
      return Buffer.from(await body.transformToByteArray());
    }

    const chunks: Buffer[] = [];
    for await (const chunk of response.Body as AsyncIterable<Uint8Array | Buffer | string>) {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    }
    return Buffer.concat(chunks);
  }

  async delete(key: string): Promise<void> {
    await this.client.send(
      new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: normalizeReadableKey(key),
      }),
    );
  }

  getSignedUrl(key: string, options: { expiresInSeconds: number }): Promise<string> {
    return getSignedUrl(
      this.client,
      new GetObjectCommand({
        Bucket: this.bucket,
        Key: normalizeReadableKey(key),
      }),
      { expiresIn: options.expiresInSeconds },
    );
  }

  getPublicUrl(key: string): string | null {
    if (!this.publicBaseUrl) return null;
    return `${this.publicBaseUrl}/${normalizeReadableKey(key).split('/').map(encodeURIComponent).join('/')}`;
  }
}

function createStorageKey(options: UploadOptions) {
  const extension = options.extension.replace(/^\./, '').toLowerCase();
  const randomName = randomBytes(18).toString('hex');
  return path.posix.join(
    'tenants',
    options.tenantId,
    'media',
    options.mediaId,
    'original',
    `${randomName}.${extension}`,
  );
}

function normalizeWritableKey(key: string, options: UploadOptions) {
  const normalizedKey = normalizeReadableKey(key);
  const expectedPrefix = `tenants/${options.tenantId}/media/${options.mediaId}/`;
  if (!normalizedKey.startsWith(expectedPrefix)) {
    throw new Error('Storage key does not belong to the media item');
  }
  return normalizedKey;
}

function normalizeReadableKey(key: string) {
  const normalizedKey = key.replace(/\\/g, '/').replace(/^\/+/, '');
  if (!normalizedKey || normalizedKey.includes('..') || path.posix.isAbsolute(normalizedKey)) {
    throw new Error('Invalid storage key');
  }
  return normalizedKey;
}

function normalizeBaseUrl(value: string) {
  return value.trim().replace(/\/+$/, '');
}
