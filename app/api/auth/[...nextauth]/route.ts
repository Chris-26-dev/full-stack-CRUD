import NextAuth from "next-auth";
// @ts-ignore: This import will exist in the generated boilerplate
import { authOptions } from "@/auth"; // your auth.ts exports authOptions

const handler = NextAuth(authOptions);

// Export GET and POST for the App Router
export { handler as GET, handler as POST };
