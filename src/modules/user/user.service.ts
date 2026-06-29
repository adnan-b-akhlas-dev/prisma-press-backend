import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import { IRegisterUser, User } from "./user.interface";
import config from "../../config";

const insertUserIntoDb = async (
  payload: IRegisterUser,
): Promise<User | null> => {
  const { name, email, password, profilePhoto } = payload;

  const hashedPassword = await bcrypt.hash(
    password,
    Number(config.bcrypt_salt_round),
  );

  const registeredUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      profile: {
        create: {
          profilePhoto,
        },
      },
    },
  });

  const user = await prisma.user.findUnique({
    where: { id: registeredUser.id },
    omit: { password: true },
    include: {
      profile: {
        omit: { id: true, userId: true, createdAt: true, updatedAt: true },
      },
    },
  });

  return user;
};

const getMyProfileFromDb = async (payload: string): Promise<User> => {
  const user = await prisma.user.findUniqueOrThrow({
    where: { id: payload },
    omit: { password: true },
    include: {
      profile: {
        omit: { id: true, userId: true, createdAt: true, updatedAt: true },
      },
    },
  });
  return user;
};

export const userService = {
  insertUserIntoDb,
  getMyProfileFromDb,
};
