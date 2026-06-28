# Storage Module

Owns storage adapter interfaces and provider implementations for local development and production object storage.

## Local Development

Use app-managed local storage:

- `STORAGE_PROVIDER=local`
- `LOCAL_STORAGE_PATH=./storage`

When the API is started from `apps/api`, the default local folder resolves to `apps/api/storage`. The folder should be gitignored, created automatically by the storage adapter if missing, and treated as disposable local development data.

Phase 4 implementation writes uploaded originals through `StorageService` with backend-generated keys:

```txt
tenants/{tenantId}/media/{mediaId}/original/{random}.{ext}
```

The adapter rejects path traversal attempts when resolving keys. Media APIs expose checked file endpoints instead of raw storage keys so album visibility and download permissions remain enforceable.

Phase 7 adds derivative writes through the same boundary:

```txt
tenants/{tenantId}/media/{mediaId}/versions/thumb_360.webp
tenants/{tenantId}/media/{mediaId}/versions/gallery_1280.webp
tenants/{tenantId}/media/{mediaId}/versions/lightbox_2048.webp
```

Original files remain private. Normal gallery display should use optimized derivative URLs when available, while original downloads continue through permission-checked API endpoints.

## Production Direction

Use S3-compatible object storage with private buckets and randomized storage keys.

Implemented early:

- `STORAGE_PROVIDER=r2` or `STORAGE_PROVIDER=s3` selects the S3-compatible adapter.
- API-managed uploads can write originals and derivatives to Cloudflare R2.
- Media file/download endpoints read through `StorageService`, so permission checks stay in the media module.

Still planned:

- Direct upload sessions.
- Multipart/resumable uploads.
- Dedicated signed URL endpoints.
- CDN/custom-domain delivery for public derivatives.

See `docs/STORAGE_STRATEGY.md` for the full storage architecture, upload flows, provider recommendation, and mobile roadmap.
