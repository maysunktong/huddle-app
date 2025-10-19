"use server";

import { redirect } from "next/navigation";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { logInSchema } from "../schemas/zod.schemas";
import { createServerClient } from "../utils/supabase/server";
import { cookies } from "next/headers";

export const LogIn = async (userdata: z.infer<typeof logInSchema>) => {
  const supabase = await createServerClient();
  const cookieStore = await cookies();
  const parsedData = logInSchema.parse(userdata);

  const {
    data: { user },
    error: logInError,
  } = await supabase.auth.signInWithPassword(parsedData);
  if (!user) return;
  if (logInError) console.error(logInError.message);

  cookieStore.set("login_success", "true", {
    path: "/",
    maxAge: 10,
  });

  const 

  revalidatePath("/", "layout");
  redirect("/");
};
