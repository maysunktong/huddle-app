"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { createClient } from "../utils/supabase/client";
import { CardHeader, CardDescription } from "./ui/card";

interface UserProfile {
  id: string;
  username: string;
  avatar_url?: string | null;
}

export default function UserProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const supabase = createClient();

    async function fetchUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data: profileData, error } = await supabase
        .from("profiles")
        .select("id, username, avatar_url")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        return;
      }

      setProfile(profileData);
    }

    fetchUser();
  }, []);

  if (!profile) return null;

  return (
    <CardHeader className="flex gap-2 justify-start items-center px-2 md:px-0 py-2">
      <Avatar className="h-10 w-10 rounded-lg font-semibold">
        <AvatarFallback className="bg-[#ededed] text-black">
          {profile.username.slice(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <CardDescription className="text-md font-semibold text-foreground">
        {profile.username}
      </CardDescription>
    </CardHeader>
  );
}
