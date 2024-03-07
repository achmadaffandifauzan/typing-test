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
    maxAge: 5 * 60 * 60, // 5 hours
  },
  secret: process.env.NEXTAUTH_SECRET as string,
  callbacks: {
    // as far as i know, to provide session data after login success / while authenticated, and add more content to session object
    async jwt({ token, user }) {
      user && (token.username = user.username);
      return token;
    },
    async session({ session, token }) {
      // console.log("session...", session);
      // console.log("token...", token);
      if (token.email) {
        session.user.username = token.email;
      }
      if (token.username) {
        session.user.username = token.username;
      }
      return session;
    },
    async signIn({ user, account }) {
      // Use this callback to control if a user is allowed to sign in. Returning true will continue the sign-in flow. Throwing an error or returning a string will stop the flow, and redirect the user.
      // https://next-auth.js.org/configuration/callbacks
      // console.log(user,account);
      if (account!.provider === "credentials") {
        return true;
      }
      const foundUser = await prisma.user.findUnique({
        where: { username: user.email! },
      });
      if (foundUser) {
        return true;
      } else {
        // Create a new user if user with this email not existed
        const newUser = await prisma.user.create({
          data: {
            username: user.email!,
            name: user.name,
          },
        });
        if (newUser) {
          return true;
        } else {
          return false;
        }
      }
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
