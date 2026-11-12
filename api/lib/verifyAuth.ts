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

export interface VerifyAuthOptions {
  projectId?: string;
  keyOrJwks?: Parameters<typeof jwtVerify>[1];
  issuer?: string;
}

/**
 * Cryptographically verifies a Firebase ID token using RS256 digital signature.
 * Enforces cryptographic signature verification, expiration, issuer, and audience.
 * NO test bypass: in all environments, tokens must be cryptographically signed.
 */
export async function verifyAuthToken(
  authHeader: string | undefined,
  options?: VerifyAuthOptions
): Promise<VerifiedAuthResult> {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('AUTH_REQUIRED');
  }

  const token = authHeader.replace('Bearer ', '').trim();
  if (!token) {
    throw new Error('TOKEN_EMPTY');
  }

  const pid = options?.projectId || process.env.VITE_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID || 'patagonix-retail';
  const keyOrJwks = options?.keyOrJwks || getJwks();
  const issuer = options?.issuer || `https://securetoken.google.com/${pid}`;

  const { payload } = await jwtVerify(token, keyOrJwks as any, {
    issuer,
    audience: pid,
  });

  if (!payload.sub) {
    throw new Error('INVALID_TOKEN_NO_SUB');
  }

  return {
    uid: payload.sub,
    email: typeof payload.email === 'string' ? payload.email : undefined,
    isAdmin: payload.admin === true,
    claims: payload,
  };
}
