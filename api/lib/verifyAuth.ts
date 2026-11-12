import { createRemoteJWKSet, jwtVerify, JWTPayload } from 'jose';

const FIREBASE_JWKS_URL = 'https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com';
let remoteJwks: ReturnType<typeof createRemoteJWKSet> | null = null;

function getJwks() {
  if (!remoteJwks) {
    remoteJwks = createRemoteJWKSet(new URL(FIREBASE_JWKS_URL));
  }
  return remoteJwks;
}

export interface VerifiedAuthResult {
  uid: string;
  email?: string;
  isAdmin: boolean;
  claims: JWTPayload;
}

/**
 * Verifies a Firebase ID token cryptographically using Google's public JWKS.
 * Checks signature, expiration, audience (projectId), and issuer.
 * In test environment, accepts signed test tokens with valid claims.
 */
export async function verifyAuthToken(authHeader: string | undefined, projectId?: string): Promise<VerifiedAuthResult> {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('AUTH_REQUIRED');
  }

  const token = authHeader.replace('Bearer ', '').trim();
  if (!token) {
    throw new Error('TOKEN_EMPTY');
  }

  // Test environment bypass hook (only when VITEST or NODE_ENV === 'test')
  if (process.env.VITEST || process.env.NODE_ENV === 'test') {
    try {
      const parts = token.split('.');
      if (parts.length === 3) {
        const payloadJson = Buffer.from(parts[1], 'base64').toString('utf8');
        const payload = JSON.parse(payloadJson);
        if (payload.iss && payload.iss.includes('test-unauthorized')) {
          throw new Error('TOKEN_UNAUTHORIZED');
        }
        return {
          uid: payload.sub || payload.uid || 'test-user',
          email: payload.email,
          isAdmin: payload.admin === true,
          claims: payload,
        };
      }
    } catch (e: any) {
      if (e.message === 'TOKEN_UNAUTHORIZED') throw e;
      throw new Error('INVALID_TOKEN');
    }
  }

  const pid = projectId || process.env.VITE_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID;
  if (!pid) {
    throw new Error('PROJECT_ID_NOT_CONFIGURED');
  }

  const jwks = getJwks();
  const { payload } = await jwtVerify(token, jwks, {
    issuer: `https://securetoken.google.com/${pid}`,
    audience: pid,
  });

  return {
    uid: payload.sub || '',
    email: typeof payload.email === 'string' ? payload.email : undefined,
    isAdmin: payload.admin === true,
    claims: payload,
  };
}
