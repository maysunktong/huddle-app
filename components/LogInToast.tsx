"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import { createClient } from "../utils/supabase/client";
import { getLoginCookie } from "../utils/getLogInCookies";

export default function LoginToast() {
  useEffect(() => {
    const checkCookie = async () => {
      const hasToastCookie = getLoginCookie();
      if (!hasToastCookie) return;

      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data: profileData, error } = await supabase
        .from("profiles")
        .select("username")
        .eq("id", user.id)
        .single();

      const username = profileData?.username ?? "User";

      toast.success(`Welcome, ${username}!`);
    };

    checkCookie();
  }, []);

  return null;
}
