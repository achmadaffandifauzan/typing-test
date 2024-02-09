import NextAuth, { NextAuthOptions, User } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";

const isDevelopment = process.env.NODE_ENV === "development";

const githubClientId = isDevelopment
  ? process.env.GITHUB_ID_DEVELOPMENT
  : process.env.GITHUB_ID_PRODUCTION;

const githubClientSecret = isDevelopment
  ? process.env.GITHUB_SECRET_DEVELOPMENT
  : process.env.GITHUB_SECRET_PRODUCTION;

const authOptions: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: githubClientId as string,
      clientSecret: githubClientSecret as string,
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        username: { id: "username", type: "text" },
        password: { id: "password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials || !credentials.username || !credentials.password)
          return null;

        const user = await prisma.user.findUnique({
          where: { username: credentials.username },
        });

        if (user?.password) {
          // user log in attempt
          const passwordMatched = await bcrypt.compare(
            credentials.password,
            user.password
          );
          const { password, createdAt, id, ...dbUserWithoutPassword } = user; // https://github.com/ipenywis/nextjs-auth/blob/main/lib/auth.ts ....why? so that password not brought to session in client
          if (passwordMatched) {
            return dbUserWithoutPassword as any;
          }
        }
        return null;
      },
    }),
  ],
  session: {
    // Choose how you want to save the user session.
    strategy: "jwt",

    // Seconds - How long until an idle session expires and is no longer valid.
    maxAge: 3 * 24 * 60 * 60, // 3 days
  },
  secret: process.env.NEXTAUTH_SECRET as string,
  // callbacks: {
  //   async jwt({ token, user }) {
  //     user && (token.user = user);
  //     return token;
  //   },
  //   async session({ session, token }) {
  //     session.user = token.user!;
  //     return session;
  //   },
  // },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
