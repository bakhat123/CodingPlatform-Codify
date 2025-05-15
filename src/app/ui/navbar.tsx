"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useDiamonds } from "@/context/DiamondsContext";
import { usePoints } from "@/context/PointsContext";
import { useSession, signOut } from "next-auth/react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Loader } from "lucide-react";
import { Input } from "@/components/ui/input";

interface UserSuggestion {
  username: string;
  pfp?: string;
}

const Navbar = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { diamonds } = useDiamonds();
  const { points } = usePoints();
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<UserSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Disable browser autocomplete
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.autocomplete = "off";
      inputRef.current.setAttribute("autocomplete", "off");
      inputRef.current.setAttribute("aria-autocomplete", "none");
    }
  }, []);

  // Fetch user suggestions
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery.trim().length > 0) {
        setIsLoading(true);
        try {
          const response = await fetch(
            `/api/users/search?query=${encodeURIComponent(searchQuery)}`
          );
          const data = await response.json();
          setSuggestions(data.users || []);
        } catch (error) {
          console.error("Error fetching suggestions:", error);
          setSuggestions([]);
        } finally {
          setIsLoading(false);
        }
      } else {
        setSuggestions([]);
      }
    };

    const debounceTimer = setTimeout(() => {
      fetchSuggestions();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSuggestionClick = (username: string) => {
    router.push(`/Profile/${username}`);
    setSearchQuery("");
    setShowSuggestions(false);
  };

  if (diamonds === null || points === null) {
    return <Loader className="animate-spin text-white" />;
  }

  return (
    <div className="bg-primary h-[88px] fixed top-0 left-0 shadow-lg border-[0.3571vh] border-[#212023] z-20 w-full flex items-center">
      <div
        className="flex items-center ml-[41px] hover:cursor-pointer"
        onClick={() => router.push("/")}
      >
        <div className="red w-[110px] h-[42px] text-[32px] font-medium font-tektur text-white">
          Codify
        </div>
      </div>

      <div className="ml-[160px] relative" ref={searchRef}>
        <div className="bg-[linear-gradient(180deg,#161618_0%,#242426_90%,#242426_100%)] 
          w-[450px] h-[41px] rounded-[12px] border-[0.3571vh] border-[#373639] flex items-center px-3">
          <Image
            src={`/assets/images/navbar/search.svg`}
            alt="Search Icon"
            width={20}
            height={20}
            className="w-[20px] h-[20px]"
            quality={100}
          />
          <Input
            ref={inputRef}
            type="text"
            placeholder="Search Users"
            className="bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 
                      text-white font-tektur text-[15px] ml-3 w-full placeholder-[#4B4A4D]"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            autoComplete="off"
            name="search"
            id="search-users"
          />
        </div>

        {/* Suggestions dropdown */}
        {showSuggestions && (searchQuery.trim() || suggestions.length > 0) && (
          <div className="absolute top-full left-0 w-full mt-1 bg-[#242426] rounded-[12px] border border-[#373639] shadow-lg z-30 max-h-[300px] overflow-y-auto">
            {isLoading ? (
              <div className="p-3 text-center text-white">
                <Loader className="animate-spin inline-block" />
              </div>
            ) : suggestions.length > 0 ? (
              suggestions.map((user) => (
                <div
                  key={user.username}
                  className="p-3 hover:bg-[#373639] cursor-pointer text-white flex items-center"
                  onMouseDown={() => handleSuggestionClick(user.username)}
                >
                  <Avatar className="size-6 mr-2">
                    {user.pfp ? (
                      <AvatarImage src={user.pfp} />
                    ) : (
                      <AvatarFallback className="bg-sky-900 text-white">
                        {user.username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <span>{user.username}</span>
                </div>
              ))
            ) : searchQuery.trim() && !isLoading ? (
              <div className="p-3 text-gray-400">No users found</div>
            ) : null}
          </div>
        )}
      </div>

      <div className="w-[100px] h-[26px] ml-[75px] text-white text-[12px] font-tektur flex">
        <Image
          src={`/assets/images/navbar/Trophy.svg`}
          alt="Trophy Icon"
          width={24}
          height={24}
          className="w-[24px] h-[24px] ml-[2px] mr-[10px]"
          quality={100}
        />
        <span className="mt-[3px]">{points} Points</span>
      </div>

      <div className="w-[96px] h-[26px] ml-[35px] text-white text-[12px] font-tektur flex">
        <Image
          src={`/assets/images/navbar/Diamond.svg`}
          alt="Diamond Icon"
          width={22}
          height={22}
          className="w-[22px] h-[22px] ml-[2px] mr-[10px]"
          quality={100}
        />
        <span className="mt-[3px]">{diamonds} Gems</span>
      </div>

      <Image
        src={`/assets/images/navbar/notification.svg`}
        alt="Notification Icon"
        width={22}
        height={22}
        className="w-[25px] h-[24px] ml-[28px] mr-[10px]"
        quality={100}
      />

      {status === "loading" ? (
        <div className="ml-[28px] mr-[10px]">
          <Loader className="animate-spin text-white" />
        </div>
      ) : session ? (
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger className="outline-none ml-[28px] mr-[10px]">
            <Avatar className="size-10 hover:opacity-75 transition cursor-pointer">
              <AvatarImage
                src={session.user?.image ?? ""}
                alt="User Avatar"
                className="size-10"
              />
              <AvatarFallback className="bg-sky-900 text-white">
                {session?.user?.name?.charAt(0).toUpperCase() ?? "?"}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-[#161618] border border-[#373639] rounded-lg shadow-lg text-white">
            <DropdownMenuItem onClick={() => router.push("/Profile/Achievements")}>
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/sign-in" })}>
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Image
          src={`/assets/images/navbar/User.svg`}
          onClick={() => router.push("/sign-up")}
          alt="User Icon"
          width={22}
          height={22}
          className="w-[40px] h-[40px] ml-[28px] mr-[10px] cursor-pointer"
          quality={100}
        />
      )}
    </div>
  );
};

export default Navbar;
