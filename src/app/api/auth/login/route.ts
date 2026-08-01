import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/db';
import { generateTokenPair } from '@/lib/jwt';
import { validateBody, loginSchema, formatZodErrors } from '@/lib/validation';
import { rateLimitMiddleware, addSecurityHeaders } from '@/lib/middleware';
import { logger, createErrorResponse, createSuccessResponse } from '@/lib/logger';

export async function POST(request: NextRequest) {
  try {
    // Rate limiting - stricter for login attempts
    const rateLimitResult = await rateLimitMiddleware(request, `login:${request.ip}`);
    if (!rateLimitResult.allowed && rateLimitResult.response) {
      return rateLimitResult.response;
    }

    // Parse and validate request body
    const body = await request.json();
    const validation = validateBody(loginSchema, body);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          errors: formatZodErrors(validation.errors),
        },
        { status: 400 }
      );
    }

    const { email, password } = validation.data;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      select: {
        id: true,
        email: true,
        password: true,
        firstName: true,
        lastName: true,
        status: true,
        role: true,
        isActive: true,
        emailVerified: true,
      },
    });

    if (!user) {
      logger.warn('Login attempt with non-existent email', { email });
      return NextResponse.json(
        { error: 'Email atau password salah' },
        { status: 401 }
      );
    }

    // Check if user is active
    if (!user.isActive) {
      logger.warn('Login attempt for inactive account', { userId: user.id });
      return NextResponse.json(
        { error: 'Akun Anda telah dinonaktifkan. Hubungi support untuk bantuan.' },
        { status: 403 }
      );
    }

    // Verify password
    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) {
      logger.warn('Failed login attempt - invalid password', { userId: user.id });
      return NextResponse.json(
        { error: 'Email atau password salah' },
        { status: 401 }
      );
    }

    // Generate JWT tokens
    const { accessToken, refreshToken } = await generateTokenPair({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    // Store refresh token in database
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt,
      },
    });

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: {
        lastLoginAt: new Date(),
        lastLoginIp: request.ip || null,
      },
    });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    logger.info('User logged in successfully', { userId: user.id, email: user.email });

    const response = NextResponse.json(
      createSuccessResponse({
        accessToken,
        refreshToken,
        user: userWithoutPassword,
      })
    );

    return addSecurityHeaders(response);
  } catch (error) {
    logger.error('Login failed', error);
    return NextResponse.json(
      createErrorResponse('Login failed', 500, error),
      { status: 500 }
    );
  }
}
