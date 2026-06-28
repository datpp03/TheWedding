export const STORAGE_SERVICE = Symbol('STORAGE_SERVICE');

export type UploadOptions = {
  tenantId: string;
  mediaId: string;
  extension: string;
  contentType: string;
  visibility: 'public' | 'private';
};

export type PutOptions = UploadOptions & {
  key: string;
};

export type UploadedFile = {
  key: string;
  url: string | null;
  size: number;
  contentType: string;
};

export interface StorageService {
  upload(file: Buffer, options: UploadOptions): Promise<UploadedFile>;
  put(file: Buffer, options: PutOptions): Promise<UploadedFile>;
  read(key: string): Promise<Buffer>;
  delete(key: string): Promise<void>;
  getSignedUrl(key: string, options: { expiresInSeconds: number }): Promise<string>;
  getPublicUrl(key: string): string | null;
}
