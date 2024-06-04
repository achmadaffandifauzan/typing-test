import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  // console.log(request);
  const { wpm, wrongCharacters, allTypedChar, authorId, accuracy } =
    await request.json();
  const newTypingHistory = await prisma.typingHistory.create({
    data: {
      wpm: wpm,
      wrongCharacters: wrongCharacters,
      allTypedChar: allTypedChar,
      accuracy: accuracy,
      author: { connect: { id: authorId } },
    },
    include: {
      author: true,
    },
  });
  return new Response(JSON.stringify(newTypingHistory));
}
