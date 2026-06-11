export const STORAGE_SERVICE = Symbol('STORAGE_SERVICE');

export type UploadOptions = {
  tenantId: string;
  contentType: string;
  visibility: 'public' | 'private';
};

export type UploadedFile = {
  key: string;
  url: string;
  size: number;
  contentType: string;
};

export interface StorageService {
  upload(file: Buffer, options: UploadOptions): Promise<UploadedFile>;
  delete(key: string): Promise<void>;
  getSignedUrl(key: string, options: { expiresInSeconds: number }): Promise<string>;
  getPublicUrl(key: string): string;
}

