import { describe, it, expect, vi, beforeEach } from 'vitest';
import handler from '../../api/s3-presign';

describe('S3 Presign Serverless Function Security Gate', () => {
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

  it('rejects non-POST HTTP methods with 405 Method Not Allowed', async () => {
    const req = { method: 'GET' };
    const res = createMockRes();

    await handler(req, res);

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

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.data.code).toBe('AUTH_REQUIRED');
  });

  it('rejects authenticated non-admin customer requests with 403 Forbidden', async () => {
    // Simulated token for standard customer
    const customerToken = 'header.' + Buffer.from(JSON.stringify({ role: 'customer', email: 'cliente@patagonix.com' })).toString('base64') + '.sig';

    const req = {
      method: 'POST',
      headers: {
        authorization: `Bearer ${customerToken}`,
      },
      body: { fileName: 'foto.png', fileType: 'image/png' },
    };
    const res = createMockRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.data.code).toBe('FORBIDDEN_NOT_ADMIN');
  });

  it('rejects disallowed file MIME types (e.g. application/pdf) with 415', async () => {
    const req = {
      method: 'POST',
      headers: {
        authorization: 'Bearer admin-secret-dev-token',
      },
      body: { fileName: 'malicioso.exe', fileType: 'application/x-msdownload' },
    };
    const res = createMockRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(415);
    expect(res.data.error).toMatch(/Formato de archivo no permitido/i);
  });

  it('rejects files exceeding 5MB max size limit with 413', async () => {
    const req = {
      method: 'POST',
      headers: {
        authorization: 'Bearer admin-secret-dev-token',
      },
      body: { 
        fileName: 'pesado.png', 
        fileType: 'image/png',
        fileSize: 10 * 1024 * 1024 // 10MB
      },
    };
    const res = createMockRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(413);
    expect(res.data.error).toMatch(/supera el tamaño máximo/i);
  });

  it('rejects requests missing fileName or fileType with 400', async () => {
    const req = {
      method: 'POST',
      headers: {
        authorization: 'Bearer admin-secret-dev-token',
      },
      body: { fileName: '' },
    };
    const res = createMockRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.data.error).toMatch(/Campos requeridos ausentes/i);
  });
});
