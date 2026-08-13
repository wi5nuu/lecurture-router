import Stripe from "stripe";
import { logger } from "./logger";

let stripeClient: Stripe | undefined;

function getStripe(): Stripe {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error(
      "STRIPE_SECRET_KEY is not defined in environment variables",
    );
  }

  if (!stripeClient) {
    stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2026-07-29.dahlia",
      typescript: true,
    });
  }

  return stripeClient;
}

// Subscription plans configuration
export const SUBSCRIPTION_PLANS = {
  FREE: {
    name: "Free",
    priceMonthly: 0,
    features: [
      "Access to 1,000 materials",
      "Basic search",
      "5 bookmarks",
      "Email support",
    ],
    limits: {
      materials: 1000,
      bookmarks: 5,
      searches: 50,
    },
  },
  BASIC: {
    name: "Basic",
    priceMonthly: 9.99,
    stripePriceId: process.env.STRIPE_PRICE_ID_BASIC,
    features: [
      "Access to 10,000 materials",
      "Advanced search",
      "Unlimited bookmarks",
      "Export materials",
      "Priority email support",
    ],
    limits: {
      materials: 10000,
      bookmarks: -1, // unlimited
      searches: 500,
    },
  },
  PRO: {
    name: "Pro",
    priceMonthly: 29.99,
    stripePriceId: process.env.STRIPE_PRICE_ID_PRO,
    features: [
      "Access to all materials",
      "AI-powered search",
      "Unlimited bookmarks",
      "Export to multiple formats",
      "Real-time notifications",
      "API access",
      "Priority support",
    ],
    limits: {
      materials: -1, // unlimited
      bookmarks: -1,
      searches: -1,
      apiRequests: 10000,
    },
  },
  ENTERPRISE: {
    name: "Enterprise",
    priceMonthly: 99.99,
    stripePriceId: process.env.STRIPE_PRICE_ID_ENTERPRISE,
    features: [
      "Everything in Pro",
      "Dedicated account manager",
      "Custom integrations",
      "White-label options",
      "SLA guarantee",
      "Advanced analytics",
      "Unlimited API access",
    ],
    limits: {
      materials: -1,
      bookmarks: -1,
      searches: -1,
      apiRequests: -1,
    },
  },
} as const;

// Create Stripe customer
export async function createStripeCustomer(
  email: string,
  userId: string,
  name?: string,
): Promise<Stripe.Customer> {
  try {
    const customer = await getStripe().customers.create({
      email,
      name,
      metadata: {
        userId,
      },
    });

    logger.info("Stripe customer created", { customerId: customer.id, userId });
    return customer;
  } catch (error) {
    logger.error("Failed to create Stripe customer", error, { userId, email });
    throw error;
  }
}

// Create subscription
export async function createSubscription(
  customerId: string,
  priceId: string,
  trialDays?: number,
): Promise<Stripe.Subscription> {
  try {
    const subscription = await getStripe().subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      payment_behavior: "default_incomplete",
      payment_settings: { save_default_payment_method: "on_subscription" },
      expand: ["latest_invoice.payment_intent"],
      ...(trialDays ? { trial_period_days: trialDays } : {}),
    });

    logger.info("Stripe subscription created", {
      subscriptionId: subscription.id,
      customerId,
    });
    return subscription;
  } catch (error) {
    logger.error("Failed to create subscription", error, {
      customerId,
      priceId,
    });
    throw error;
  }
}

// Update subscription
export async function updateSubscription(
  subscriptionId: string,
  newPriceId: string,
): Promise<Stripe.Subscription> {
  try {
    const subscription =
      await getStripe().subscriptions.retrieve(subscriptionId);

    const updatedSubscription = await getStripe().subscriptions.update(
      subscriptionId,
      {
        items: [
          {
            id: subscription.items.data[0].id,
            price: newPriceId,
          },
        ],
        proration_behavior: "create_prorations",
      },
    );

    logger.info("Stripe subscription updated", { subscriptionId, newPriceId });
    return updatedSubscription;
  } catch (error) {
    logger.error("Failed to update subscription", error, {
      subscriptionId,
      newPriceId,
    });
    throw error;
  }
}

