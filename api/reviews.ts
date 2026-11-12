import { verifyAuthToken, VerifyAuthOptions } from './lib/verifyAuth';
import {
  getAuthoritativeProduct,
  hasAuthoritativeCompletedOrder,
  addAuthoritativeReview,
} from './lib/serverStore';
import { Review } from '../src/types/product';

export interface CreateReviewRequestBody {
  productId: string;
  rating: number;
  comment: string;
  userName?: string;
}

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
      code: 'METHOD_NOT_ALLOWED',
    };
    if (res && typeof res.status === 'function') {
      return res.status(405).json(errorBody);
    }
    return errorBody;
  }

  // 3. Cryptographic JWT Authentication (401)
  const authHeader = req.headers?.authorization || req.headers?.Authorization;
  let authResult;
  try {
    authResult = await verifyAuthToken(authHeader, testAuthOptions);
  } catch (err: any) {
    const errorBody = {
      error: 'No autorizado: Debes iniciar sesión para publicar una reseña.',
      code: 'AUTH_REQUIRED',
    };
    if (res && typeof res.status === 'function') {
      return res.status(401).json(errorBody);
    }
    return errorBody;
  }

  // 4. Request Body Validation
  const body: CreateReviewRequestBody =
    typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};

  const { productId, rating, comment } = body;

  if (!productId || typeof productId !== 'string') {
    const errorBody = {
      error: 'Identificador de producto ausente o inválido.',
      code: 'INVALID_PRODUCT_ID',
    };
    if (res && typeof res.status === 'function') {
      return res.status(400).json(errorBody);
    }
    return errorBody;
  }

  const numRating = Number(rating);
  if (isNaN(numRating) || numRating < 1 || numRating > 5) {
    const errorBody = {
      error: 'La calificación debe ser un número entero entre 1 y 5 estrellas.',
      code: 'INVALID_RATING',
    };
    if (res && typeof res.status === 'function') {
      return res.status(400).json(errorBody);
    }
    return errorBody;
  }

  if (!comment || typeof comment !== 'string' || comment.trim().length < 3) {
    const errorBody = {
      error: 'El comentario de la reseña debe contener al menos 3 caracteres.',
      code: 'INVALID_COMMENT',
    };
    if (res && typeof res.status === 'function') {
      return res.status(400).json(errorBody);
    }
    return errorBody;
  }

  // 5. Product Existence Check
  const product = await getAuthoritativeProduct(productId);
  if (!product) {
    const errorBody = {
      error: `El producto ${productId} no existe en el catálogo.`,
      code: 'PRODUCT_NOT_FOUND',
    };
    if (res && typeof res.status === 'function') {
      return res.status(404).json(errorBody);
    }
    return errorBody;
  }

  // 6. SERVER-SIDE VERIFIED BUYER CHECK (P0.2 REMEDIATION)
  // Queries authoritative database for an order belonging to authResult.uid with status === 'completed'
  const isVerifiedBuyer = await hasAuthoritativeCompletedOrder(authResult.uid, productId);

  // 7. Construct Immutable Review
  const newReview: Review = {
    id: `rev-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    productId,
    userId: authResult.uid, // DERIVED FROM JWT
    userName: body.userName || authResult.email?.split('@')[0] || 'Cliente Verificado',
    rating: Math.round(numRating),
    comment: comment.trim(),
    createdAt: new Date().toISOString(),
    isVerifiedBuyer, // DETERMINED SOLELY BY BACKEND
  };

  // 8. Persist Review and Recalculate Aggregate Rating Server-Side
  const updatedProduct = await addAuthoritativeReview(productId, newReview);

  const responseBody = {
    success: true,
    review: newReview,
    product: updatedProduct,
  };

  if (res && typeof res.status === 'function') {
    return res.status(201).json(responseBody);
  }
  return responseBody;
}
