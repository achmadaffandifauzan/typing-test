import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/authOptions";

export const GET = async (
  request: NextRequest,
  { params }: { params: { username: string } }
) => {
  if (!params.username) {
    return new Response("Page Not Found!", { status: 404 });
  }
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response("Unauthorized!", { status: 401 });
    }
    const decodedUsername = decodeURIComponent(params.username);
    const requestUser = await prisma.user.findUnique({
      where: {
        username: decodedUsername,
      },
    });
    if (!requestUser) {
      return new Response("User not found!", { status: 404 });
    }
    if (requestUser?.username !== session.user.username) {
      return new Response("Unauthorized!", { status: 401 });
    }

    const typingHistories = await prisma.typingHistory.findMany({
      where: {
        authorId: requestUser.id,
      },
      include: {
        author: {
          select: { name: true },
        },
      },
    });

    return new Response(JSON.stringify(typingHistories), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.log(error);
    return new Response("Internal server error!", { status: 500 });
  }
};
