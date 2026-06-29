import bcrypt from "bcryptjs";
import config from "../../config";
import { prisma } from "../../lib/prisma";
import { ActiveStatus } from "../../prisma/generated/prisma/enums";
import { jwtUtils } from "../../utils/jwt";
import { ILoginPayload, ILoginResponse } from "./auth.interface";
import { AppError } from "../../helpers/AppError";
import status from "http-status";

const authenticateUser = async (
  payload: ILoginPayload,
): Promise<ILoginResponse> => {
  const { email, password } = payload;
  const user = await prisma.user.findUniqueOrThrow({
    where: { email },
  });

  const isPasswordMatched = await bcrypt.compare(password, user.password);
  if (!isPasswordMatched) {
    throw new AppError("Invalid credentials.", status.BAD_REQUEST);
  }
  const { password: _, ...safeUser } = user;

  const jwtPayload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  const accessToken = jwtUtils.createToken(
    jwtPayload,
    config.jwt_access_secret,
    config.jwt_access_expires_in,
  );

  const refreshToken = jwtUtils.createToken(
    jwtPayload,
    config.jwt_refresh_secret,
    config.jwt_refresh_expires_in,
  );

  return { user: safeUser, accessToken, refreshToken };
};

const renewAccessToken = async (refreshToken: string): Promise<string> => {
  const decode = jwtUtils.verifyToken(refreshToken, config.jwt_refresh_secret);
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      id: decode.id,
      email: decode.email,
    },
  });

  if (user.activeStatus === ActiveStatus.BLOCKED) {
    throw new AppError(
      "You account is blocked. Please contact with customer support.",
      status.UNAUTHORIZED,
    );
  }

  const jwtPayload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  const newAccessToken = jwtUtils.createToken(
    jwtPayload,
    config.jwt_access_secret,
    config.jwt_access_expires_in,
  );
  return newAccessToken;
};

export const authService = {
  authenticateUser,
  renewAccessToken,
};
