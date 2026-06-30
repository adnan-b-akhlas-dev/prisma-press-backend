import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";

const checkoutSession = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {},
);

export const subscriptionController = {
  checkoutSession,
};
