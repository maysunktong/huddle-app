"use server";

import { redirect } from "next/navigation";
import { createServerClient } from "../utils/supabase/server";


export const LogOut = async () => {
  const supabase = await createServerClient();
  supabase.auth.signOut();

  redirect("/");
};
