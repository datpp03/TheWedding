# Media Module

Owns image/video upload, validation, metadata, reordering, download authorization, media versions, and processing status.

## Phase 7 Processing

- Upload stores the original as private and creates an `original` media version without a public URL.
- `MediaProcessingService` enqueues processing through BullMQ/Redis when `REDIS_URL` is configured and uses an inline async fallback for local smoke tests.
- Image jobs generate thumbnail, gallery, and lightbox WebP versions with backend-controlled storage keys.
- Jobs are idempotent through the unique `mediaId + versionType` constraint and TypeORM upsert.
- Failed processing stores `processingFailureReason`; owner UI can call retry without creating duplicate media versions.
- Future AI editing/quality optimization, malware scanning, plan gates, and paid quota accounting should attach behind this processing boundary.
