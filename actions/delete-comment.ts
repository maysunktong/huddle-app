'use server'
import { createClient } from "../utils/supabase/client";

export async function deleteComment(
  commentId: string,
) {
  const supabase = createClient();
  const { error } = await supabase
    .from("comments")
    .update({ content: "This comment has been deleted." })
    .eq("id", commentId);

  if (error) throw error;
  return true;
}
