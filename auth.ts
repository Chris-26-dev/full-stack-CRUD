// auth.ts
import type { AuthOptions } from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "./database";

export const authOptions: AuthOptions = {
  session: { strategy: "jwt" },
  adapter: DrizzleAdapter(db),
  secret: process.env.AUTH_SECRET,
  pages: { signIn: "/login" },
  providers: [
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
      authorization: {
        params: {
          redirect_uri: `${process.env.BASE_URL}/api/auth/callback/google`,
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    CredentialsProvider({
      name: "Sign in",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null;
        const user = await db.query.users.findFirst({
          where: (users, { eq }) => eq(users.email, String(credentials.email)),
        });
        if (!user) return null;
        const valid = await bcrypt.compare(
          String(credentials.password),
          user.password!
        );
        if (!valid) return null;
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          randomKey: "Hey cool",
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user)
        return {
          ...token,
          id: (user as any).id,
          randomKey: (user as any).randomKey,
        };
      return token;
    },
    async session({ session, token, user }) {
      if (token.name) session.user.name = token.name;
      if (token.picture) session.user.image = token.picture;
      return session;
    },
  },
};

// Export only the options. The App Router API route initializes NextAuth:
// app/api/auth/[...nextauth]/route.ts -> const handler = NextAuth(authOptions)
// and exports GET/POST handlers. Calling NextAuth here at module-load caused the
// API route to return HTML in some dev flows (client fetch received an HTML
// error page instead of JSON). Keeping NextAuth initialization inside the route
// prevents that.
