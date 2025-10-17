"use server";

import { redirect } from "next/navigation";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { logInSchema } from "../schemas/zod.schemas";
import { createServerClient } from "../utils/supabase/server";
import { cookies } from "next/headers";

export const LogIn = async (userdata: z.infer<typeof logInSchema>) => {
  const cookieStore = await cookies();
  const parsedData = logInSchema.parse(userdata);

  const supabase = await createServerClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.signInWithPassword(parsedData);

  cookieStore.set("login_success", "true", {
    path: "/",
    maxAge: 10,
  });

  if (error) throw new Error(error.message);

  revalidatePath("/", "layout");
  redirect("/");
};
