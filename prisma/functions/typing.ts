"use server";
import prisma from "@/lib/prisma";
import { getOneUser } from "./user";
const getTypingHistories = async (username: any) => {
  try {
    const user = await getOneUser(username);
    const newTypingHistory = await prisma.typingHistory.findMany({
      where: {
        author: user!,
      },
    });
    return newTypingHistory;
  } catch (error) {
    return null;
  }
};

export { getTypingHistories };
