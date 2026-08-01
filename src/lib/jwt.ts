import { SignJWT, jwtVerify } from 'jose';
import { nanoid } from 'nanoid';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'default-secret-change-in-production'
);

const JWT_REFRESH_SECRET = new TextEncoder().encode(
  process.env.JWT_REFRESH_SECRET || 'default-refresh-secret-change-in-production'
);

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  type: 'access' | 'refresh';
  jti?: string;
}

// Generate Access Token (short-lived)
export async function generateAccessToken(payload: Omit<JWTPayload, 'type' | 'jti'>): Promise<string> {
  const expiresIn = process.env.JWT_EXPIRES_IN || '15m';
  
  return await new SignJWT({ ...payload, type: 'access' })
    .setProtectedHeader({ alg: 'HS256' })
    .setJti(nanoid())
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(JWT_SECRET);
}

// Generate Refresh Token (long-lived)
export async function generateRefreshToken(payload: Omit<JWTPayload, 'type' | 'jti'>): Promise<string> {
  const expiresIn = process.env.JWT_REFRESH_EXPIRES_IN || '7d';
  
  return await new SignJWT({ ...payload, type: 'refresh' })
    .setProtectedHeader({ alg: 'HS256' })
    .setJti(nanoid())
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(JWT_REFRESH_SECRET);
}

// Verify Access Token
export async function verifyAccessToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as JWTPayload;
  } catch (error) {
    console.error('Access token verification failed:', error);
    return null;
  }
}

// Verify Refresh Token
export async function verifyRefreshToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_REFRESH_SECRET);
    return payload as JWTPayload;
  } catch (error) {
    console.error('Refresh token verification failed:', error);
    return null;
  }
}

// Generate token pair
export async function generateTokenPair(user: { id: string; email: string; role: string }) {
  const payload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };

  const [accessToken, refreshToken] = await Promise.all([
    generateAccessToken(payload),
    generateRefreshToken(payload),
  ]);

  return { accessToken, refreshToken };
}

// Decode token without verification (for reading expired tokens)
export function decodeToken(token: string): JWTPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const payload = JSON.parse(
      Buffer.from(parts[1], 'base64url').toString()
    );
    
    return payload;
  } catch (error) {
    return null;
  }
}

// Email verification token
export async function generateEmailVerificationToken(userId: string, email: string): Promise<string> {
  return await new SignJWT({ userId, email, type: 'email_verification' })
    .setProtectedHeader({ alg: 'HS256' })
    .setJti(nanoid())
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(JWT_SECRET);
}

// Password reset token
export async function generatePasswordResetToken(userId: string, email: string): Promise<string> {
  return await new SignJWT({ userId, email, type: 'password_reset' })
    .setProtectedHeader({ alg: 'HS256' })
    .setJti(nanoid())
    .setIssuedAt()
    .setExpirationTime('1h')
    .sign(JWT_SECRET);
}

// Verify special tokens (email verification, password reset)
export async function verifySpecialToken(token: string): Promise<{ userId: string; email: string; type: string } | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as { userId: string; email: string; type: string };
  } catch (error) {
    console.error('Special token verification failed:', error);
    return null;
  }
}
