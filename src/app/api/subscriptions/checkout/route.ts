import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { authMiddleware, addSecurityHeaders } from "@/lib/middleware";
import { createCheckoutSession, SUBSCRIPTION_PLANS } from "@/lib/stripe";
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

    const { plan } = await request.json();

    // Validate plan
    if (!plan || !["BASIC", "PRO", "ENTERPRISE"].includes(plan)) {
      return NextResponse.json(
        { error: "Invalid subscription plan" },
        { status: 400 },
      );
    }

    // The type `keyof typeof SUBSCRIPTION_PLANS` includes FREE, which has no stripePriceId.
    // Intersect with optional stripePriceId so the check below works without `any`.
    const planConfig = SUBSCRIPTION_PLANS[
      plan as keyof typeof SUBSCRIPTION_PLANS
    ] as (typeof SUBSCRIPTION_PLANS)[keyof typeof SUBSCRIPTION_PLANS] & {
      stripePriceId?: string;
    };

    if (!planConfig.stripePriceId) {
      return NextResponse.json(
        { error: "Stripe price ID not configured for this plan" },
        { status: 500 },
      );
    }

    // Get or create subscription record
    let subscription = await prisma.subscription.findUnique({
      where: { userId: authResult.user.userId },
    });

    // Create Stripe customer if needed
    let stripeCustomerId = subscription?.stripeCustomerId;

    if (!stripeCustomerId) {
      const user = await prisma.user.findUnique({
        where: { id: authResult.user.userId },
      });

      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      const { createStripeCustomer } = await import("@/lib/stripe");
      const customer = await createStripeCustomer(
        user.email,
        user.id,
        `${user.firstName} ${user.lastName}`,
      );

      stripeCustomerId = customer.id;

      // Update subscription with Stripe customer ID
      if (subscription) {
        subscription = await prisma.subscription.update({
          where: { userId: authResult.user.userId },
          data: { stripeCustomerId },
        });
      }
    }

    // Create checkout session
    const successUrl = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?subscription=success`;
    const cancelUrl = `${process.env.NEXT_PUBLIC_APP_URL}/pricing?subscription=cancelled`;

    const session = await createCheckoutSession(
      stripeCustomerId,
      planConfig.stripePriceId,
      successUrl,
      cancelUrl,
      plan === "BASIC" ? 14 : undefined, // 14-day trial for Basic plan
    );

    logger.info("Checkout session created", {
      userId: authResult.user.userId,
      plan,
      sessionId: session.id,
    });

    const response = NextResponse.json(
      createSuccessResponse({
        sessionId: session.id,
        url: session.url,
      }),
    );

    return addSecurityHeaders(response);
  } catch (error) {
    logger.error("Failed to create checkout session", error);
    return NextResponse.json(
      createErrorResponse("Failed to create checkout session", 500, error),
      { status: 500 },
    );
  }
}
