import { Router } from "express";
import { userController } from "./user.controller";
import auth from "../../middlewares/auth.middleware";
import { Role } from "../../../generated/prisma/enums";

export const userRouter: Router = Router();

userRouter.post("/register", userController.registerUser);
userRouter.get(
  "/me",
  auth(Role.ADMIN, Role.AUTHOR, Role.USER),
  userController.getMyProfile,
);
