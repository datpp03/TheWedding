export const MEDIA_TYPE = {
  IMAGE: 'image',
  VIDEO: 'video',
} as const;

export type MediaType = (typeof MEDIA_TYPE)[keyof typeof MEDIA_TYPE];

export const MEDIA_PROCESSING_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  READY: 'ready',
  FAILED: 'failed',
} as const;

export type MediaProcessingStatus =
  (typeof MEDIA_PROCESSING_STATUS)[keyof typeof MEDIA_PROCESSING_STATUS];

export const MEDIA_VERSION_TYPE = {
  ORIGINAL: 'original',
  OPTIMIZED: 'optimized',
  THUMBNAIL: 'thumbnail',
  EDITED: 'edited',
} as const;

export type MediaVersionType = (typeof MEDIA_VERSION_TYPE)[keyof typeof MEDIA_VERSION_TYPE];
