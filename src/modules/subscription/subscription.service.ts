import config from "../../config";
import { prisma } from "../../lib/prisma";
import { stripe } from "../../lib/stripe";

const createCheckoutSession = async (
  userId: string,
): Promise<string | null> => {
  const result = await prisma.$transaction(async (tx) => {
    const user = await tx.user.findUniqueOrThrow({
      where: { id: userId },
      include: { subcription: true },
    });

    let stripeCustomerId = user.subcription?.stripeCustomerId;

    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name,
        metadata: { userId: user.id },
      });

      stripeCustomerId = customer.id;
    }

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: config.stripe_product_price_id,
          quantity: 1,
        },
      ],
      customer: stripeCustomerId,
      mode: "subscription",
      success_url: `${config.frontend_url}/payment?success=true`,
      cancel_url: `${config.frontend_url}/cancel?success=false`,
      metadata: { userId: user.id },
    });

    return session.url;
  });

  return result;
};

export const subscriptionService = {
  createCheckoutSession,
};
