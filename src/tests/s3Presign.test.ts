import { describe, it, expect, vi, beforeEach, beforeAll } from 'vitest';
import { generateKeyPair, SignJWT } from 'jose';
import handler from '../../api/s3-presign';
import { VerifyAuthOptions } from '../../api/lib/verifyAuth';

describe('S3 Presign Serverless Function Security Gate', () => {
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
    vi.restoreAllMocks();
  });

  const createMockRes = () => {
    const res: any = {};
    res.statusCode = 200;
    res.data = null;
    res.status = vi.fn().mockImplementation((code: number) => {
      res.statusCode = code;
      return res;
    });
    res.json = vi.fn().mockImplementation((payload: any) => {
      res.data = payload;
      return res;
    });
    res.end = vi.fn().mockReturnValue(res);
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

  it('rejects non-POST HTTP methods with 405 Method Not Allowed', async () => {
    const req = { method: 'GET' };
    const res = createMockRes();

    await handler(req, res, authOptions);

    expect(res.status).toHaveBeenCalledWith(405);
    expect(res.data.error).toMatch(/Método no permitido/i);
  });

  it('rejects unauthenticated requests without Authorization header with 401', async () => {
    const req = {
      method: 'POST',
      headers: {},
      body: { fileName: 'test.png', fileType: 'image/png' },
    };
    const res = createMockRes();

    await handler(req, res, authOptions);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.data.code).toBe('AUTH_REQUIRED');
  });

  it('rejects authenticated non-admin customer requests with 403 Forbidden', async () => {
    const customerToken = await createSignedToken({
      sub: 'cust-123',
      admin: false,
      role: 'customer',
      email: 'cliente@patagonix.com',
    });

    const req = {
      method: 'POST',
      headers: {
        authorization: `Bearer ${customerToken}`,
      },
      body: { fileName: 'foto.png', fileType: 'image/png' },
    };
    const res = createMockRes();

    await handler(req, res, authOptions);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.data.code).toBe('FORBIDDEN_NOT_ADMIN');
  });

  it('rejects disallowed file MIME types (e.g. application/pdf) with 415', async () => {
    const adminToken = await createSignedToken({
      sub: 'admin-123',
      admin: true,
      email: 'admin@patagonix.com',
    });

    const req = {
      method: 'POST',
      headers: {
        authorization: `Bearer ${adminToken}`,
      },
      body: { fileName: 'malicioso.exe', fileType: 'application/x-msdownload' },
    };
    const res = createMockRes();

    await handler(req, res, authOptions);

    expect(res.status).toHaveBeenCalledWith(415);
    expect(res.data.error).toMatch(/Formato de archivo no permitido/i);
  });

  it('rejects files exceeding 5MB max size limit with 413', async () => {
    const adminToken = await createSignedToken({
      sub: 'admin-123',
      admin: true,
      email: 'admin@patagonix.com',
    });

    const req = {
      method: 'POST',
      headers: {
        authorization: `Bearer ${adminToken}`,
      },
      body: { 
        fileName: 'pesado.png', 
        fileType: 'image/png',
        fileSize: 10 * 1024 * 1024, // 10MB
      },
    };
    const res = createMockRes();

    await handler(req, res, authOptions);

    expect(res.status).toHaveBeenCalledWith(413);
    expect(res.data.error).toMatch(/supera el tamaño máximo/i);
  });

  it('rejects requests missing fileName or fileType with 400', async () => {
    const adminToken = await createSignedToken({
      sub: 'admin-123',
      admin: true,
      email: 'admin@patagonix.com',
    });

    const req = {
      method: 'POST',
      headers: {
        authorization: `Bearer ${adminToken}`,
      },
      body: { fileName: '' },
    };
    const res = createMockRes();

    await handler(req, res, authOptions);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.data.error).toMatch(/Campos requeridos ausentes/i);
  });

  it('returns 503 fail-closed when AWS credentials are not configured', async () => {
    const adminToken = await createSignedToken({
      sub: 'admin-123',
      admin: true,
      email: 'admin@patagonix.com',
    });

    const oldKey = process.env.AWS_ACCESS_KEY_ID;
    delete process.env.AWS_ACCESS_KEY_ID;

    const req = {
      method: 'POST',
      headers: {
        authorization: `Bearer ${adminToken}`,
      },
      body: { fileName: 'test-product.png', fileType: 'image/png' },
    };
    const res = createMockRes();

    await handler(req, res, authOptions);

    if (oldKey) process.env.AWS_ACCESS_KEY_ID = oldKey;

    expect(res.status).toHaveBeenCalledWith(503);
    expect(res.data.code).toBe('STORAGE_UNCONFIGURED');
  });
});
