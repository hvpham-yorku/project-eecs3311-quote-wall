"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { LogIn, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function AuthButton() {
  const { data: session, status } = useSession(); // Check the session status
  
  console.log(session); // Debugging to ensure the session is correctly updated

  if (status === "loading") {
    return <Button variant="ghost" size="sm">Loading...</Button>; // Show a loading button while session is being fetched
  }

  if (session?.user) {
    const avatarImage =
      session.user.image ||
      `https://ui-avatars.com/api/?name=${session.user.name ? session.user.name[0] : "U"}&background=random&color=fff`;

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage src={avatarImage} alt={session.user.name || "User"} />
              <AvatarFallback>
                <span className="h-4 w-4">{session.user.name ? session.user.name[0] : "U"}</span>
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <div className="flex items-center justify-start gap-2 p-2">
            <div className="flex flex-col space-y-1 leading-none">
              <p className="font-medium">{session.user.name}</p>
              <p className="text-xs text-muted-foreground">{session.user.email}</p>
            </div>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/profile">Profile</Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-red-500 focus:text-red-500" onClick={() => signOut()}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Button variant="ghost" size="sm" className="gap-2" onClick={() => signIn("credentials")}>
      <LogIn className="h-4 w-4" />
      <span>Sign In</span>
    </Button>
  );
}
