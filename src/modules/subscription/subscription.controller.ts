import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { User } from "../user/user.interface";
import { subscriptionService } from "./subscription.service";
import { sendResponse } from "../../utils/sendResponse";
import status from "http-status";

const checkoutSession = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const userId = (req.user as User).id;
    const data = await subscriptionService.createCheckoutSession(userId);

    sendResponse(res, {
      success: true,
      statusCode: status.OK,
      message: "Payment successful.",
      data,
    });
  },
);

export const subscriptionController = {
  checkoutSession,
};
