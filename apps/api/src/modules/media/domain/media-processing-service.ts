export const MEDIA_PROCESSING_SERVICE = Symbol('MEDIA_PROCESSING_SERVICE');

export type MediaProcessingJob = {
  mediaId: string;
  tenantId: string;
  storageKey: string;
  mimeType: string;
};

export interface MediaProcessingService {
  enqueueThumbnail(job: MediaProcessingJob): Promise<void>;
  enqueueOptimization(job: MediaProcessingJob): Promise<void>;
  enqueueVideoPreview(job: MediaProcessingJob): Promise<void>;
}
