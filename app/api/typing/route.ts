import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { wpm, wrongCharacters, quote = "", authorId } = body;

  const newTypingHistory = await prisma.typingHistory.create({
    data: {
      wpm: wpm,
      wrongCharacters: wrongCharacters,
      // quote
      author: { connect: { id: authorId } },
    },
    include: {
      author: true,
    },
  });
  return new Response(JSON.stringify(newTypingHistory));
}
