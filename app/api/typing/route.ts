import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  console.log(request);
  const { wpm, wrongCharacters, allTypedChar, authorId } = await request.json();
  console.log(wpm, wrongCharacters, allTypedChar, authorId);
  const newTypingHistory = await prisma.typingHistory.create({
    data: {
      wpm: wpm,
      wrongCharacters: wrongCharacters,
      allTypedChar: allTypedChar,
      author: { connect: { id: authorId } },
    },
    include: {
      author: true,
    },
  });
  return new Response(JSON.stringify(newTypingHistory));
}
