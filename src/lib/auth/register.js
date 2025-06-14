"use server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
import bcrypt from "bcryptjs";

export const signUp = async (email, password, phone, name) => {
  const users = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  if (users) {
    return "Email Already Exist";
  }
  const roleUser = "user";
  const passwordhash = bcrypt.hashSync(password, 10);
  await prisma.user.create({
    data: {
      email,
      password: passwordhash,
      role: roleUser,
      name,
      phone,
    },
  });
  return "Sign Up Success";
};
