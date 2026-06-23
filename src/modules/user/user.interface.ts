import { Prisma } from "../../../generated/prisma/client";

export interface IRegisterUser {
  name: string;
  email: string;
  password: string;
  profilePhoto: string;
}

export type User = Prisma.UserGetPayload<{
  omit: { password: true };
  include: {
    profile: {
      omit: { id: true; userId: true; createdAt: true; updatedAt: true };
    };
  };
}>;
