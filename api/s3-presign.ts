import { S3Client } from '@aws-sdk/client-s3';
import { createPresignedPost } from '@aws-sdk/s3-presigned-post';
import { verifyAuthToken, VerifyAuthOptions } from './lib/verifyAuth';

export interface PresignRequest {
  fileName: string;
  fileType: string;
  fileSize?: number;
}

export interface PresignResponse {
  url: string;
  fields: Record<string, string>;
  fileUrl: string;
  key: string;
  mode: 'real';
}

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB strictly enforced by S3 policy

export default async function handler(req: any, res: any, testAuthOptions?: VerifyAuthOptions) {
  // 1. CORS Preflight
  if (req.method === 'OPTIONS') {
    if (res && typeof res.status === 'function') {
      return res.status(200).end();
    }
    return { ok: true };
  }

  // 2. HTTP Method Validation (405)
  if (req.method !== 'POST') {
    const errorBody = { 
      error: 'Método no permitido. Utilice POST.',
      code: 'METHOD_NOT_ALLOWED' 
    };
    if (res && typeof res.status === 'function') {
      return res.status(405).json(errorBody);
    }
    return errorBody;
  }

  // 3. Cryptographic JWT Authentication & Admin Custom Claim Validation (401 / 403)
  const authHeader = req.headers?.authorization || req.headers?.Authorization;
  let authResult;
  try {
    authResult = await verifyAuthToken(authHeader, testAuthOptions);
  } catch (err: any) {
    const isForbidden = err.message === 'TOKEN_UNAUTHORIZED';
    const statusCode = isForbidden ? 403 : 401;
    const errorBody = {
      error: isForbidden 
        ? 'Acceso denegado: Token no autorizado para operaciones administrativas.' 
        : 'No autorizado: Cabecera Authorization ausente o firma JWT inválida.',
      code: isForbidden ? 'FORBIDDEN_NOT_ADMIN' : 'AUTH_REQUIRED',
    };
    if (res && typeof res.status === 'function') {
      return res.status(statusCode).json(errorBody);
    }
    return errorBody;
  }

  if (!authResult.isAdmin) {
    const errorBody = {
      error: 'Acceso denegado: Se requieren permisos de Administrador (Custom Claim admin: true).',
      code: 'FORBIDDEN_NOT_ADMIN',
    };
    if (res && typeof res.status === 'function') {
      return res.status(403).json(errorBody);
    }
    return errorBody;
  }

  // 4. Request Body Validation (400)
  const body: PresignRequest = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
  const { fileName, fileType, fileSize } = body;

  if (!fileName || !fileType) {
    const errorBody = { 
      error: 'Campos requeridos ausentes: fileName y fileType.',
      code: 'MISSING_FIELDS'
    };
    if (res && typeof res.status === 'function') {
      return res.status(400).json(errorBody);
    }
    return errorBody;
  }

  // 5. MIME Allowlist Validation (415)
  const normalizedMime = fileType.toLowerCase().trim();
  if (!ALLOWED_MIME_TYPES.includes(normalizedMime)) {
    const errorBody = {
      error: `Formato de archivo no permitido (${fileType}). Solo se aceptan: ${ALLOWED_MIME_TYPES.join(', ')}.`,
      code: 'UNSUPPORTED_MEDIA_TYPE',
      allowedTypes: ALLOWED_MIME_TYPES,
    };
    if (res && typeof res.status === 'function') {
      return res.status(415).json(errorBody);
    }
    return errorBody;
  }

  // 6. Max File Size Pre-validation (413) - Defense in Depth
  // Note: AWS S3 also enforces content-length-range at bucket level via Presigned POST policy
  if (fileSize && fileSize > MAX_FILE_SIZE_BYTES) {
    const errorBody = {
      error: `El archivo supera el tamaño máximo permitido de 5 MB (${(fileSize / (1024 * 1024)).toFixed(2)} MB).`,
      code: 'PAYLOAD_TOO_LARGE',
      maxBytes: MAX_FILE_SIZE_BYTES,
    };
    if (res && typeof res.status === 'function') {
      return res.status(413).json(errorBody);
    }
    return errorBody;
  }

  // 7. Cloud Storage Configuration (503 Fail-Closed)
  const bucketName = process.env.AWS_S3_BUCKET_NAME;
  const region = process.env.AWS_REGION || 'us-east-2';
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

  if (!accessKeyId || !secretAccessKey || !bucketName) {
    const errorBody = {
      error: 'Servicio no disponible: Credenciales de almacenamiento AWS S3 no configuradas.',
      code: 'STORAGE_UNCONFIGURED',
    };
    if (res && typeof res.status === 'function') {
      return res.status(503).json(errorBody);
    }
    return errorBody;
  }

  // 7. Generate AWS S3 Presigned POST with content-length-range constraint
  const cleanName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
  const key = `products/${Date.now()}-${cleanName}`;

  try {
    const s3Client = new S3Client({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });

    const presignedPost = await createPresignedPost(s3Client, {
      Bucket: bucketName,
      Key: key,
      Conditions: [
        ['content-length-range', 1, MAX_FILE_SIZE_BYTES], // Strictly enforced on AWS S3 side!
        ['starts-with', '$Content-Type', 'image/'],
      ],
      Fields: {
        'Content-Type': normalizedMime,
      },
      Expires: 300, // 5 minutes
    });

    const fileUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${key}`;

    const payload: PresignResponse = {
      url: presignedPost.url,
      fields: presignedPost.fields,
      fileUrl,
      key,
      mode: 'real',
    };

    if (res && typeof res.status === 'function') {
      return res.status(200).json(payload);
    }
    return payload;
  } catch (err: any) {
    console.error('Error generating authentic AWS S3 presigned POST:', err);
    const errorBody = { 
      error: 'Error interno al generar firma criptográfica S3.',
      code: 'S3_PRESIGN_ERROR'
    };
    if (res && typeof res.status === 'function') {
      return res.status(500).json(errorBody);
    }
    return errorBody;
  }
}
