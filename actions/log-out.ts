"use server";

import { redirect } from "next/navigation";
import { createServerClient } from "../utils/supabase/server";
import { revalidatePath } from "next/cache";


export const LogOut = async () => {
  const supabase = await createServerClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { error: activityLogError } = await supabase.from("logs")
    .insert({
      user_id: user.id,
      action: "Log out",
      entity: "User session ended",
      entity_id: user.id
    })
  if (activityLogError) console.error("Log Out Activity Log Error", activityLogError.message);

  supabase.auth.signOut();

  revalidatePath("/", "layout");
  redirect("/login");
};
