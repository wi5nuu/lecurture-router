import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { authMiddleware, addSecurityHeaders } from "@/lib/middleware";
import { cancelSubscription, resumeSubscription } from "@/lib/stripe";
import {
  logger,
  createErrorResponse,
  createSuccessResponse,
} from "@/lib/logger";
import { sendSubscriptionEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const authResult = await authMiddleware(request);
    if (!authResult.authenticated || !authResult.user) {
      return authResult.response!;
    }

    const { action, immediately } = await request.json();

    if (!action || !["cancel", "resume"].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action. Must be "cancel" or "resume"' },
        { status: 400 },
      );
    }

    // Get subscription
    const subscription = await prisma.subscription.findUnique({
      where: { userId: authResult.user.userId },
      include: { user: true },
    });

    if (!subscription?.stripeSubscriptionId) {
      return NextResponse.json(
        { error: "No active subscription found" },
        { status: 404 },
      );
    }

    let updatedSubscription;

    if (action === "cancel") {
      // Cancel subscription
      updatedSubscription = await cancelSubscription(
        subscription.stripeSubscriptionId,
        immediately === true,
      );

      // Update database
      await prisma.subscription.update({
        where: { id: subscription.id },
        data: {
          cancelAtPeriodEnd: !immediately,
          canceledAt: immediately ? new Date() : null,
          status: immediately ? "CANCELLED" : subscription.status,
        },
      });

      // Send email notification
      await sendSubscriptionEmail(
        subscription.user.email,
        subscription.user.firstName,
        subscription.plan,
        "cancelled",
      );

      logger.info("Subscription cancelled", {
        userId: authResult.user.userId,
        immediately,
      });
    } else {
      // Resume subscription
      updatedSubscription = await resumeSubscription(
        subscription.stripeSubscriptionId,
      );

      // Update database
      await prisma.subscription.update({
        where: { id: subscription.id },
        data: {
          cancelAtPeriodEnd: false,
          canceledAt: null,
        },
      });

      logger.info("Subscription resumed", { userId: authResult.user.userId });
    }

    const response = NextResponse.json(
      createSuccessResponse({
        subscription: updatedSubscription,
      }),
    );

    return addSecurityHeaders(response);
  } catch (error) {
    logger.error("Failed to manage subscription", error);
    return NextResponse.json(
      createErrorResponse("Failed to manage subscription", 500, error),
      { status: 500 },
    );
  }
}
