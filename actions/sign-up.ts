"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { signUpSchema } from "../schemas/zod.schemas";
import { createServerClient } from "../utils/supabase/server";
import { id } from "zod/v4/locales";

export const SignUp = async (userdata: z.infer<typeof signUpSchema>) => {
  const supabaseServer = await createServerClient();

  const { data, error } = await supabaseServer.auth.signUp({
    email: userdata.email,
    password: userdata.password,
  });

  if (error) {
    if (error.message.includes("User already registered")) {
      throw new Error("This email is already registered. Please sign in.");
    }

    throw new Error(error.message);
  }

  if (data.user && data.user.email) {
    const { error: profileError } = await supabaseServer
      .from("profiles")
      .insert({
        id: data.user.id,
        email: data.user.email,
        username: userdata.username,
      });

    if (profileError) throw new Error(profileError.message);

    const { error: activityLogError } = await supabaseServer.from("logs")
      .insert({
        user_id: data.user.id,
        action: "Sign up",
        entity: "new account",
        entity_id: data.user.id
      })

    if (activityLogError) throw new Error(activityLogError.message);

    await supabaseServer.auth.signOut();
  }

  revalidatePath("/", "layout");
  redirect("/");
};
