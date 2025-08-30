"use server";
import prisma from "@/lib/prisma";
import { getOneUser } from "./user";
import { Prisma } from "@prisma/client";

const getTypingHistories = async (username: any, limit = 9, offset = 0) => {
  try {
    const user = await getOneUser(username);
    const newTypingHistory = await prisma.typingHistory.findMany({
      where: {
        author: user!,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
      skip: offset,
    });

    let typingHistories: any = [];
    if (newTypingHistory) {
      typingHistories = newTypingHistory.map((typing) => {
        return {
          ...typing,
          wrongCharacters: typing.wrongCharacters as Prisma.JsonArray,
          quotes: typing.quotes as Prisma.JsonArray,
        };
      });
    }
    return typingHistories;
  } catch (error) {
    return null;
  }
};

export { getTypingHistories };
