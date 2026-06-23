import { Request, Response } from "express";
import httpStatus from "http-status";
import { userService } from "./user.service";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendResponse } from "../../utils/sendResponse";

const registerUser = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const payload = req.body;
    const data = await userService.insertUserIntoDb(payload);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "User registered successfully.",
      data,
    });
  },
);

export const userController = {
  registerUser,
};
