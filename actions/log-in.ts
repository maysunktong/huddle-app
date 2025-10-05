"use server";

import { redirect } from "next/navigation";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { logInSchema } from "../schemas/zod.schemas";
import { createServerClient } from "../utils/supabase/server";

export const LogIn = async (userdata: z.infer<typeof logInSchema>) => {

  const parsedData = logInSchema.parse(userdata);

  const supabase = await createServerClient();
  const {
    data,
    error,
  } = await supabase.auth.signInWithPassword(parsedData);

  if (error) throw new Error(error.message);

  revalidatePath("/account");
  redirect("/account")
};
