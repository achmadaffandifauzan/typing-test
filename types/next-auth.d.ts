import NextAuth from "next-auth";
// custom to add username in session next auth
declare module "next-auth" {
  interface Session {
    user: {
      username: string;
    } & DefaultSession["user"];
  }
}
