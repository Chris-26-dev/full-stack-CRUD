// app/providers.tsx

"use client"; // This tells Next.js: "This is a Client Component"

import { SessionProvider } from "next-auth/react";

// This is a new component that wraps the SessionProvider
export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // Now, the SessionProvider is only rendered inside a Client Component
  return <SessionProvider>{children}</SessionProvider>;
}
