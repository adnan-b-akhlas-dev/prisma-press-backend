import { Request, Response } from "express";
import { userService } from "./user.service";
import httpStatus from "http-status";

const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const payload = req.body;
    const data = await userService.insertUserIntoDb(payload);
    res.status(httpStatus.CREATED).json({
      success: true,
      statusCode: httpStatus.CREATED,
      message: "User registered successfully.",
      data,
    });
  } catch (error: unknown) {
    console.error(error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      message: (error as Error).message,
      error,
    });
  }
};

export const userController = {
  registerUser,
};
