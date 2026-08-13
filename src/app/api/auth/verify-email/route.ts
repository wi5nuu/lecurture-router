import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { addSecurityHeaders } from "@/lib/middleware";
import {
  logger,
  createErrorResponse,
  createSuccessResponse,
} from "@/lib/logger";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        { error: "Verification token is required" },
        { status: 400 },
      );
    }

    // Find user with this verification token
    const user = await prisma.user.findFirst({
      where: {
        verificationToken: token,
        emailVerified: false,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid or expired verification token" },
        { status: 400 },
      );
    }

    // Update user as verified
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        emailVerifiedAt: new Date(),
        verificationToken: null,
      },
    });

    logger.info("Email verified successfully", {
      userId: user.id,
      email: user.email,
    });

    const response = NextResponse.json(
      createSuccessResponse(
        { verified: true },
        "Email verified successfully! You can now access all features.",
      ),
    );

    return addSecurityHeaders(response);
  } catch (error) {
    logger.error("Email verification failed", error);
    return NextResponse.json(
      createErrorResponse("Email verification failed", 500, error),
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      // Don't reveal if email exists
      return NextResponse.json(
        createSuccessResponse(
          {},
          "If the email exists, a verification link has been sent.",
        ),
      );
    }

    if (user.emailVerified) {
      return NextResponse.json(
        { error: "Email is already verified" },
        { status: 400 },
      );
    }

    // Generate new verification token
    const { nanoid } = await import("nanoid");
    const verificationToken = nanoid(32);

    await prisma.user.update({
      where: { id: user.id },
      data: { verificationToken },
    });

    // Send verification email
    const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${verificationToken}`;
    const { sendVerificationEmail } = await import("@/lib/email");

    await sendVerificationEmail(user.email, user.firstName, verificationUrl);

    logger.info("Verification email resent", { userId: user.id });

    const response = NextResponse.json(
      createSuccessResponse(
        {},
        "Verification email sent. Please check your inbox.",
      ),
    );

    return addSecurityHeaders(response);
  } catch (error) {
    logger.error("Failed to resend verification email", error);
    return NextResponse.json(
      createErrorResponse("Failed to send verification email", 500, error),
      { status: 500 },
    );
  }
}
