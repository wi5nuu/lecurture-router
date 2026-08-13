import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { authMiddleware, addSecurityHeaders } from "@/lib/middleware";
import {
  logger,
  createErrorResponse,
  createSuccessResponse,
} from "@/lib/logger";

export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const authResult = await authMiddleware(request);
    if (!authResult.authenticated || !authResult.user) {
      return authResult.response!;
    }

    // Invalidate all refresh tokens
    await prisma.refreshToken.deleteMany({
      where: { userId: authResult.user.userId },
    });

    logger.info("User logged out", { userId: authResult.user.userId });

    const response = NextResponse.json(
      createSuccessResponse({}, "Logged out successfully"),
    );

    return addSecurityHeaders(response);
  } catch (error) {
    logger.error("Logout failed", error);
    return NextResponse.json(createErrorResponse("Logout failed", 500, error), {
      status: 500,
    });
  }
}
