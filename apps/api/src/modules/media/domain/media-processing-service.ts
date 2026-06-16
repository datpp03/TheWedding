export const MEDIA_PROCESSING_SERVICE = Symbol('MEDIA_PROCESSING_SERVICE');

export type MediaProcessingJob = {
  mediaId: string;
  tenantId: string;
  storageKey: string;
  mimeType: string;
  type: string;
};

export interface MediaProcessingService {
  enqueue(job: MediaProcessingJob): Promise<void>;
  retry(mediaId: string): Promise<void>;
}
