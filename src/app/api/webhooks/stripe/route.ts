import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import prisma from "@/lib/db";
import type { SubscriptionStatus } from "@/generated/prisma";
import { constructWebhookEvent } from "@/lib/stripe";
import { logger } from "@/lib/logger";
import { sendSubscriptionEmail } from "@/lib/email";
import Stripe from "stripe";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get("stripe-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "Missing stripe-signature header" },
        { status: 400 },
      );
    }

    // Verify webhook signature
    const event = constructWebhookEvent(body, signature, webhookSecret);

    logger.info("Stripe webhook received", { type: event.type, id: event.id });

    // Handle different event types
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutCompleted(
          event.data.object as Stripe.Checkout.Session,
        );
        break;

      case "customer.subscription.created":
        await handleSubscriptionCreated(
          event.data.object as Stripe.Subscription,
        );
        break;

      case "customer.subscription.updated":
        await handleSubscriptionUpdated(
          event.data.object as Stripe.Subscription,
        );
        break;

      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(
          event.data.object as Stripe.Subscription,
        );
        break;

      case "invoice.paid":
        await handleInvoicePaid(event.data.object as Stripe.Invoice);
        break;

      case "invoice.payment_failed":
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
        break;

      case "customer.subscription.trial_will_end":
        await handleTrialWillEnd(event.data.object as Stripe.Subscription);
        break;

      default:
        logger.debug("Unhandled webhook event type", { type: event.type });
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    logger.error("Webhook processing failed", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 400 },
    );
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const customerId = session.customer as string;
  const subscriptionId = session.subscription as string;

  logger.info("Checkout completed", { customerId, subscriptionId });
}

type StripeSubscriptionTimeline = {
  current_period_start: number;
  current_period_end: number;
  trial_start: number | null;
  trial_end: number | null;
};

async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;
  const priceId = subscription.items.data[0].price.id;

  // Find subscription by Stripe customer ID
  const dbSubscription = await prisma.subscription.findFirst({
    where: { stripeCustomerId: customerId },
    include: { user: true },
  });

  if (!dbSubscription) {
    logger.error("Subscription not found for customer", { customerId });
    return;
  }

  // Determine plan based on price ID
  let plan: "BASIC" | "PRO" | "ENTERPRISE" = "BASIC";
  if (priceId === process.env.STRIPE_PRICE_ID_PRO) plan = "PRO";
  else if (priceId === process.env.STRIPE_PRICE_ID_ENTERPRISE)
    plan = "ENTERPRISE";

  // Update subscription
  const timeline = subscription as unknown as StripeSubscriptionTimeline;
  await prisma.subscription.update({
    where: { id: dbSubscription.id },
    data: {
      stripeSubscriptionId: subscription.id,
      plan,
      status: subscription.status === "trialing" ? "TRIALING" : "ACTIVE",
      currentPeriodStart: new Date(timeline.current_period_start * 1000),
      currentPeriodEnd: new Date(timeline.current_period_end * 1000),
      trialStart: timeline.trial_start
        ? new Date(timeline.trial_start * 1000)
        : null,
      trialEnd: timeline.trial_end ? new Date(timeline.trial_end * 1000) : null,
    },
  });

  // Send email
  await sendSubscriptionEmail(
    dbSubscription.user.email,
    dbSubscription.user.firstName,
    plan,
    "activated",
  );

  logger.info("Subscription created in database", {
    subscriptionId: subscription.id,
    userId: dbSubscription.userId,
    plan,
  });
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const dbSubscription = await prisma.subscription.findFirst({
    where: { stripeSubscriptionId: subscription.id },
    include: { user: true },
  });

  if (!dbSubscription) {
    logger.error("Subscription not found", { subscriptionId: subscription.id });
    return;
  }

  const priceId = subscription.items.data[0].price.id;
  let plan: "BASIC" | "PRO" | "ENTERPRISE" = "BASIC";
  if (priceId === process.env.STRIPE_PRICE_ID_PRO) plan = "PRO";
  else if (priceId === process.env.STRIPE_PRICE_ID_ENTERPRISE)
    plan = "ENTERPRISE";

  const statusMap: Record<string, SubscriptionStatus> = {
    active: "ACTIVE",
    trialing: "TRIALING",
    past_due: "PAST_DUE",
    canceled: "CANCELLED",
    unpaid: "INACTIVE",
  };

  const timeline = subscription as unknown as StripeSubscriptionTimeline;
  await prisma.subscription.update({
    where: { id: dbSubscription.id },
    data: {
      plan,
      status: statusMap[subscription.status] || "INACTIVE",
      currentPeriodStart: new Date(timeline.current_period_start * 1000),
      currentPeriodEnd: new Date(timeline.current_period_end * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
    },
  });

  logger.info("Subscription updated", { subscriptionId: subscription.id });
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const dbSubscription = await prisma.subscription.findFirst({
    where: { stripeSubscriptionId: subscription.id },
    include: { user: true },
  });

  if (!dbSubscription) return;

  // Downgrade to FREE plan
  await prisma.subscription.update({
    where: { id: dbSubscription.id },
    data: {
      plan: "FREE",
      status: "CANCELLED",
      canceledAt: new Date(),
    },
  });

  await sendSubscriptionEmail(
    dbSubscription.user.email,
    dbSubscription.user.firstName,
    dbSubscription.plan,
    "cancelled",
  );

  logger.info("Subscription deleted", { subscriptionId: subscription.id });
}

async function handleInvoicePaid(invoice: Stripe.Invoice) {
  const subscriptionId = (invoice as { subscription?: string | null })
    .subscription;

  if (!subscriptionId) return;

  const dbSubscription = await prisma.subscription.findFirst({
    where: { stripeSubscriptionId: subscriptionId },
  });

  if (!dbSubscription) return;

  // Create invoice record
  await prisma.invoice.create({
    data: {
      subscriptionId: dbSubscription.id,
      stripeInvoiceId: invoice.id,
      amount: invoice.amount_paid,
      currency: invoice.currency,
      status: "paid",
      invoiceUrl: invoice.hosted_invoice_url || null,
      invoicePdf: invoice.invoice_pdf || null,
      paidAt: new Date(invoice.status_transitions.paid_at! * 1000),
    },
  });

  logger.info("Invoice paid", { invoiceId: invoice.id });
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  const subscriptionId = (invoice as { subscription?: string | null })
    .subscription;

  if (!subscriptionId) return;

  const dbSubscription = await prisma.subscription.findFirst({
    where: { stripeSubscriptionId: subscriptionId },
    include: { user: true },
  });

  if (!dbSubscription) return;

  // Update subscription status
  await prisma.subscription.update({
    where: { id: dbSubscription.id },
    data: { status: "PAST_DUE" },
  });

  // TODO: Send payment failed notification

  logger.warn("Invoice payment failed", {
    invoiceId: invoice.id,
    userId: dbSubscription.userId,
  });
}

async function handleTrialWillEnd(subscription: Stripe.Subscription) {
  const dbSubscription = await prisma.subscription.findFirst({
    where: { stripeSubscriptionId: subscription.id },
    include: { user: true },
  });

  if (!dbSubscription) return;

  // TODO: Send trial ending notification

  logger.info("Trial will end soon", {
    subscriptionId: subscription.id,
    trialEnd: subscription.trial_end,
  });
}
