"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { signUpSchema } from "../schemas/zod.schemas";
import { createServerClient } from "../utils/supabase/server";

export const SignUp = async (userdata: z.infer<typeof signUpSchema>) => {
  const supabaseServer = await createServerClient();

  const { data, error } = await supabaseServer.auth.signUp({
    email: userdata.email,
    password: userdata.password,
    options: {
      data: { username: userdata.username },
    },
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

    await supabaseServer.auth.signOut();
  }

  revalidatePath("/", "layout");
  redirect("/");
};
