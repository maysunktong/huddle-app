"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { signUpSchema } from "../schemas/zod.schemas";
import { createServerClient } from "../utils/supabase/server";

export const SignUp = async (userdata: z.infer<typeof signUpSchema>) => {
  const supabase = await createServerClient();
  const { data: { user }, error: signUpError } = await supabase.auth.signUp({
    email: userdata.email,
    password: userdata.password,
  });
  if (!user) return;
  if (signUpError) console.error(signUpError.message);

  if (user && user.email) {
    const { error: profileError } = await supabase
      .from("profiles")
      .insert({
        id: user.id,
        email: user.email,
        username: userdata.username,
      });
    if (profileError) console.error(profileError.message);

    const { error: activityLogError } = await supabase.from("logs")
      .insert({
        user_id: user.id,
        action: "Sign up",
        entity: "Create new account",
        entity_id: user.id
      })
    if (activityLogError) console.error(activityLogError.message)
  }

  revalidatePath("/", "layout");
  redirect("/");
};
