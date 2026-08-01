import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { nanoid } from 'nanoid';
import prisma from '@/lib/db';
import { generateTokenPair, generateEmailVerificationToken } from '@/lib/jwt';
import { validateBody, registerSchema, formatZodErrors } from '@/lib/validation';
import { rateLimitMiddleware, addSecurityHeaders } from '@/lib/middleware';
import { logger, createErrorResponse, createSuccessResponse } from '@/lib/logger';
import { sendVerificationEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimitResult = await rateLimitMiddleware(request);
    if (!rateLimitResult.allowed && rateLimitResult.response) {
      return rateLimitResult.response;
    }

    // Parse and validate request body
    const body = await request.json();
    const validation = validateBody(registerSchema, body);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          errors: formatZodErrors(validation.errors),
        },
        { status: 400 }
      );
    }

    const { email, password, firstName, lastName, status } = validation.data;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email sudah terdaftar' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Generate email verification token
    const verificationToken = nanoid(32);

    // Create user with subscription (FREE plan by default)
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        password: hashedPassword,
        firstName,
        lastName,
        status: status || 'Mahasiswa S1',
        verificationToken,
        subscription: {
          create: {
            plan: 'FREE',
            status: 'ACTIVE',
          },
        },
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        status: true,
        role: true,
        emailVerified: true,
      },
    });

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

    // Send verification email (non-blocking)
    const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${verificationToken}`;
    sendVerificationEmail(user.email, user.firstName, verificationUrl).catch((err) => {
      logger.error('Failed to send verification email', err, { userId: user.id });
    });

    logger.info('User registered successfully', { userId: user.id, email: user.email });

    const response = NextResponse.json(
      createSuccessResponse(
        {
          accessToken,
          refreshToken,
          user,
        },
        'Registration successful. Please check your email to verify your account.'
      ),
      { status: 201 }
    );

    return addSecurityHeaders(response);
  } catch (error) {
    logger.error('Registration failed', error);
    return NextResponse.json(
      createErrorResponse('Registration failed', 500, error),
      { status: 500 }
    );
  }
}
