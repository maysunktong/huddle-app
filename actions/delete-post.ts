'use server'

import { revalidatePath } from "next/cache";
import { createServerClient } from "../utils/supabase/server";
import { redirect } from "next/navigation";

export async function deletePost(postId: string) {
  const supabase = await createServerClient();

  const { error } = await supabase
    .from("posts")
    .delete()
    .eq("id", postId);

  if (error) throw new Error(error.message);

  revalidatePath("/", "layout");
}
