import { Router } from "express";
import { authController } from "./auth.controller";

export const authRouter: Router = Router();

authRouter.post("/login", authController.loginUser);
authRouter.post("/refresh-token", authController.refreshToken);
