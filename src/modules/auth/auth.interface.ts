import { UserModel } from "../../../generated/prisma/models";

export interface ILoginPayload {
  email: string;
  password: string;
}

export interface ILoginResponse {
  user: Omit<UserModel, "password">;
  accessToken: string;
  refreshToken: string;
}
