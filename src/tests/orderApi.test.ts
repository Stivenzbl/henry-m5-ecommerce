import { describe, it, expect, beforeEach, beforeAll } from 'vitest';
import { generateKeyPair, SignJWT } from 'jose';
import ordersHandler from '../../api/orders';
import { resetServerStore, getAuthoritativeProduct } from '../../api/lib/serverStore';
import { VerifyAuthOptions } from '../../api/lib/verifyAuth';

describe('Authoritative Backend Order Integrity Gate (/api/orders)', () => {
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

  it('rejects unauthenticated order requests with HTTP 401', async () => {
    const req = {
      method: 'POST',
      headers: {},
      body: { items: [{ productId: 'prod-001', quantity: 1 }] },
    };
    const res = createMockRes();

    await ordersHandler(req, res, authOptions);

    expect(res.statusCode).toBe(401);
    expect(res.data.code).toBe('AUTH_REQUIRED');
  });

  it('rejects requests with empty cart items with HTTP 400', async () => {
    const token = await createSignedToken({ sub: 'user-auth-1' });
    const req = {
      method: 'POST',
      headers: { authorization: `Bearer ${token}` },
      body: { items: [], shippingAddress: { street: 'Main St', city: 'Bogota' } },
    };
    const res = createMockRes();

    await ordersHandler(req, res, authOptions);

    expect(res.statusCode).toBe(400);
    expect(res.data.code).toBe('EMPTY_CART');
  });

  it('rejects invalid or non-positive integer quantities with HTTP 400', async () => {
    const token = await createSignedToken({ sub: 'user-auth-1' });
    const req = {
      method: 'POST',
      headers: { authorization: `Bearer ${token}` },
      body: {
        items: [{ productId: 'prod-001', quantity: -2 }],
        shippingAddress: { street: 'Main St', city: 'Bogota' },
      },
    };
    const res = createMockRes();

    await ordersHandler(req, res, authOptions);

    expect(res.statusCode).toBe(400);
    expect(res.data.error).toMatch(/Cantidad inválida/i);
  });

  it('rejects non-existent product IDs with HTTP 400', async () => {
    const token = await createSignedToken({ sub: 'user-auth-1' });
    const req = {
      method: 'POST',
      headers: { authorization: `Bearer ${token}` },
      body: {
        items: [{ productId: 'non-existent-product-id', quantity: 1 }],
        shippingAddress: { street: 'Main St', city: 'Bogota' },
      },
    };
    const res = createMockRes();

    await ordersHandler(req, res, authOptions);

    expect(res.statusCode).toBe(400);
    expect(res.data.error).toMatch(/no existe en el catálogo/i);
  });

  it('rejects requests exceeding available stock and preserves inventory', async () => {
    const token = await createSignedToken({ sub: 'user-auth-1' });
    const product = await getAuthoritativeProduct('prod-001');
    const availableStock = product?.stock || 15;

    const req = {
      method: 'POST',
      headers: { authorization: `Bearer ${token}` },
      body: {
        items: [{ productId: 'prod-001', quantity: availableStock + 50 }],
        shippingAddress: { street: 'Main St', city: 'Bogota' },
      },
    };
    const res = createMockRes();

    await ordersHandler(req, res, authOptions);

    expect(res.statusCode).toBe(400);
    expect(res.data.error).toMatch(/Stock insuficiente/i);

    // Stock must remain intact
    const postCheckProduct = await getAuthoritativeProduct('prod-001');
    expect(postCheckProduct?.stock).toBe(availableStock);
  });

  it('calculates order total authoritatively and derives UID strictly from token', async () => {
    const verifiedUid = 'genuine-authenticated-uid-888';
    const verifiedEmail = 'client.verified@patagonix.com';
    const token = await createSignedToken({ sub: verifiedUid, email: verifiedEmail });

    // Client maliciously attempts to declare a forged price of $0.01 and fake userId
    const req = {
      method: 'POST',
      headers: { authorization: `Bearer ${token}` },
      body: {
        userId: 'FORGED_ATTACKER_UID', // Malicious client attempt
        userEmail: 'attacker@evil.com',
        totalPrice: 0.02, // Malicious client attempt
        items: [{ productId: 'prod-001', quantity: 2, price: 0.01 }], // 189.99 * 2 = 379.98
        shippingAddress: { street: 'Av. Corrientes 1234', city: 'Buenos Aires' },
      },
    };
    const res = createMockRes();

    await ordersHandler(req, res, authOptions);

    expect(res.statusCode).toBe(201);
    expect(res.data.success).toBe(true);

    const order = res.data.order;
    // UID and email derived strictly from cryptographically verified token
    expect(order.userId).toBe(verifiedUid);
    expect(order.userEmail).toBe(verifiedEmail);

    // Price must be authoritative from catalog (189.99 * 2 = 379.98), overriding client 0.02
    expect(order.totalPrice).toBe(379.98);
    expect(order.status).toBe('pending');

    // Stock was atomically decremented from 15 to 13
    const productAfter = await getAuthoritativeProduct('prod-001');
    expect(productAfter?.stock).toBe(13);
  });

  it('rolls back previously reserved items if a subsequent item fails in checkout transaction', async () => {
    const token = await createSignedToken({ sub: 'user-auth-1' });
    const initialProd1 = await getAuthoritativeProduct('prod-001');
    const initialProd2 = await getAuthoritativeProduct('prod-004'); // stock is 5

    const req = {
      method: 'POST',
      headers: { authorization: `Bearer ${token}` },
      body: {
        items: [
          { productId: 'prod-001', quantity: 2 }, // Valid
          { productId: 'prod-004', quantity: 999 }, // Fails! (exceeds stock 5)
        ],
        shippingAddress: { street: 'Main St', city: 'Bogota' },
      },
    };
    const res = createMockRes();

    await ordersHandler(req, res, authOptions);

    expect(res.statusCode).toBe(400);

    // Transaction rollback: prod-001 stock must be restored to original!
    const postProd1 = await getAuthoritativeProduct('prod-001');
    const postProd2 = await getAuthoritativeProduct('prod-004');
    expect(postProd1?.stock).toBe(initialProd1?.stock);
    expect(postProd2?.stock).toBe(initialProd2?.stock);
  });
});
