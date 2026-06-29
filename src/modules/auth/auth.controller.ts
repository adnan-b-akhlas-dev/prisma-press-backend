import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendResponse } from "../../utils/sendResponse";
import status from "http-status";
import { authService } from "./auth.service";

const loginUser = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
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
      statusCode: status.OK,
      message: "User login successfully.",
      data,
    });
  },
);

const refreshToken = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const refreshToken = (
      req.cookies["refresh_token"] || req.body.refreshToken
    )?.split(" ")[1];

    if (!refreshToken) {
      throw new Error("Refresh token is missing");
    }

    const accessToken = await authService.renewAccessToken(refreshToken);
    res.cookie("access_token", accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "none",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    sendResponse(res, {
      success: true,
      statusCode: status.OK,
      message: "Access Token renewed successfully.",
      data: { accessToken },
    });
  },
);

export const authController = {
  loginUser,
  refreshToken,
};
