"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import { checkLoginCookie } from "../editor/utils/getLogInCookies";
import { createClient } from "../../utils/supabase/client";

export default function LoginToast() {
  useEffect(() => {
    const checkCookie = async () => {
      const hasToastCookie = await checkLoginCookie();

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

      toast.success(`Welcome back, ${username}!`);
    };

    checkCookie();
  }, []);

  return null;
}
