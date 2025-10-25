'use server'

import { CommentSchema, CommentInsertType } from "../schemas/zod.schemas";
import { createServerClient } from "../utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function insertComment(payload: CommentInsertType) {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authorized");

  const { data, error } = await supabase
    .from("comments")
    .insert(payload)
    .select()
    .single();

  if (error) throw error;

  revalidatePath("/", "layout");

  return CommentSchema.parse(data);
}
