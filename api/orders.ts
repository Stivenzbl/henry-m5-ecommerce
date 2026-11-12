import { verifyAuthToken, VerifyAuthOptions } from './lib/verifyAuth';
import {
  getAuthoritativeProduct,
  reserveProductStock,
  rollbackProductStock,
  saveAuthoritativeOrder,
} from './lib/serverStore';
import { Order } from '../src/types/order';
import { CartItem } from '../src/types/cart';

export interface CreateOrderRequestBody {
  items: Array<{ productId: string; quantity: number }>;
  shippingAddress: {
    street: string;
    city: string;
    country?: string;
    postalCode?: string;
  };
  idempotencyKey?: string;
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
      error: 'No autorizado: Cabecera Authorization ausente o firma JWT inválida.',
      code: 'AUTH_REQUIRED',
    };
    if (res && typeof res.status === 'function') {
      return res.status(401).json(errorBody);
    }
    return errorBody;
  }

  // 4. Request Body Validation
  const body: CreateOrderRequestBody =
    typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};

  const { items, shippingAddress } = body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    const errorBody = {
      error: 'El pedido debe contener al menos un producto válido.',
      code: 'EMPTY_CART',
    };
    if (res && typeof res.status === 'function') {
      return res.status(400).json(errorBody);
    }
    return errorBody;
  }

  if (!shippingAddress || !shippingAddress.street || !shippingAddress.city) {
    const errorBody = {
      error: 'Dirección de envío incompleta (calle y ciudad requeridas).',
      code: 'INVALID_ADDRESS',
    };
    if (res && typeof res.status === 'function') {
      return res.status(400).json(errorBody);
    }
    return errorBody;
  }

  // 5. Authoritative Pricing & Atomic Inventory Reservation
  const verifiedItems: CartItem[] = [];
  const reservedItems: Array<{ productId: string; quantity: number }> = [];
  let calculatedTotalPrice = 0;
  let calculatedTotalQuantity = 0;

  try {
    for (const item of items) {
      if (!item.productId || typeof item.productId !== 'string') {
        throw new Error('Identificador de producto inválido en la solicitud.');
      }

      if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
        throw new Error(`Cantidad inválida (${item.quantity}). Debe ser un entero positivo.`);
      }

      // Authoritative catalog product fetch (SERVER-SIDE ONLY)
      const catalogProduct = await getAuthoritativeProduct(item.productId);
      if (!catalogProduct) {
        throw new Error(`El producto ${item.productId} no existe en el catálogo.`);
      }

      // Atomic inventory check and decrement
      const reservation = await reserveProductStock(item.productId, item.quantity);
      if (!reservation.success) {
        throw new Error(reservation.error || `Stock insuficiente para ${catalogProduct.title}.`);
      }

      reservedItems.push({ productId: item.productId, quantity: item.quantity });

      const authoritativePrice = Number(catalogProduct.price);
      calculatedTotalPrice += authoritativePrice * item.quantity;
      calculatedTotalQuantity += item.quantity;

      verifiedItems.push({
        product: {
          ...catalogProduct,
          price: authoritativePrice,
        },
        quantity: item.quantity,
      });
    }
  } catch (err: any) {
    // Rollback any stock reserved during this failed transaction
    for (const reserved of reservedItems) {
      await rollbackProductStock(reserved.productId, reserved.quantity);
    }

    const errorBody = {
      error: err.message || 'Error durante la reserva transaccional de productos.',
      code: 'TRANSACTION_FAILED',
    };
    if (res && typeof res.status === 'function') {
      return res.status(400).json(errorBody);
    }
    return errorBody;
  }

  // Ensure round to 2 decimals
  calculatedTotalPrice = Math.round(calculatedTotalPrice * 100) / 100;

  // 6. Build Immutable Order (Identity derived SOLELY from verified JWT)
  const order: Order = {
    id: `ord-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    userId: authResult.uid, // DERIVED STRICTLY FROM JWT SUB
    userEmail: authResult.email || 'cliente@patagonix.com',
    items: verifiedItems,
    totalPrice: calculatedTotalPrice,
    totalQuantity: calculatedTotalQuantity,
    status: 'pending',
    shippingAddress: {
      street: shippingAddress.street,
      city: shippingAddress.city,
      country: shippingAddress.country || 'Colombia',
      postalCode: shippingAddress.postalCode || '110111',
    },
    createdAt: new Date().toISOString(),
  };

  // 7. Persist Authoritative Order
  await saveAuthoritativeOrder(order);

  const responseBody = {
    success: true,
    order,
  };

  if (res && typeof res.status === 'function') {
    return res.status(201).json(responseBody);
  }
  return responseBody;
}
