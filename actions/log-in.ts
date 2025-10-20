"use server";

import { redirect } from "next/navigation";

import { z } from "zod";
import { logInSchema } from "../schemas/zod.schemas";
import { createServerClient } from "../utils/supabase/server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export const LogIn = async (userdata: z.infer<typeof logInSchema>) => {
  const supabase = await createServerClient();
  const cookieStore = await cookies();
  const parsedData = logInSchema.parse(userdata);

  const {
    data: { user },
    error: logInError,
  } = await supabase.auth.signInWithPassword(parsedData);
  if (!user) throw Error("Not authorized");
  if (logInError) console.error("Log In Error", logInError.message);

  cookieStore.set("login_success", "true", {
    path: "/",
    maxAge: 10,
  });

  const { error: activityLogError } = await supabase.from("logs")
    .insert({
      user_id: user.id,
      action: "Log in",
      entity: "New log in",
      entity_id: user.id
    })
  if (activityLogError) console.error("Log In Activity Log Error", activityLogError.message);

  revalidatePath("/", "layout");
  redirect("/");
};
