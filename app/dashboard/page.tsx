import { getServerSession } from "next-auth";
import UserCard from "./user-card";
import { authOptions } from "../../auth";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

// ✅ This tells Next.js not to prerender the page
export const dynamic = "force-dynamic";

export default async function Dashboard() {
  const session = await getServerSession(authOptions as any);

  // If there's no session, return a small placeholder or redirect logic
  const user = (session as any)?.user ?? null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <UserCard user={user} />
    </div>
  );
}