// Cancel subscription
export async function cancelSubscription(
  subscriptionId: string,
  immediately: boolean = false,
): Promise<Stripe.Subscription> {
  try {
    const subscription = immediately
      ? await getStripe().subscriptions.cancel(subscriptionId)
      : await getStripe().subscriptions.update(subscriptionId, {
          cancel_at_period_end: true,
        });

    logger.info("Stripe subscription cancelled", {
      subscriptionId,
      immediately,
    });
    return subscription;
  } catch (error) {
    logger.error("Failed to cancel subscription", error, { subscriptionId });
    throw error;
  }
}

// Resume cancelled subscription
export async function resumeSubscription(
  subscriptionId: string,
): Promise<Stripe.Subscription> {
  try {
    const subscription = await getStripe().subscriptions.update(
      subscriptionId,
      {
        cancel_at_period_end: false,
      },
    );

    logger.info("Stripe subscription resumed", { subscriptionId });
    return subscription;
  } catch (error) {
    logger.error("Failed to resume subscription", error, { subscriptionId });
    throw error;
  }
}

// Create checkout session
export async function createCheckoutSession(
  customerId: string,
  priceId: string,
  successUrl: string,
  cancelUrl: string,
  trialDays?: number,
): Promise<Stripe.Checkout.Session> {
  try {
    const session = await getStripe().checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      ...(trialDays
        ? { subscription_data: { trial_period_days: trialDays } }
        : {}),
    });

    logger.info("Checkout session created", {
      sessionId: session.id,
      customerId,
    });
    return session;
  } catch (error) {
    logger.error("Failed to create checkout session", error, {
      customerId,
      priceId,
    });
    throw error;
  }
}

// Create billing portal session
export async function createBillingPortalSession(
  customerId: string,
  returnUrl: string,
): Promise<Stripe.BillingPortal.Session> {
  try {
    const session = await getStripe().billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });

    logger.info("Billing portal session created", {
      sessionId: session.id,
      customerId,
    });
    return session;
  } catch (error) {
    logger.error("Failed to create billing portal session", error, {
      customerId,
    });
    throw error;
  }
}

// Retrieve subscription
export async function retrieveSubscription(
  subscriptionId: string,
): Promise<Stripe.Subscription> {
  try {
    return await getStripe().subscriptions.retrieve(subscriptionId);
  } catch (error) {
    logger.error("Failed to retrieve subscription", error, { subscriptionId });
    throw error;
  }
}

// List customer invoices
export async function listCustomerInvoices(
  customerId: string,
  limit: number = 10,
): Promise<Stripe.Invoice[]> {
  try {
    const invoices = await getStripe().invoices.list({
      customer: customerId,
      limit,
    });

    return invoices.data;
  } catch (error) {
    logger.error("Failed to list customer invoices", error, { customerId });
    throw error;
  }
}

// Retrieve invoice
export async function retrieveInvoice(
  invoiceId: string,
): Promise<Stripe.Invoice> {
  try {
    return await getStripe().invoices.retrieve(invoiceId);
  } catch (error) {
    logger.error("Failed to retrieve invoice", error, { invoiceId });
    throw error;
  }
}

// Construct webhook event
export function constructWebhookEvent(
  payload: string | Buffer,
  signature: string,
  secret: string,
): Stripe.Event {
  try {
    return getStripe().webhooks.constructEvent(payload, signature, secret);
  } catch (error) {
    logger.error("Failed to construct webhook event", error);
    throw error;
  }
}

// Get plan limits
export function getPlanLimits(plan: keyof typeof SUBSCRIPTION_PLANS) {
  return SUBSCRIPTION_PLANS[plan].limits;
}

// Check if user can access feature
export function canAccessFeature(
  userPlan: keyof typeof SUBSCRIPTION_PLANS,
  feature: keyof typeof SUBSCRIPTION_PLANS.PRO.limits,
  currentUsage: number,
): boolean {
  const limits = getPlanLimits(userPlan);
  const limit = limits[feature as keyof typeof limits];

  // -1 means unlimited
  if (limit === -1) return true;

  // Check if usage is within limit
  return currentUsage < (limit || 0);
}
