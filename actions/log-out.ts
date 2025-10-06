"use server";

import { redirect } from "next/navigation";
import { createServerClient } from "../utils/supabase/server";
import { revalidatePath } from "next/cache";


export const LogOut = async () => {
  const supabase = await createServerClient();
  supabase.auth.signOut();

  revalidatePath("/", "layout");
  redirect("/");
};
