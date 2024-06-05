import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import prisma from "@/lib/prisma";

export const POST = async (req: NextRequest) => {
  // POST here only for register (when client req on /api/auth on POST method)
  try {
    const { username, password } = await req.json();

    // Check if the username already exists
    const existingUser = await prisma.user.findUnique({
      where: {
        username: username,
      },
    });

    if (existingUser) {
      return new Response("Username already exists!", { status: 409 });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = await prisma.user.create({
      data: {
        password: hashedPassword,
        username: username,
      },
    });
    return new Response(JSON.stringify(newUser));
  } catch (error) {
    console.error("Error during user registration:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
};

// GET? no need, to get 1 user, we can directly use the ORM in server components
// https://www.reddit.com/r/nextjs/comments/175gg9c/how_to_retrieve_data_from_an_orm_in_next_js_13/
