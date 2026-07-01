import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application, Request, Response } from "express";
import status from "http-status";
import morgan from "morgan";
import config from "./config";
import { stripe } from "./lib/stripe";
import globalError from "./middlewares/globalError.middleware";
import notFound from "./middlewares/notFound.middleware";
import { authRouter } from "./modules/auth/auth.route";
import { commentRouter } from "./modules/comment/comment.route";
import { postRouter } from "./modules/post/post.route";
import { subscriptionRouter } from "./modules/subscription/subscription.route";
import { userRouter } from "./modules/user/user.route";

const app: Application = express();

const ENDPOINT_SECRET = config.stripe_webhook_secret_key;

app.post(
  "/api/subscription/webhook",
  express.raw({ type: "application/json" }),
  (req: Request, res: Response) => {
    let event = req.body;
    // Only verify the event if you have an endpoint secret defined.
    // Otherwise use the basic event deserialized with JSON.parse
    if (ENDPOINT_SECRET) {
      // Get the signature sent by Stripe
      const signature = req.headers["stripe-signature"]!;
      try {
        event = stripe.webhooks.constructEvent(
          req.body,
          signature,
          ENDPOINT_SECRET,
        );
      } catch (error: unknown) {
        const err = error as Error;
        console.log(`⚠️  Webhook signature verification failed.`, err.message);
        return res.status(status.BAD_REQUEST).json({
          success: false,
          statusCode: status.BAD_REQUEST,
          message: err.message,
          error: err.stack,
        });
      }
    }

    // Handle the event
    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntent = event.data.object;
        console.log(
          `PaymentIntent for ${paymentIntent.amount} was successful!`,
        );
        // Then define and call a method to handle the successful payment intent.
        // handlePaymentIntentSucceeded(paymentIntent);
        break;
      case "payment_method.attached":
        const paymentMethod = event.data.object;
        // Then define and call a method to handle the successful attachment of a PaymentMethod.
        // handlePaymentMethodAttached(paymentMethod);
        break;
      default:
        // Unexpected event type
        console.log(`Unhandled event type ${event.type}.`);
    }

    // Return a 200 response to acknowledge receipt of the event
    res.send();
  },
);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "API is running.",
  });
});

app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/posts", postRouter);
app.use("/api/comments", commentRouter);
app.use("/api/subscription", subscriptionRouter);

app.use(notFound);
app.use(globalError);

export default app;
