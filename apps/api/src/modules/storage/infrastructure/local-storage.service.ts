import { randomBytes } from 'node:crypto';
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type {
  PutOptions,
  StorageService,
  UploadOptions,
  UploadedFile,
} from '../domain/storage.service';

@Injectable()
export class LocalStorageService implements StorageService {
  private readonly rootPath: string;

  constructor(private readonly config: ConfigService) {
    this.rootPath = path.resolve(this.config.get<string>('LOCAL_STORAGE_PATH', './storage'));
  }

  async upload(file: Buffer, options: UploadOptions): Promise<UploadedFile> {
    const key = this.createStorageKey(options);
    return this.put(file, { ...options, key });
  }

  async put(file: Buffer, options: PutOptions): Promise<UploadedFile> {
    const key = this.normalizeWritableKey(options.key, options);
    const targetPath = this.resolveKey(key);

    await mkdir(path.dirname(targetPath), { recursive: true });
    await writeFile(targetPath, file);

    return {
      contentType: options.contentType,
      key,
      size: file.byteLength,
      url: this.getPublicUrl(key),
    };
  }

  read(key: string): Promise<Buffer> {
    return readFile(this.resolveKey(key));
  }

  async delete(key: string): Promise<void> {
    await rm(this.resolveKey(key), { force: true });
  }

  getSignedUrl(key: string): Promise<string> {
    return Promise.resolve(this.getPublicUrl(key));
  }

  getPublicUrl(key: string): string {
    return `/api/v1/storage/local/${encodeURIComponent(key)}`;
  }

  resolveKey(key: string): string {
    const normalizedKey = key.replace(/\\/g, '/');
    if (normalizedKey.includes('..') || path.isAbsolute(normalizedKey)) {
      throw new Error('Invalid storage key');
    }

    const targetPath = path.resolve(this.rootPath, normalizedKey);
    if (!targetPath.startsWith(this.rootPath + path.sep)) {
      throw new Error('Invalid storage key');
    }

    return targetPath;
  }

  private createStorageKey(options: UploadOptions) {
    const extension = options.extension.replace(/^\./, '').toLowerCase();
    const randomName = randomBytes(18).toString('hex');
    return path.posix
      .join(
        'tenants',
        options.tenantId,
        'media',
        options.mediaId,
        'original',
        `${randomName}.${extension}`,
      )
      .replace(/\\/g, '/');
  }

  private normalizeWritableKey(key: string, options: UploadOptions) {
    const normalizedKey = key.replace(/\\/g, '/');
    const expectedPrefix = `tenants/${options.tenantId}/media/${options.mediaId}/`;
    if (!normalizedKey.startsWith(expectedPrefix)) {
      throw new Error('Storage key does not belong to the media item');
    }
    return normalizedKey;
  }
}
