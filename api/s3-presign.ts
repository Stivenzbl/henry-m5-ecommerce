import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

/**
 * Vercel Serverless Function: /api/s3-presign
 * Generates presigned URLs for direct AWS S3 uploads without exposing AWS credentials to the frontend.
 * 
 * Required Vercel Environment Variables:
 * - AWS_ACCESS_KEY_ID
 * - AWS_SECRET_ACCESS_KEY
 * - AWS_REGION (e.g. us-east-1)
 * - AWS_S3_BUCKET_NAME (e.g. patagonix-retail-bucket)
 */

export interface PresignRequest {
  fileName: string;
  fileType: string;
}

export interface PresignResponse {
  uploadUrl: string;
  fileUrl: string;
  key: string;
  mode: 'real' | 'demo';
}

export default async function handler(req: any, res: any) {
  // CORS & method validation
  if (req.method === 'OPTIONS') {
    if (res && typeof res.status === 'function') {
      return res.status(200).end();
    }
    return { ok: true };
  }

  if (req.method !== 'POST') {
    const errorBody = { error: 'Method not allowed. Use POST.' };
    if (res && typeof res.status === 'function') {
      return res.status(405).json(errorBody);
    }
    return errorBody;
  }

  const body: PresignRequest = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
  const { fileName, fileType } = body;

  if (!fileName || !fileType) {
    const errorBody = { error: 'Missing fileName or fileType' };
    if (res && typeof res.status === 'function') {
      return res.status(400).json(errorBody);
    }
    return errorBody;
  }

  const bucketName = process.env.AWS_S3_BUCKET_NAME;
  const region = process.env.AWS_REGION || 'us-east-1';
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

  const cleanName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
  const key = `products/${Date.now()}-${cleanName}`;

  // 1. If real AWS credentials exist, generate authentic HMAC-SHA256 presigned URL
  if (accessKeyId && secretAccessKey && bucketName) {
    try {
      const s3Client = new S3Client({
        region,
        credentials: {
          accessKeyId,
          secretAccessKey,
        },
      });

      const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        ContentType: fileType,
      });

      const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 300 });
      const fileUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${key}`;

      const payload: PresignResponse = {
        uploadUrl,
        fileUrl,
        key,
        mode: 'real',
      };

      if (res && typeof res.status === 'function') {
        return res.status(200).json(payload);
      }
      return payload;
    } catch (err: any) {
      console.error('Error generating authentic AWS S3 presigned URL:', err);
    }
  }

  // 2. Transparent fallback for local demo when credentials are not yet configured
  const fallbackBucket = bucketName || 'patagonix-retail-assets';
  const simulatedUrl = `https://${fallbackBucket}.s3.${region}.amazonaws.com/${key}?demo-presigned-token=${Date.now()}`;
  const fileUrl = `https://${fallbackBucket}.s3.${region}.amazonaws.com/${key}`;

  const payload: PresignResponse = {
    uploadUrl: simulatedUrl,
    fileUrl,
    key,
    mode: 'demo',
  };

  if (res && typeof res.status === 'function') {
    return res.status(200).json(payload);
  }
  return payload;
}
