import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import { IRegisterUser, User } from "./user.interface";

const insertUserIntoDb = async (
  payload: IRegisterUser,
): Promise<User | null> => {
  const { name, email, password, profilePhoto } = payload;
  const isUserExist = await prisma.user.findFirst({ where: { email } });

  if (isUserExist) {
    throw new Error("User will this email already exists.");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

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

export const userService = {
  insertUserIntoDb,
};
