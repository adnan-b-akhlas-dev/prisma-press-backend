import { Request, Response } from "express";
import httpStatus from "http-status";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendResponse } from "../../utils/sendResponse";
import { userService } from "./user.service";
import { jwtUtils } from "../../utils/jwt";
import config from "../../config";
import { User } from "./user.interface";

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

const getMyProfile = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.user as User;
    const data = await userService.getMyProfileFromDb(id);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Profile retrieved successfully.",
      data,
    });
  },
);

export const userController = {
  registerUser,
  getMyProfile,
};
