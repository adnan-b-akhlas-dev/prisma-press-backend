import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { jwtUtils } from "../utils/jwt";
import config from "../config";
import { prisma } from "../lib/prisma";
import { ActiveStatus, Role } from "../prisma/generated/prisma/enums";
import { AppError } from "../helpers/AppError";
import status from "http-status";

const auth = (...requiredRoles: Role[]) =>
  asyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      const token = (
        req.cookies["access_token"] || req.headers.authorization
      )?.split(" ")[1];

      if (!token) {
        throw new AppError("Please Login to continue.", status.BAD_REQUEST);
      }

      const decode = jwtUtils.verifyToken(token, config.jwt_access_secret);

      const user = await prisma.user.findUniqueOrThrow({
        where: { id: decode.id },
        omit: { password: true },
      });

      if (user.activeStatus === ActiveStatus.BLOCKED) {
        throw new AppError(
          "Your account has been blocked. Please contact with customer support.",
          status.UNAUTHORIZED,
        );
      }

      if (!requiredRoles.includes(user.role)) {
        throw new AppError(
          "Access forbidden. You do not have permission to access this api.",
          status.FORBIDDEN,
        );
      }

      req.user = user;

      next();
    },
  );

export default auth;
