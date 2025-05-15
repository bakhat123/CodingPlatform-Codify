"use client";

import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { Loader } from "lucide-react";
import { useSession, signOut } from "next-auth/react";

const User = () => {
  const router = useRouter();
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <Loader className="size-6 mr-4 mt-4 float-right animate-spin" />;
  }

  const avatarFallback = session?.user?.name?.charAt(0).toUpperCase() ?? "?";

  if (session) {
    return (
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger className="outline-none relative float-right p-4 md:p-8">
          <div className="flex gap-4 items-center">
            <span>{session.user?.name}</span>
            <Avatar className="size-10 hover:opacity-75 transition">
              <AvatarImage
                src={session.user?.image ?? ""}
                alt="User Avatar"
                className="size-10"
              />
              <AvatarFallback className="bg-sky-900 text-white">
                {avatarFallback}
              </AvatarFallback>
            </Avatar>
          </div>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-56 bg-[#161618] border border-[#373639] rounded-lg shadow-lg">
          <DropdownMenuItem
            onClick={() => {
              signOut({ callbackUrl: "/sign-in" });
            }}
            className="cursor-pointer"
          >
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return null; // If not logged in, render nothing or a login button
};

export default User;
