import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
import { authService } from "./auth.service";

const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const payload = req.body;
  const data = await authService.authenticateUser(payload);

  res.cookie("access_token", `Bearer ${data.accessToken}`, {
    httpOnly: true,
    secure: false,
    sameSite: "none",
    maxAge: 1000 * 60 * 60 * 24,
  });

  res.cookie("refresh_token", `Bearer ${data.refreshToken}`, {
    httpOnly: true,
    secure: false,
    sameSite: "none",
    maxAge: 1000 * 60 * 60 * 24 * 7,
  });

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User login successfully.",
    data,
  });
});

export const authController = {
  loginUser,
};
