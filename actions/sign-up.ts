"use server";

import { redirect } from "next/navigation";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { signUpSchema } from "../schemas/zod.schemas";
import { createServerClient } from "../utils/supabase/server";

export const SignUp = async (userdata: z.infer<typeof signUpSchema>) => {
  const supabaseServer = await createServerClient();

  const {
    data: { user },
    error,
  } = await supabaseServer.auth.signUp(userdata);
  console.log(error);

  if (user && user.email) {
    const { error: profileError } = await supabaseServer
      .from("profiles")
      .insert(
        { id: user.id, email: user.email, username: userdata.username },
      );

    if (profileError) throw new Error(profileError.message);

    await supabaseServer.auth.signOut();
  }

  revalidatePath("/", "layout");
  redirect("login");
};
