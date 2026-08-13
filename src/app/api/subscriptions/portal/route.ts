import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { authMiddleware, addSecurityHeaders } from "@/lib/middleware";
import { createBillingPortalSession } from "@/lib/stripe";
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

    // Get subscription
    const subscription = await prisma.subscription.findUnique({
      where: { userId: authResult.user.userId },
    });

    if (!subscription?.stripeCustomerId) {
      return NextResponse.json(
        { error: "No active subscription found" },
        { status: 404 },
      );
    }

    // Create billing portal session
    const returnUrl = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`;
    const session = await createBillingPortalSession(
      subscription.stripeCustomerId,
      returnUrl,
    );

    logger.info("Billing portal session created", {
      userId: authResult.user.userId,
      sessionId: session.id,
    });

    const response = NextResponse.json(
      createSuccessResponse({
        url: session.url,
      }),
    );

    return addSecurityHeaders(response);
  } catch (error) {
    logger.error("Failed to create billing portal session", error);
    return NextResponse.json(
      createErrorResponse(
        "Failed to create billing portal session",
        500,
        error,
      ),
      { status: 500 },
    );
  }
}
