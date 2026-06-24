import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";

const createToken = (
  payload: JwtPayload,
  secretKey: string,
  expiresIn: string,
): string => {
  const token = jwt.sign(payload, secretKey, { expiresIn } as SignOptions);
  return token;
};

const verifyToken = (token: string, secretKey: string): JwtPayload => {
  try {
    const decode = jwt.verify(token, secretKey);
    return decode as JwtPayload;
  } catch (error: unknown) {
    const err = error as Error;
    console.log("Token verification failed", error);
    throw new Error(err.message);
  }
};

export const jwtUtils = {
  createToken,
  verifyToken,
};
