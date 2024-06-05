import { type DefaultSession, type DefaultUser } from "next-auth";
import { JWT } from "next-auth/jwt";
// https://stackoverflow.com/questions/74425533/property-role-does-not-exist-on-type-user-adapteruser-in-nextauth
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: DefaultSession["user"] & {
      username: string; // adding rules : username field to user object in session object
    };
  }
  interface User extends DefaultUser {
    username: string; // adding rules :  username field to user object
  }
}

// adding username field to jwt, so that in callback in [..nextauth], we can store username to token, then pass it to session
declare module "next-auth/jwt" {
  interface JWT {
    username: string;
  }
}
