export const uploadConfig = {
  allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'] as const,
  maxFileSizeBytes: 5 * 1024 * 1024, // 5 MB
  presignedUrlExpiresSeconds: 300, // 5 minutes
  s3Prefix: 'products/',
} as const;
