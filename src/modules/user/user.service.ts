import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import config from "../../config";
import { CreateUserPayload } from "./user.interface";


const createUserIntoDB = async (payload: CreateUserPayload) => {
  const { name, email, password, profilePhoto } = payload;
  const isUserExist = await prisma.user.findUnique({ where: { email } });
  if (isUserExist) {
    throw new Error("User already exists with this email!");
  }

  const hashedPassword = await bcrypt.hash(
    password,
    Number(config.bcrypt_salt_rounds),
  );

  const createdUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      profile: {
        create: {
          profilePhoto
        }
      }
    },
  });

  // await prisma.profile.create({
  //   data: {
  //     userId: createdUser.id,
  //     profilePhoto,
  //   },
  // });

  const user = await prisma.user.findUnique({
    where: { id: createdUser.id, email: createdUser.email },
    omit: {
      password: true,
    },
    include: {
      profile: true,
    },
  });
  return user;
};

export const userService = {
    createUserIntoDB,
}
