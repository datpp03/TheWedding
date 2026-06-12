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

## Production Direction

Use S3-compatible object storage with private buckets, randomized storage keys, and signed URLs for protected media.

See `docs/STORAGE_STRATEGY.md` for the full storage architecture, upload flows, provider recommendation, and mobile roadmap.
