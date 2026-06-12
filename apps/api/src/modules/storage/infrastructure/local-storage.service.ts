import { randomBytes } from 'node:crypto';
import { mkdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { StorageService, UploadOptions, UploadedFile } from '../domain/storage.service';

@Injectable()
export class LocalStorageService implements StorageService {
  private readonly rootPath: string;

  constructor(private readonly config: ConfigService) {
    this.rootPath = path.resolve(this.config.get<string>('LOCAL_STORAGE_PATH', './storage'));
  }

  async upload(file: Buffer, options: UploadOptions): Promise<UploadedFile> {
    const key = this.createStorageKey(options);
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
}
