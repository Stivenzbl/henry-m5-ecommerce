import { describe, it, expect, beforeAll } from 'vitest';
import { generateKeyPair, SignJWT } from 'jose';
import { verifyAuthToken } from '../../api/lib/verifyAuth';

describe('Cryptographic JWT RS256 Verification Gate (api/lib/verifyAuth.ts)', () => {
  let publicKey: any;
  let privateKey: any;
  let wrongPrivateKey: any;

  beforeAll(async () => {
    // Generate authentic 2048-bit RS256 keypairs for mathematical signature verification
    const keyPair = await generateKeyPair('RS256');
    publicKey = keyPair.publicKey;
    privateKey = keyPair.privateKey;

    const wrongKeyPair = await generateKeyPair('RS256');
    wrongPrivateKey = wrongKeyPair.privateKey;
  });

  const signToken = async (
    claims: Record<string, any>,
    opts?: { key?: any; issuer?: string; audience?: string; expiresIn?: string }
  ) => {
    const key = opts?.key || privateKey;
    const issuer = opts?.issuer || 'https://securetoken.google.com/patagonix-retail';
    const audience = opts?.audience || 'patagonix-retail';
    const jwt = new SignJWT(claims)
      .setProtectedHeader({ alg: 'RS256', typ: 'JWT' })
      .setIssuer(issuer)
      .setAudience(audience)
      .setIssuedAt();

    if (opts?.expiresIn) {
      jwt.setExpirationTime(opts.expiresIn);
    } else {
      jwt.setExpirationTime('1h');
    }

    return await jwt.sign(key);
  };

  it('authenticates valid RS256 signature and extracts verified claims', async () => {
    const token = await signToken({
      sub: 'verified-user-123',
      email: 'admin@patagonix.com',
      admin: true,
    });

    const result = await verifyAuthToken(`Bearer ${token}`, {
      keyOrJwks: publicKey,
      projectId: 'patagonix-retail',
    });

    expect(result.uid).toBe('verified-user-123');
    expect(result.email).toBe('admin@patagonix.com');
    expect(result.isAdmin).toBe(true);
  });

  it('rejects tampered digital signatures with cryptographic verification failure', async () => {
    const validToken = await signToken({
      sub: 'tampered-user',
      admin: true,
    });

    // Tamper with signature bytes at the end of the token
    const parts = validToken.split('.');
    const tamperedSig = Buffer.from('forged-signature-bytes').toString('base64url');
    const tamperedToken = `${parts[0]}.${parts[1]}.${tamperedSig}`;

    await expect(
      verifyAuthToken(`Bearer ${tamperedToken}`, {
        keyOrJwks: publicKey,
        projectId: 'patagonix-retail',
      })
    ).rejects.toThrow();
  });

  it('rejects tokens signed by an unauthorized third-party private key', async () => {
    const forgedToken = await signToken(
      { sub: 'attacker-123', admin: true },
      { key: wrongPrivateKey }
    );

    await expect(
      verifyAuthToken(`Bearer ${forgedToken}`, {
        keyOrJwks: publicKey,
        projectId: 'patagonix-retail',
      })
    ).rejects.toThrow();
  });

  it('rejects expired tokens (exp < current time)', async () => {
    const expiredToken = await signToken(
      { sub: 'expired-user' },
      { expiresIn: '-10s' }
    );

    await expect(
      verifyAuthToken(`Bearer ${expiredToken}`, {
        keyOrJwks: publicKey,
        projectId: 'patagonix-retail',
      })
    ).rejects.toThrow();
  });

  it('rejects tokens with invalid issuer (iss mismatch)', async () => {
    const wrongIssuerToken = await signToken(
      { sub: 'user-1' },
      { issuer: 'https://evil-identity-provider.com' }
    );

    await expect(
      verifyAuthToken(`Bearer ${wrongIssuerToken}`, {
        keyOrJwks: publicKey,
        projectId: 'patagonix-retail',
      })
    ).rejects.toThrow();
  });

  it('rejects tokens with invalid audience (aud mismatch)', async () => {
    const wrongAudienceToken = await signToken(
      { sub: 'user-1' },
      { audience: 'rogue-firebase-project' }
    );

    await expect(
      verifyAuthToken(`Bearer ${wrongAudienceToken}`, {
        keyOrJwks: publicKey,
        projectId: 'patagonix-retail',
      })
    ).rejects.toThrow();
  });

  it('rejects tokens missing the subject claim (sub)', async () => {
    const noSubToken = await signToken({
      email: 'nosub@patagonix.com',
    });

    await expect(
      verifyAuthToken(`Bearer ${noSubToken}`, {
        keyOrJwks: publicKey,
        projectId: 'patagonix-retail',
      })
    ).rejects.toThrow(/INVALID_TOKEN_NO_SUB/);
  });

  it('properly extracts non-admin claim as isAdmin: false', async () => {
    const customerToken = await signToken({
      sub: 'customer-uid-99',
      email: 'customer@patagonix.com',
      admin: false,
    });

    const result = await verifyAuthToken(`Bearer ${customerToken}`, {
      keyOrJwks: publicKey,
      projectId: 'patagonix-retail',
    });

    expect(result.uid).toBe('customer-uid-99');
    expect(result.isAdmin).toBe(false);
  });

  it('rejects missing Authorization header with AUTH_REQUIRED', async () => {
    await expect(verifyAuthToken(undefined)).rejects.toThrow('AUTH_REQUIRED');
    await expect(verifyAuthToken('')).rejects.toThrow('AUTH_REQUIRED');
    await expect(verifyAuthToken('Basic dXNlcjpwYXNz')).rejects.toThrow('AUTH_REQUIRED');
  });

  it('rejects malformed bearer tokens without 3 segments', async () => {
    await expect(
      verifyAuthToken('Bearer token-without-dots', {
        keyOrJwks: publicKey,
        projectId: 'patagonix-retail',
      })
    ).rejects.toThrow();
  });
});
