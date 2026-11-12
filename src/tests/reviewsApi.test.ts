import { describe, it, expect, beforeEach, beforeAll } from 'vitest';
import { generateKeyPair, SignJWT } from 'jose';
import reviewsHandler from '../../api/reviews';
import {
  resetServerStore,
  saveAuthoritativeOrder,
  getAuthoritativeProduct,
} from '../../api/lib/serverStore';
import { VerifyAuthOptions } from '../../api/lib/verifyAuth';
import { Order } from '../../src/types/order';

describe('Authoritative Verified Buyer Review Gate (/api/reviews)', () => {
  let publicKey: any;
  let privateKey: any;
  let authOptions: VerifyAuthOptions;

  beforeAll(async () => {
    const keyPair = await generateKeyPair('RS256');
    publicKey = keyPair.publicKey;
    privateKey = keyPair.privateKey;
    authOptions = {
      keyOrJwks: publicKey,
      projectId: 'patagonix-retail',
    };
  });

  beforeEach(() => {
    resetServerStore();
  });

  const createMockRes = () => {
    const res: any = {};
    res.statusCode = 200;
    res.data = null;
    res.status = (code: number) => {
      res.statusCode = code;
      return res;
    };
    res.json = (payload: any) => {
      res.data = payload;
      return res;
    };
    res.end = () => res;
    return res;
  };

  const createSignedToken = async (claims: Record<string, any>) => {
    return await new SignJWT(claims)
      .setProtectedHeader({ alg: 'RS256', typ: 'JWT' })
      .setIssuer('https://securetoken.google.com/patagonix-retail')
      .setAudience('patagonix-retail')
      .setIssuedAt()
      .setExpirationTime('1h')
      .sign(privateKey);
  };

  it('rejects unauthenticated review submissions with HTTP 401', async () => {
    const req = {
      method: 'POST',
      headers: {},
      body: { productId: 'prod-001', rating: 5, comment: 'Buen producto' },
    };
    const res = createMockRes();

    await reviewsHandler(req, res, authOptions);

    expect(res.statusCode).toBe(401);
    expect(res.data.code).toBe('AUTH_REQUIRED');
  });

  it('rejects invalid rating numbers (not 1 to 5) with HTTP 400', async () => {
    const token = await createSignedToken({ sub: 'user-auth-1' });
    const req = {
      method: 'POST',
      headers: { authorization: `Bearer ${token}` },
      body: { productId: 'prod-001', rating: 10, comment: 'Rating inválido' },
    };
    const res = createMockRes();

    await reviewsHandler(req, res, authOptions);

    expect(res.statusCode).toBe(400);
    expect(res.data.code).toBe('INVALID_RATING');
  });

  it('neutralizes client-injected isVerifiedBuyer: true when user has no completed purchase', async () => {
    const userId = 'unverified-buyer-uid-100';
    const token = await createSignedToken({ sub: userId, email: 'unverified@patagonix.com' });

    // Client maliciously attempts to send isVerifiedBuyer: true
    const req = {
      method: 'POST',
      headers: { authorization: `Bearer ${token}` },
      body: {
        productId: 'prod-001',
        rating: 5,
        comment: 'Intento inyectar insignia de comprador verificado.',
        isVerifiedBuyer: true, // CLIENT FORGERY ATTEMPT
      },
    };
    const res = createMockRes();

    await reviewsHandler(req, res, authOptions);

    expect(res.statusCode).toBe(201);
    // Backend must deny verified buyer badge because no completed purchase exists
    expect(res.data.review.isVerifiedBuyer).toBe(false);
  });

  it('denies isVerifiedBuyer when order status is pending or processing', async () => {
    const userId = 'pending-buyer-uid-200';
    const token = await createSignedToken({ sub: userId, email: 'pending@patagonix.com' });

    // Seed order in database with status pending
    const pendingOrder: Order = {
      id: 'ord-pending-test',
      userId,
      userEmail: 'pending@patagonix.com',
      items: [{ product: { id: 'prod-001' } as any, quantity: 1 }],
      totalPrice: 189.99,
      totalQuantity: 1,
      status: 'pending', // NOT COMPLETED!
      shippingAddress: { street: 'Main St', city: 'Bogota', country: 'Colombia', postalCode: '110111' },
      createdAt: new Date().toISOString(),
    };
    await saveAuthoritativeOrder(pendingOrder);

    const req = {
      method: 'POST',
      headers: { authorization: `Bearer ${token}` },
      body: {
        productId: 'prod-001',
        rating: 4,
        comment: 'Mi orden aún está pendiente.',
      },
    };
    const res = createMockRes();

    await reviewsHandler(req, res, authOptions);

    expect(res.statusCode).toBe(201);
    expect(res.data.review.isVerifiedBuyer).toBe(false);
  });

  it('grants isVerifiedBuyer: true ONLY when user has genuine COMPLETED order', async () => {
    const userId = 'genuine-buyer-uid-300';
    const token = await createSignedToken({ sub: userId, email: 'genuine@patagonix.com' });

    // Seed authoritative completed order in database
    const completedOrder: Order = {
      id: 'ord-completed-test',
      userId,
      userEmail: 'genuine@patagonix.com',
      items: [{ product: { id: 'prod-001' } as any, quantity: 1 }],
      totalPrice: 189.99,
      totalQuantity: 1,
      status: 'completed', // AUTHORITATIVE COMPLETED PURCHASE
      shippingAddress: { street: 'Main St', city: 'Bogota', country: 'Colombia', postalCode: '110111' },
      createdAt: new Date().toISOString(),
    };
    await saveAuthoritativeOrder(completedOrder);

    const req = {
      method: 'POST',
      headers: { authorization: `Bearer ${token}` },
      body: {
        productId: 'prod-001',
        rating: 5,
        comment: 'Compré y recibí el producto, excelente cancelación de ruido.',
      },
    };
    const res = createMockRes();

    await reviewsHandler(req, res, authOptions);

    expect(res.statusCode).toBe(201);
    expect(res.data.review.isVerifiedBuyer).toBe(true);

    // Verify aggregate rating recalculation on product
    const updatedProduct = await getAuthoritativeProduct('prod-001');
    expect(updatedProduct?.ratingCount).toBeGreaterThan(2);
  });
});
