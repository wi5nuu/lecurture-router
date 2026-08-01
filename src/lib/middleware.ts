import { NextRequest, NextResponse } from 'next/server';
import { verifyAccessToken, JWTPayload } from './jwt';
import { rateLimit } from './redis';
import prisma from './db';

// Extended NextRequest with user info
export interface AuthenticatedRequest extends NextRequest {
  user?: JWTPayload;
}

// Rate limiting middleware
export async function rateLimitMiddleware(
  request: NextRequest,
  identifier?: string
): Promise<{ allowed: boolean; response?: NextResponse }> {
  const maxRequests = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100');
  const windowMinutes = parseInt(process.env.RATE_LIMIT_WINDOW || '15');
  const windowSeconds = windowMinutes * 60;

  // Use provided identifier or fall back to IP
  const id = identifier || request.ip || request.headers.get('x-forwarded-for') || 'unknown';
  const key = `rate-limit:${id}`;

  const result = await rateLimit.check(key, maxRequests, windowSeconds);

  if (!result.allowed) {
    return {
      allowed: false,
      response: NextResponse.json(
        {
          error: 'Too many requests',
          message: `Rate limit exceeded. Try again in ${Math.ceil((result.resetAt - Date.now()) / 1000)} seconds`,
          resetAt: result.resetAt,
        },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': maxRequests.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': result.resetAt.toString(),
            'Retry-After': Math.ceil((result.resetAt - Date.now()) / 1000).toString(),
          }
        }
      ),
    };
  }

  return { allowed: true };
}

// Authentication middleware
export async function authMiddleware(request: NextRequest): Promise<{ 
  authenticated: boolean; 
  user?: JWTPayload; 
  response?: NextResponse 
}> {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return {
      authenticated: false,
      response: NextResponse.json(
        { error: 'Unauthorized', message: 'Missing or invalid authorization header' },
        { status: 401 }
      ),
    };
  }

  const token = authHeader.substring(7);
  const payload = await verifyAccessToken(token);

  if (!payload) {
    return {
      authenticated: false,
      response: NextResponse.json(
        { error: 'Unauthorized', message: 'Invalid or expired token' },
        { status: 401 }
      ),
    };
  }

  // Verify user still exists and is active
  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: { id: true, isActive: true, role: true },
  });

  if (!user || !user.isActive) {
    return {
      authenticated: false,
      response: NextResponse.json(
        { error: 'Unauthorized', message: 'User not found or inactive' },
        { status: 401 }
      ),
    };
  }

  return { authenticated: true, user: payload };
}

// Role-based authorization middleware
export function requireRole(allowedRoles: string[]) {
  return async (request: NextRequest, user: JWTPayload): Promise<{ authorized: boolean; response?: NextResponse }> => {
    if (!allowedRoles.includes(user.role)) {
      return {
        authorized: false,
        response: NextResponse.json(
          { 
            error: 'Forbidden', 
            message: `This endpoint requires one of the following roles: ${allowedRoles.join(', ')}` 
          },
          { status: 403 }
        ),
      };
    }

    return { authorized: true };
  };
}

// API Key authentication
export async function apiKeyMiddleware(request: NextRequest): Promise<{
  authenticated: boolean;
  userId?: string;
  response?: NextResponse;
}> {
  const apiKey = request.headers.get('x-api-key');

  if (!apiKey) {
    return {
      authenticated: false,
      response: NextResponse.json(
        { error: 'Unauthorized', message: 'Missing API key' },
        { status: 401 }
      ),
    };
  }

  const keyRecord = await prisma.apiKey.findUnique({
    where: { key: apiKey, isActive: true },
    include: { user: { select: { id: true, isActive: true } } },
  });

  if (!keyRecord || !keyRecord.user.isActive) {
    return {
      authenticated: false,
      response: NextResponse.json(
        { error: 'Unauthorized', message: 'Invalid or inactive API key' },
        { status: 401 }
      ),
    };
  }

  // Update last used timestamp
  await prisma.apiKey.update({
    where: { id: keyRecord.id },
    data: { lastUsedAt: new Date() },
  });

  return { authenticated: true, userId: keyRecord.userId };
}

// Security headers middleware
export function addSecurityHeaders(response: NextResponse): NextResponse {
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=()'
  );
  
  if (process.env.NODE_ENV === 'production') {
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains'
    );
  }

  return response;
}

// CORS middleware
export function corsMiddleware(request: NextRequest, response: NextResponse): NextResponse {
  const origin = request.headers.get('origin');
  const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [];

  if (origin && (allowedOrigins.includes(origin) || allowedOrigins.includes('*'))) {
    response.headers.set('Access-Control-Allow-Origin', origin);
    response.headers.set('Access-Control-Allow-Credentials', 'true');
    response.headers.set(
      'Access-Control-Allow-Methods',
      'GET, POST, PUT, DELETE, PATCH, OPTIONS'
    );
    response.headers.set(
      'Access-Control-Allow-Headers',
      'Content-Type, Authorization, X-API-Key'
    );
  }

  return response;
}

// Audit log middleware
export async function auditLog(
  userId: string | undefined,
  action: string,
  resource: string,
  resourceId: string | undefined,
  request: NextRequest,
  metadata?: any
): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        userId: userId || null,
        action,
        resource,
        resourceId: resourceId || null,
        ipAddress: request.ip || request.headers.get('x-forwarded-for') || null,
        userAgent: request.headers.get('user-agent') || null,
        metadata: metadata || null,
      },
    });
  } catch (error) {
    console.error('Failed to create audit log:', error);
  }
}

// Subscription check middleware
export async function checkSubscription(
  userId: string,
  requiredPlan: string[]
): Promise<{ hasAccess: boolean; response?: NextResponse }> {
  const subscription = await prisma.subscription.findUnique({
    where: { userId },
  });

  if (!subscription || !requiredPlan.includes(subscription.plan)) {
    return {
      hasAccess: false,
      response: NextResponse.json(
        {
          error: 'Subscription Required',
          message: `This feature requires a ${requiredPlan.join(' or ')} subscription`,
          requiredPlans: requiredPlan,
        },
        { status: 403 }
      ),
    };
  }

  if (subscription.status !== 'ACTIVE' && subscription.status !== 'TRIALING') {
    return {
      hasAccess: false,
      response: NextResponse.json(
        {
          error: 'Subscription Inactive',
          message: 'Your subscription is not active. Please update your payment method.',
        },
        { status: 403 }
      ),
    };
  }

  return { hasAccess: true };
}
