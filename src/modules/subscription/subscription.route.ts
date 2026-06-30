import { Router } from "express";
import { subscriptionController } from "./subscription.controller";
import auth from "../../middlewares/auth.middleware";
import { Role } from "../../prisma/generated/prisma/enums";

export const subscriptionRouter: Router = Router();

subscriptionRouter.post(
  "/checkout",
  auth(Role.ADMIN, Role.AUTHOR, Role.USER),
  subscriptionController.checkoutSession,
);
