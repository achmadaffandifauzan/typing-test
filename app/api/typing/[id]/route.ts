import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/authOptions";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response("Unauthorized!", { status: 401 });
  }
  if (!session) {
    return new Response("Unauthorized", { status: 400 });
  }
  const id = params.id;
  if (!id) {
    return new Response("Missing ID parameter", { status: 400 });
  }

  const typing = await prisma.typingHistory.findUnique({
    where: {
      id: parseInt(id),
    },
    include: {
      author: {
        select: { name: true },
      },
    },
  });

  return new Response(JSON.stringify(typing));
}
