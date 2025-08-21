import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string; // your user id
      randomKey?: string; // optional custom field
    } & DefaultSession["user"];
  }

  interface User {
    id: string; // needed if you use JWT / adapter
    randomKey?: string;
  }
}
