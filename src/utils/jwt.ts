import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";

const createToken = (
  payload: JwtPayload,
  secretKey: string,
  expiresIn: string,
): string => {
  const token = jwt.sign(payload, secretKey, { expiresIn } as SignOptions);
  return token;
};

export const jwtUtils = {
  createToken,
};
