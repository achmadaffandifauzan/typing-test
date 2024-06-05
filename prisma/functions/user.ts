"use server";
import prisma from "@/lib/prisma";
// since user info is frequently used, better to store it here to reuse anywhere else
const getOneUser = async (username: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        username: username,
      },
    });
    return user;
  } catch (error) {
    return null;
  }
};
export { getOneUser };
