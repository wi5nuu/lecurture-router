import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/db";
import {
  validateBody,
  resetPasswordSchema,
  formatZodErrors,
} from "@/lib/validation";
import { addSecurityHeaders } from "@/lib/middleware";
import {
  logger,
  createErrorResponse,
  createSuccessResponse,
} from "@/lib/logger";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = validateBody(resetPasswordSchema, body);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          errors: formatZodErrors(validation.errors),
        },
        { status: 400 },
      );
    }

    const { token, password } = validation.data;

    // Find user with reset token
    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid or expired reset token" },
        { status: 400 },
      );
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Update password and clear reset token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    // Invalidate all refresh tokens for security
    await prisma.refreshToken.deleteMany({
      where: { userId: user.id },
    });

    logger.info("Password reset successfully", { userId: user.id });

    const response = NextResponse.json(
      createSuccessResponse(
        {},
        "Password has been reset successfully. Please login with your new password.",
      ),
    );

    return addSecurityHeaders(response);
  } catch (error) {
    logger.error("Password reset failed", error);
    return NextResponse.json(
      createErrorResponse("Password reset failed", 500, error),
      { status: 500 },
    );
  }
}
