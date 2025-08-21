"use client";

import React from "react";
import { signOut } from "next-auth/react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

type Props = {
  user: { name?: string | null; email?: string | null; image?: string | null };
};

export default function UserCard({ user }: Props) {
  if (!user) return null;

  return (
    <Card className="w-[400px] flex flex-col items-center gap-4 p-6 shadow-lg">
      <CardHeader className="flex flex-col items-center gap-2">
        <Avatar className="w-24 h-24">
          {user.image ? (
            <AvatarImage src={user.image} alt={user.name || "User"} />
          ) : (
            <AvatarFallback>{user.name?.[0] || "U"}</AvatarFallback>
          )}
        </Avatar>
        <CardTitle className="text-xl text-center">{user.name}</CardTitle>
        <CardDescription className="text-center text-gray-500">{user.email}</CardDescription>
      </CardHeader>

      <CardContent className="flex justify-center w-full">
        <Button
          variant="destructive"
          onClick={() => signOut({ redirect: true, callbackUrl: "/login" })}
          className="w-full"
        >
          Logout
        </Button>
      </CardContent>
    </Card>
  );
}
