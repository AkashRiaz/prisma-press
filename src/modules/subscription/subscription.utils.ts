import Stripe from "stripe";
import { SubscriptionStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { stripe } from "../../lib/stripe";

export const getPeriodEnd = (payload: Stripe.Subscription) => {
  const currentPeriodEndInMilleSeconds =
    payload.items.data[0]?.current_period_end!;
  const currentPeriodEnd = new Date(currentPeriodEndInMilleSeconds * 1000);
  return currentPeriodEnd;
};

export const handleCheckoutCompleted = async (session: Stripe.Checkout.Session) => {
  const userId = session?.metadata?.userId;
  const stripeCustomerId = session.customer as string;
  const stripeSubscriptionId = session.subscription as string;

  if (!userId || !stripeSubscriptionId || !stripeCustomerId) {
    console.log(`webhook::Missing values for creating checkout session`);
    return;
  }

  const stripeSubscription =
    await stripe.subscriptions.retrieve(stripeSubscriptionId);

  const currentPeriodEnd = getPeriodEnd(stripeSubscription);

  await prisma.subscription.upsert({
    where: {
      userId,
    },
    create: {
      userId,
      stripeCustomerId,
      stripeSubscriptionId,
      status: "ACTIVE",
      currentPeriodEnd: currentPeriodEnd,
    },
    update: {
      stripeCustomerId,
      stripeSubscriptionId,
      status: "ACTIVE",
      currentPeriodEnd,
    },
  });
};

export const handleChangeSubscription = async (payload: Stripe.Subscription) => {
  const stripeSubscriptionId = payload.id;

  const status =
    payload.status === "active"
      ? SubscriptionStatus.ACTIVE
      : payload.status === "trialing"
        ? SubscriptionStatus.ACTIVE
        : payload.status === "canceled"
          ? SubscriptionStatus.CANCELED
          : SubscriptionStatus.EXPIRED;

  const currentPeriodEnd = getPeriodEnd(payload);

  const isSubscriptionExists = await prisma.subscription.findUnique({
    where: {
      stripeSubscriptionId: stripeSubscriptionId,
    },
  });

  if (!isSubscriptionExists) {
    console.log(
      `webhook:: No subscription fond for this subscription id: ${stripeSubscriptionId}`,
    );

    return;
  }

  await prisma.subscription.update({
    where: {
      stripeSubscriptionId,
    },
    data: {
      status,
      currentPeriodEnd,
    },
  });
};