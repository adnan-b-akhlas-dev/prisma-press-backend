import { Router } from "express";
import { userController } from "./user.controller";

export const userRouter: Router = Router();

userRouter.post("/register", userController.registerUser);
