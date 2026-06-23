import bcrypt from "bcryptjs";
import config from "../../config";
import { prisma } from "../../lib/prisma";
import { jwtUtils } from "../../utils/jwt";
import { ILoginPayload, ILoginResponse } from "./auth.interface";

const authenticateUser = async (
  payload: ILoginPayload,
): Promise<ILoginResponse> => {
  const { email, password } = payload;
  const user = await prisma.user.findUniqueOrThrow({
    where: { email },
  });

  const isPasswordMatched = await bcrypt.compare(password, user.password);
  if (!isPasswordMatched) {
    throw new Error("Invalid credentials.");
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

export const authService = {
  authenticateUser,
};
