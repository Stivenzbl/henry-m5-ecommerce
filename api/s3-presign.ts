/**
 * Vercel Serverless Function: /api/s3-presign
 * Generates presigned URLs for direct AWS S3 uploads without exposing AWS credentials to the frontend.
 * 
 * Required Vercel Environment Variables:
 * - AWS_ACCESS_KEY_ID
 * - AWS_SECRET_ACCESS_KEY
 * - AWS_REGION
 * - AWS_S3_BUCKET_NAME
 */

export interface PresignRequest {
  fileName: string;
  fileType: string;
}

export interface PresignResponse {
  uploadUrl: string;
  fileUrl: string;
  key: string;
}

// In production on Vercel:
// import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
// import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export default async function handler(req: { method: string; body: PresignRequest }): Promise<PresignResponse | { error: string }> {
  if (req.method !== 'POST') {
    return { error: 'Method not allowed. Use POST.' };
  }

  const { fileName, fileType } = req.body;
  if (!fileName || !fileType) {
    return { error: 'Missing fileName or fileType' };
  }

  const bucketName = process.env.AWS_S3_BUCKET_NAME || 'patagonix-retail-assets';
  const region = process.env.AWS_REGION || 'us-east-1';
  const cleanName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
  const key = `products/${Date.now()}-${cleanName}`;

  // Production SDK generation stub:
  /*
  const s3Client = new S3Client({
    region,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
  });

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    ContentType: fileType,
  });

  const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 300 });
  */

  const uploadUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${key}?simulated-presigned-token=${Date.now()}`;
  const fileUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${key}`;

  return {
    uploadUrl,
    fileUrl,
    key,
  };
}
