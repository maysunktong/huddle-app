'use server'

import { CommentType, CommentSchema } from "../schemas/zod.schemas";
import { createClient } from "../utils/supabase/client";

export async function insertComment(
  payload: Pick<CommentType, "content" | "post_id" | "user_id" | "parent_id">,
) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("comments")
    .insert(payload)
    .select()
    .single();
  if (error) throw error;
  return CommentSchema.parse(data);
}
