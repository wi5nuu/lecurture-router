import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { verifyRefreshToken, generateTokenPair } from '@/lib/jwt';
import { validateBody, refreshTokenSchema, formatZodErrors } from '@/lib/validation';
import { addSecurityHeaders } from '@/lib/middleware';
import { logger, createErrorResponse, createSuccessResponse } from '@/lib/logger';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = validateBody(refreshTokenSchema, body);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          errors: formatZodErrors(validation.errors),
        },
        { status: 400 }
      );
    }

    const { refreshToken } = validation.data;

    // Verify refresh token
    const payload = await verifyRefreshToken(refreshToken);
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid or expired refresh token' },
        { status: 401 }
      );
    }

    // Check if refresh token exists in database
    const storedToken = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true },
    });

    if (!storedToken) {
      return NextResponse.json(
        { error: 'Refresh token not found' },
        { status: 401 }
      );
    }

    // Check if token is expired
    if (storedToken.expiresAt < new Date()) {
      // Delete expired token
      await prisma.refreshToken.delete({
        where: { id: storedToken.id },
      });

      return NextResponse.json(
        { error: 'Refresh token expired' },
        { status: 401 }
      );
    }

    // Check if user is active
    if (!storedToken.user.isActive) {
      return NextResponse.json(
        { error: 'User account is inactive' },
        { status: 403 }
      );
    }

    // Generate new token pair
    const { accessToken, refreshToken: newRefreshToken } = await generateTokenPair({
      id: storedToken.user.id,
      email: storedToken.user.email,
      role: storedToken.user.role,
    });

    // Delete old refresh token
    await prisma.refreshToken.delete({
      where: { id: storedToken.id },
    });

    // Store new refresh token
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

    await prisma.refreshToken.create({
      data: {
        token: newRefreshToken,
        userId: storedToken.user.id,
        expiresAt,
      },
    });

    logger.info('Token refreshed successfully', { userId: storedToken.user.id });

    const response = NextResponse.json(
      createSuccessResponse({
        accessToken,
        refreshToken: newRefreshToken,
      })
    );

    return addSecurityHeaders(response);
  } catch (error) {
    logger.error('Token refresh failed', error);
    return NextResponse.json(
      createErrorResponse('Token refresh failed', 500, error),
      { status: 500 }
    );
  }
}
