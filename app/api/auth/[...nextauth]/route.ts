import NextAuth, { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

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
  ],
  session: {
    // Choose how you want to save the user session.
    strategy: "jwt",

    // Seconds - How long until an idle session expires and is no longer valid.
    maxAge: 3 * 24 * 60 * 60, // 3 days
  },
  secret: process.env.NEXTAUTH_SECRET as string,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
